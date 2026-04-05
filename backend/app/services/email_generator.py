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
    description = lead.get('description')
    link = lead.get('link')

    subject = f"Quick question for {lead_name} at {company_name}"
    
    try:
        import os
        from langchain_groq import ChatGroq
        from langchain_core.prompts import ChatPromptTemplate
        
        llm = ChatGroq(
            api_key=os.environ.get("GROQ_API_KEY"),
            model=os.environ.get("GROQ_MODEL", "llama-3.3-70b-versatile")
        )
        
        prompt = ChatPromptTemplate.from_template(
            "You are an expert sales representative writing a personalized cold email.\n"
            "Strictly follow a clear structure.\n"
            "Explicitly use the product description to explain the value of {p_name} to the lead.\n"
            "Include the link specifically as a call to action at the end.\n\n"
            "Lead Name: {lead_name}\n"
            "Company: {company_name}\n"
            "Industry: {industry}\n"
            "Source: {source}\n"
            "Product Name: {p_name}\n"
            "Product Description: {description}\n"
            "Product Benefit: {p_benefit}\n"
            "Link: {link}\n\n"
            "Return ONLY the plain text email body without quotes."
        )
        
        chain = prompt | llm
        res = chain.invoke({
            "lead_name": lead_name,
            "company_name": company_name,
            "industry": industry,
            "source": source,
            "p_name": p_name,
            "description": description or "an innovative new tool",
            "p_benefit": p_benefit,
            "link": link or "our website"
        })
        body = res.content.strip()
    except Exception as e:
        print(f"Failed AI email generation: {e}")
        body = f"""Dear {lead_name},

I was looking into {company_name}'s presence on {source} and noticed your team's focus on innovative tech in the {industry} space. It's clear that scaling efficiently is a priority for you, especially given your recent work at {company_name}.
"""
        if description:
            body += f"\nI was particularly impressed by your work on: {description}\n"
        if link:
            body += f"Reference: {link}\n"
            
        body += f"""
I'm reaching out because we built {p_name} specifically for teams like yours. In short, it helps you {p_benefit}, which usually saves leaders in your position about 10+ hours a week on manual work.

I'd love to show you how we could specifically apply this to {company_name}'s current workflow. Are you open to a 10-minute sync next Tuesday or Wednesday?

Best regards,

[N.Sai Ashish]"""

    return body, subject
