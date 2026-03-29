from openai import OpenAI
from flask import current_app

def perform_research(lead):
    # Initialize OpenAI client with Groq configuration
    client = OpenAI(
        base_url=current_app.config['GROQ_BASE_URL'],
        api_key=current_app.config['GROQ_API_KEY']
    )
    model_id = current_app.config.get('GROQ_MODEL', 'llama-3.1-8b-instant')
    
    # Now run your research...
    response = client.chat.completions.create(
        model=model_id,
        messages=[{
            "role": "user",
            "content": f"Research this company: {lead.get('company', 'Unknown Company')}"
        }]
    )
    return response.choices[0].message.content