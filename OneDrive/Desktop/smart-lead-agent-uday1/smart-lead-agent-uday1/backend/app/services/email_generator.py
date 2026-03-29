from flask import current_app
from openai import OpenAI

def generate_email(lead):
    # Prefer the lead's stored product_name; fall back to config PRODUCT_NAME; then a generic fallback
    p_name = (lead.get('product_name') or '').strip() or \
             current_app.config.get("PRODUCT_NAME", "our platform")
    p_benefit = (lead.get('product_benefit') or '').strip() or \
                current_app.config.get("PRODUCT_BENEFIT", "automate your workflow and save time")

    print(f"Generating dynamic email for {lead.get('name')} | product={p_name!r}")
    
    # Initialize OpenAI client with Groq configuration
    client = OpenAI(
        base_url=current_app.config['GROQ_BASE_URL'],
        api_key=current_app.config['GROQ_API_KEY']
    )
    model_id = current_app.config.get('GROQ_MODEL', 'llama-3.1-8b-instant')

    prompt = f"""
    Write a short, professional, and highly personalized cold outreach email for a potential lead.
    
    Lead Name: {lead.get('name', 'there')}
    Company: {lead.get('company', 'your company')}
    Product being sold: {p_name}
    Key Benefit: {p_benefit}
    Industry: {lead.get('industry', 'Technology')}
    
    Guidelines:
    1. Keep it under 100 words.
    2. Mention something specific about their company or industry.
    3. Include a clear call to action (e.g., a 10-minute meeting).
    4. tone should be helpful and professional, not salesy.
    
    Output format:
    Subject: [Your Subject Line]
    [Email Body]
    """

    try:
        response = client.chat.completions.create(
            model=model_id,
            messages=[{"role": "user", "content": prompt}],
            temperature=0.7
        )
        content = response.choices[0].message.content
        
        # Parse subject and body
        lines = content.split('\n')
        subject = "Quick question for you"
        body = content
        
        for line in lines:
            if line.lower().startswith("subject:"):
                subject = line.replace("Subject:", "").strip()
                body = '\n'.join(lines[lines.index(line)+1:]).strip()
                break
                
        return body, subject

    except Exception as e:
        print(f"Error generating email with Groq: {e}")
        # Fallback to a simple template if LLM fails
        subject = f"Question for {lead.get('name')} at {lead.get('company')}"
        body = f"Hi {lead.get('name')},\n\nI noticed your work at {lead.get('company')} and thought {p_name} could help you {p_benefit}.\n\nBest regards,\n[Your Name]"
        return body, subject
