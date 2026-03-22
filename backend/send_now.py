import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from dotenv import load_dotenv
from app import create_app  # Import create_app
from app.services.storage_service import load_leads
import sys

# Load env vars
load_dotenv(os.path.join(os.path.dirname(__file__), 'app', '.env'))

def send_test_emails():
    print("--- Gmail Terminal Sender ---")
    
    sender_email = os.getenv("MAIL_USERNAME")
    password = os.getenv("MAIL_PASSWORD")
    
    if not sender_email or not password:
        print("Error: MAIL_USERNAME or MAIL_PASSWORD not set in app/.env")
        return

    print(f"Gmail Address: {sender_email}")
    print(f"App Password (16 chars): {password}")

    # Connect to SMTP
    try:
        print("Connecting to Google...")
        server = smtplib.SMTP("smtp.gmail.com", 587)
        server.starttls()
        server.login(sender_email, password)
        print("[SUCCESS] Login verified.\n")
    except Exception as e:
        print(f"[ERROR] Login failed: {e}")
        return

    # Use app context to load leads
    app = create_app()
    with app.app_context():
        leads = load_leads()
        
    if not leads:
        print("No leads found in leads.csv")
        return

    # Send emails
    for lead in leads:
        to_email = lead.get("email")
        name = lead.get("name", "there")
        company = lead.get("company", "your company")
        
        if not to_email or "placeholder" in to_email:
            print(f"[SKIP] Invalid email for {name}: {to_email}")
            continue

        msg = MIMEMultipart()
        msg["From"] = sender_email
        msg["To"] = to_email
        msg["Subject"] = f"Hello {name}, question about {company}"
        
        body = f"""Hi {name},

I noticed your work at {company} and wanted to reach out.

We have a new solution that might help your team.

Best,
{sender_email}"""
        
        msg.attach(MIMEText(body, "plain"))

        try:
            server.sendmail(sender_email, to_email, msg.as_string())
            print(f"[OK] Sent to: {to_email}")
        except Exception as e:
            print(f"[FAIL] Could not send to {to_email}: {e}")

    server.quit()
    print("\nAll tasks finished.")

if __name__ == "__main__":
    send_test_emails()
