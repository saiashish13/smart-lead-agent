from flask import current_app

def generate_email(lead):
    # Prefer the lead's stored product_name; fall back to config PRODUCT_NAME; then a generic fallback
    p_name = (lead.get('product_name') or '').strip() or \
             current_app.config.get("PRODUCT_NAME", "our platform")
    p_benefit = (lead.get('product_benefit') or '').strip() or \
                current_app.config.get("PRODUCT_BENEFIT", "automate your workflow and save time")

    print(f"Generating email for {lead.get('name')} | product={p_name!r}")
    
    # Extract lead details with fallbacks
    lead_name = lead.get('name', 'there')
    company_name = lead.get('company', 'your company')
    
    # Determine source (LinkedIn/GitHub)
    # This is a simple heuristic - can be improved if source is explicitly stored
    source = "LinkedIn"
    if "github" in str(lead.get('url', '')).lower():
        source = "GitHub"
        
    industry = lead.get('industry', 'tech')

    # Custom Template
    subject = f"Quick question for {lead_name} at {company_name}"
    
    body = f"""Dear {lead_name},

I was looking into {company_name}'s presence on {source} and noticed your team's focus on innovative tech in the {industry} space. It's clear that scaling efficiently is a priority for you, especially given your recent work at {company_name}.

I'm reaching out because we built {p_name} specifically for teams like yours. In short, it helps you {p_benefit}, which usually saves leaders in your position about 10+ hours a week on manual work.

I'd love to show you how we could specifically apply this to {company_name}'s current workflow. Are you open to a 10-minute sync next Tuesday or Wednesday?

Best regards,

[Your Name]"""

    return body, subject
