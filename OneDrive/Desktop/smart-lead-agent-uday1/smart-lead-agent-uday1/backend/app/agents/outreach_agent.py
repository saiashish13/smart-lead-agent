from app.services.email_generator import generate_email

def generate_outreach(lead):
    email = generate_email(lead)
    return {"email": email}
