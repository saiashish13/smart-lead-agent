from app.services.storage_service import load_leads, save_leads
from app.agents.research_agent import research_leads
from app.agents.enrichment_agent import enrich_lead
from app.agents.verify_agent import verify_lead
from app.agents.outreach_agent import generate_outreach
from app.services.mailer import send_email
import datetime

# Simple in-memory log buffer for the frontend "Pulse"
LOG_BUFFER = []

def log(message):
    timestamp = datetime.datetime.now().strftime("%H:%M:%S")
    entry = {"time": timestamp, "message": message}
    LOG_BUFFER.append(entry)
    # Keep only last 100 logs
    if len(LOG_BUFFER) > 100:
        LOG_BUFFER.pop(0)
    print(f"[{timestamp}] {message}")

def process_all_leads():
    log("Starting automation cycle...")
    leads = load_leads()
    for lead in leads:
        if lead.get("status") == "processed":
            continue
            
        try:
            # Step 1: Research
            log(f"Researching {lead.get('company', 'Unknown')}...")
            research_data = research_leads(lead)
            lead.update(research_data)
            
            # Step 2: Enrichment
            log(f"Enriching data for {lead.get('company')}...")
            enrich_data = enrich_lead(lead)
            lead.update(enrich_data)
            
            # Step 3: Verification
            log(f"Verifying lead {lead.get('email')}...")
            verify_data = verify_lead(lead)
            lead.update(verify_data)
            
            # Step 4: Outreach
            log(f"Generating outreach for {lead.get('company')}...")
            outreach_data = generate_outreach(lead)
            lead["outreach_email"] = outreach_data.get("email")
            
            # Step 5: Send Email
            recipient = lead.get("email")
            if recipient:
                subject = f"Outreach for {lead.get('company', 'your company')}"
                log(f"Sending email to {recipient}...")
                send_email(recipient, subject, lead["outreach_email"])
                lead["email_sent"] = "Yes"
            
            lead["status"] = "processed"
            log(f"Completed processing for {lead.get('company')}")
        except Exception as e:
            error_msg = f"Error processing {lead.get('company')}: {str(e)}"
            log(error_msg)
            lead["status"] = f"error: {str(e)}"
            
    save_leads(leads)
    log(f"Automation cycle finished. Processed {len(leads)} leads.")
    return {"status": "Automation completed", "processed_count": len(leads)}
