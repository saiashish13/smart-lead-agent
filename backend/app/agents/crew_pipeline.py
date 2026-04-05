import os
import json
from textwrap import dedent
from flask import current_app

def create_crew_pipeline(product_name: str, target_person: str, industry: str, location: str, leads_limit: int = 10):
    """
    Constructs and runs a Langchain Pipeline representing our 3 Agents.
    Since Python 3.14 is incompatible with CrewAI, we orchestrate the LLM directly.
    """
    from langchain_groq import ChatGroq
    from langchain_core.prompts import ChatPromptTemplate
    import requests
    
    # Needs tavily instead of serper natively
    from tavily import TavilyClient
    tavily_client = TavilyClient(api_key=os.environ.get("TAVILY_API_KEY"))

    tavily_limit = leads_limit // 2
    github_limit = leads_limit - tavily_limit

    llm = ChatGroq(
        api_key=os.environ.get("GROQ_API_KEY"),
        model=os.environ.get("GROQ_MODEL", "llama-3.3-70b-versatile")
    )
    
    json_llm = llm.bind(response_format={"type": "json_object"})

    print("--- [Agent 1] Research Agent ---")
    search_res = tavily_client.search(
        query=f'{target_person} "{product_name}" {industry} {location} site:linkedin.com/in',
        max_results=max(1, tavily_limit)
    )
    
    research_prompt = ChatPromptTemplate.from_template(
        "You are a Lead Research Specialist.\n"
        "Extract a list of leads strictly matching: Product: {product_name}, Role: {target_person}, Industry: {industry}, Location: {location}.\n"
        "Search Context: {context}\n"
        "Return ONLY a valid JSON object with a single key 'leads' containing a list of objects (name, company, title, company_domain, linkedin, website)."
    )
    
    chain_research = research_prompt | json_llm
    res = chain_research.invoke({
        "product_name": product_name,
        "target_person": target_person,
        "industry": industry,
        "location": location,
        "context": json.dumps(search_res.get("results", []))
    })
    
    raw_text = res.content
    try:
        data = json.loads(raw_text)
        leads = data.get("leads", [])
    except:
        leads = []
        
    # GitHub Lead Search
    github_token = os.environ.get("GITHUB_TOKEN")
    if github_token and github_limit > 0:
        print(f"--- [GitHub Search] Fetching {github_limit} leads ---")
        headers = {"Authorization": f"token {github_token}"}
        gh_query = target_person
        if location:
            gh_query += f" location:{location}"
        
        try:
            gh_res = requests.get(
                f"https://api.github.com/search/users?q={gh_query}&per_page={github_limit}",
                headers=headers
            )
            if gh_res.status_code == 200:
                gh_data = gh_res.json()
                for item in gh_data.get("items", []):
                    leads.append({
                        "name": item.get("login"),
                        "company": "GitHub User",
                        "title": target_person,
                        "company_domain": "github.com",
                        "linkedin": item.get("html_url"),
                        "website": item.get("blog") or item.get("html_url")
                    })
        except Exception as e:
            print(f"GitHub Search Error: {e}")

    if not leads:
        return []

    print(f"--- [Agent 2] Verification Agent --- (Checking {len(leads)} leads)")
    from app.models import Lead
    from app.extensions import db
    
    verified_leads = []
    for lead in leads:
        email = lead.get('email', '')
        domain = lead.get('company_domain', '')
        
        dup_email = Lead.query.filter_by(email=email).first() if email else None
        dup_domain = Lead.query.filter_by(company_domain=domain).first() if domain else None
        
        if not dup_email and not dup_domain:
            verified_leads.append(lead)
            
    if not verified_leads:
        return []

    print(f"--- [Agent 3] Enrichment Agent --- (Enriching {len(verified_leads)} leads)")
    enrich_prompt = ChatPromptTemplate.from_template(
        "You are a Lead Data Enrichment Specialist.\n"
        "For each of the following leads, ensure they have a verified professional structure.\n"
        "Leads: {leads}\n"
        "Return ONLY a valid JSON object with a key 'leads' containing the list of enriched objects. Format emails correctly if missing (e.g. first.last@domain.com)."
    )
    
    chain_enrich = enrich_prompt | json_llm
    enrich_res = chain_enrich.invoke({
        "leads": json.dumps(verified_leads)
    })
    
    try:
        final_data = json.loads(enrich_res.content)
        final_leads = final_data.get("leads", [])
        return final_leads
    except:
        return verified_leads
