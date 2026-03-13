import re
import json
import random
import os
from tavily import TavilyClient
from openai import OpenAI
from flask import current_app
from app.services.email_finder import find_best_email, extract_email_from_text

# ---------------------------------------------------------------------------
# Synonym Bank – grouped by persona archetype.
# Each run picks a RANDOM subset so DDG returns fresh, non-overlapping results.
# ---------------------------------------------------------------------------
SYNONYM_BANK = {
    "engineer": [
        "software engineer", "software developer", "backend developer",
        "full-stack developer", "frontend developer", "platform engineer",
        "infrastructure engineer", "senior engineer", "staff engineer",
        "principal engineer", "engineering lead", "tech lead",
    ],
    "founder": [
        "startup founder", "co-founder", "technical founder", "CTO",
        "CEO startup", "founder & CEO", "entrepreneur", "indie hacker",
    ],
    "data": [
        "data scientist", "data engineer", "ML engineer", "AI engineer",
        "machine learning researcher", "analytics engineer", "BI developer",
    ],
    "product": [
        "product manager", "head of product", "VP product", "product lead",
        "growth manager", "director of product",
    ],
    "executive": [
        "CTO", "VP Engineering", "Director of Engineering",
        "Head of Engineering", "VP Technology", "Chief Architect",
        "SVP Engineering", "Technical Director",
    ],
    "devops": [
        "DevOps engineer", "SRE", "site reliability engineer",
        "cloud engineer", "platform engineer", "Kubernetes engineer",
    ],
}

# Direct-profile URL patterns (no search/directory pages)
PROFILE_URL_PATTERNS = [
    re.compile(r'https?://(www\.)?linkedin\.com/in/[^/?#]+/?$'),
    re.compile(r'https?://(www\.)?github\.com/[^/?#]+/?$'),
]


def _is_direct_profile_url(url: str) -> bool:
    """Return True only if url is a direct LinkedIn /in/ or GitHub user profile."""
    if not url:
        return False
    return any(p.match(url) for p in PROFILE_URL_PATTERNS)


def _pick_synonyms(query: str, n: int = 3) -> list[str]:
    """
    Pick `n` synonyms that are related to `query`, drawing from the bank.
    Falls back to the raw query if nothing matches.
    """
    query_lower = query.lower()
    # Find matching archetype buckets
    matched = []
    for archetype, synonyms in SYNONYM_BANK.items():
        if (archetype in query_lower or
                any(s.split()[0] in query_lower for s in synonyms)):
            matched.extend(synonyms)

    if not matched:
        # Use all synonyms as fallback pool
        for synonyms in SYNONYM_BANK.values():
            matched.extend(synonyms)

    # Remove duplicates and the exact query itself (case-insensitive)
    pool = [s for s in set(matched) if s.lower() != query_lower]
    random.shuffle(pool)
    selected = pool[:n]

    # Always include the original user query as the primary term
    return [query] + selected


def _get_past_exclusions(product_name: str) -> list[str]:
    """
    Read all previous DiscoverySession rows for this product and
    return used_companies to exclude.
    """
    try:
        from app.models import DiscoverySession
        sessions = DiscoverySession.query.filter_by(product_name=product_name).all()
        companies: set[str] = set()
        for s in sessions:
            companies.update(s.get_used_companies())
        return list(companies)
    except Exception as e:
        print(f"Could not load past exclusions: {e}")
        return []


def _save_session(product_name: str, synonyms: list[str],
                  companies: list[str], niche: str, leads_found: int):
    """Persist a discovery session so future runs can exclude these companies."""
    try:
        from app.extensions import db
        from app.models import DiscoverySession
        session = DiscoverySession(
            product_name=product_name,
            used_synonyms=json.dumps(synonyms),
            used_companies=json.dumps(companies),
            leads_found=leads_found,
        )
        db.session.add(session)
        db.session.commit()
        print(f"Saved discovery session: {len(companies)} companies")
    except Exception as e:
        print(f"Could not save discovery session: {e}")


def _product_benefit(product_name: str) -> str:
    if not product_name:
        return "automate your workflow"
    p = product_name.lower()
    if "schedul" in p:
        return "automate your scheduling and save time"
    if "email" in p or "reach" in p:
        return "personalize your outreach at scale"
    if "lead" in p:
        return "automate lead research in seconds"
    if "data" in p:
        return "turn your data into actionable insights"
    return f"optimize your {product_name} workflow"


# ---------------------------------------------------------------------------
# Main entry point
# ---------------------------------------------------------------------------

def discover_leads(
    query,
    product_name=None,
    niche=None,
    limit=8,
    excluded_companies=None,   # manual override list; auto-populated from DB when None
):
    """
    Fresh-packet lead discovery.

    Each call automatically:
    - Loads past companies from DB and excludes them
    - Rotates search synonyms so DDG surfaces different results
    - Enforces direct-profile source_url (linkedin.com/in/ or github.com/)
    - Saves a DiscoverySession so the *next* run excludes today's companies
    """
    print(f"[fresh-discovery] query={query!r} product={product_name!r} limit={limit}")

    # ── 1. Build exclusion lists ──────────────────────────────────────────
    if excluded_companies is None:
        past_companies = _get_past_exclusions(product_name or "")
    else:
        past_companies = list(excluded_companies)

    excluded_companies_lower = {c.lower() for c in past_companies}
    print(f"[fresh-discovery] Excluding {len(excluded_companies_lower)} previously seen companies")

    # ── 2. Synonym rotation ───────────────────────────────────────────────
    synonyms = _pick_synonyms(query, n=3)
    print(f"[fresh-discovery] Synonyms this run: {synonyms}")

    benefit = _product_benefit(product_name)

    # ── 3. Build DDG query strategies (niche-aware) ───────────────────────
    niche_str = niche.strip() if niche else ""
    persona_terms = " OR ".join(f'"{s}"' for s in synonyms[:2])  # top 2

    def make_queries(term: str) -> list[str]:
        base = f'({term})'
        niche_suffix = f' "{niche_str}"' if niche_str else ""
        if product_name:
            return [
                f'{base}{niche_suffix} "{product_name}" (site:linkedin.com/in OR site:github.com)',
                f'{base}{niche_suffix} site:linkedin.com/in OR site:github.com',
                f'{base}{niche_suffix} "{product_name}"',
                f'{base}{niche_suffix} professional email contact',
                f'{base}{niche_suffix}',
            ]
        return [
            f'{base}{niche_suffix} site:linkedin.com/in OR site:github.com',
            f'{base}{niche_suffix} professional email contact',
            f'{base}{niche_suffix}',
        ]

    tavily_client = TavilyClient(api_key=os.environ.get("TAVILY_API_KEY"))
    search_results = []
    used_tavily_query = ""

    # Try persona synonyms in rotation until we get results
    for synonym in synonyms:
        if search_results:
            break
        for q in make_queries(synonym):
            print(f"[fresh-discovery] Tavily: {q}")
            try:
                response = tavily_client.search(query=q, max_results=limit * 4)
                results = response.get("results", [])
                if results:
                    print(f"[fresh-discovery] ✓ {len(results)} results")
                    search_results = results
                    used_tavily_query = q
                    break
            except Exception as e:
                print(f"[fresh-discovery] ✗ error: {e}")

    if not search_results:
        print("[fresh-discovery] ⚠ All queries failed, returning []")
        return []

    # ── 4. AI extraction ──────────────────────────────────────────────────
    client = OpenAI(
        base_url="https://api.groq.com/openai/v1",
        api_key=current_app.config.get('GROQ_API_KEY', os.environ.get('GROQ_API_KEY'))
    )
    model_id = current_app.config.get('GROQ_MODEL', os.environ.get('GROQ_MODEL', 'llama-3.1-8b-instant'))

    niche_clause = f" in the niche: {niche_str}" if niche_str else ""
    product_clause = f" interested in or working with {product_name}" if product_name else ""

    prompt = f"""You are a lead research assistant. Extract REAL professional profiles{product_clause}{niche_clause} from these search results.

CRITICAL INSTRUCTIONS:
1. Extract ACTUAL names, companies, and job titles — no fabrications.
2. source_url MUST be a direct LinkedIn profile (linkedin.com/in/<handle>) or GitHub profile (github.com/<handle>). NO search pages, NO company pages.
3. Each lead needs: "name", "company", "title", "source_url".
4. Skip any result that does not have a clear LinkedIn or GitHub PROFILE URL.

Return ONLY a valid JSON object:
{{
    "leads": [
        {{
            "name": "Sarah Chen",
            "company": "TechFlow",
            "title": "Senior Software Engineer",
            "source_url": "https://linkedin.com/in/sarahchen"
        }}
    ]
}}

Search Results (Note: 'url' maps to source_url, 'content' maps to description):
{json.dumps(search_results[:20], indent=2)}
"""

    try:
        response = client.chat.completions.create(
            model=model_id,
            messages=[{"role": "user", "content": prompt}],
            response_format={"type": "json_object"}
        )
        response_text = response.choices[0].message.content
        print(f"[fresh-discovery] AI response (200 chars): {response_text[:200]}")
    except Exception as e:
        print(f"[fresh-discovery] AI call failed: {e}")
        return []

    # ── 5. Parse AI response ─────────────────────────────────────────────
    try:
        parsed = json.loads(response_text)
        if isinstance(parsed, dict):
            extracted = (parsed.get('leads') or parsed.get('data')
                         or parsed.get('results') or [])
            if not extracted:
                for v in parsed.values():
                    if isinstance(v, list):
                        extracted = v
                        break
        elif isinstance(parsed, list):
            extracted = parsed
        else:
            extracted = []
    except json.JSONDecodeError as e:
        print(f"[fresh-discovery] JSON parse error: {e}")
        return []

    print(f"[fresh-discovery] Extracted {len(extracted)} raw leads")

    # ── 6. Filter, deduplicate, enforce direct-profile URLs ───────────────
    final_leads = []
    session_companies: list[str] = []

    for lead in extracted:
        if not isinstance(lead, dict):
            continue
        if 'name' not in lead or 'company' not in lead:
            continue

        company = (lead.get('company') or '').strip()
        source_url = (lead.get('source_url') or '').strip()

        # Enforce direct-profile URL
        if not _is_direct_profile_url(source_url):
            print(f"[fresh-discovery] ✗ Non-profile URL skipped: {source_url!r}")
            continue

        # Exclude companies seen in previous runs
        if company.lower() in excluded_companies_lower:
            print(f"[fresh-discovery] ✗ Excluded company: {company!r}")
            continue

        # Add enrichment fields
        lead['product_benefit'] = benefit
        lead['title'] = lead.get('title') or query
        lead['status'] = 'discovered'

        # Email
        email = extract_email_from_text(source_url) or find_best_email(lead['name'], company)
        lead['email'] = email

        session_companies.append(company)
        final_leads.append(lead)

        if len(final_leads) >= limit:
            break

    print(f"[fresh-discovery] Returning {len(final_leads)} valid leads")

    # ── 7. Persist session ────────────────────────────────────────────────
    if product_name and final_leads:
        _save_session(
            product_name=product_name,
            synonyms=synonyms,
            companies=session_companies,
            niche=niche_str,
            leads_found=len(final_leads),
        )

    # Attach freshness metadata to first lead as a carrier (route will pop it)
    if final_leads:
        final_leads[0]['_meta'] = {
            'synonyms_used': synonyms,
            'niche': niche_str,
            'excluded_companies_count': len(excluded_companies_lower),
        }

    return final_leads
