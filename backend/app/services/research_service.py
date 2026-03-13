from openai import OpenAI
from flask import current_app

def perform_research(lead):
    # Initialize OpenAI client with HuggingFace router
    client = OpenAI(
        base_url=current_app.config['HF_BASE_URL'],
        api_key=current_app.config['HF_TOKEN']
    )
    model_id = current_app.config.get('HF_MODEL', 'meta-llama/Llama-3.1-8B-Instruct:novita')
    
    # Now run your research...
    response = client.chat.completions.create(
        model=model_id,
        messages=[{
            "role": "user",
            "content": f"Research this company: {lead.get('company', 'Unknown Company')}"
        }]
    )
    return response.choices[0].message.content