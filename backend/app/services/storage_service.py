from app.extensions import db
from app.models import Lead

def load_leads():
    try:
        leads = Lead.query.all()
        return [lead.to_dict() for lead in leads]
    except Exception as e:
        print(f"Error loading leads from DB: {e}")
        return []

def save_leads(leads_data, product_name=None, link=None, description=None):
    try:
        count = 0
        for data in leads_data:
            email = data.get('email')
            linkedin = data.get('linkedin') or data.get('source_url')
            
            # Skip if no identifiers
            if not email and not linkedin:
                continue
                
            # Check for duplicates by email or LinkedIn URL
            existing = None
            if email:
                existing = Lead.query.filter_by(email=email).first()
            
            if not existing and linkedin:
                existing = Lead.query.filter_by(linkedin=linkedin).first()
                
            if existing:
                print(f"Skipping duplicate lead: {data.get('name')} ({email})")
                continue
                
            # Insert new lead
            new_lead = Lead(
                name=data.get('name'),
                company=data.get('company'),
                email=email,
                linkedin=linkedin,
                company_domain=data.get('company_domain'),
                source_url=data.get('source_url'),
                status=data.get('status', 'New'),
                industry=data.get('industry'),
                product_name=product_name,
                link=link,
                description=description
            )
            db.session.add(new_lead)
            count += 1
        
        db.session.commit()
        print(f"Saved {count} new unique leads.")
    except Exception as e:
        db.session.rollback()
        print(f"Error saving leads to DB: {e}")

def add_lead(lead_data):
    try:
        email = lead_data.get('email')
        if not email:
            return
            
        existing = Lead.query.filter_by(email=email).first()
        if existing:
            # Update? Or just skip? For now, let's update basic info
             existing.name = lead_data.get('name', existing.name)
             existing.company = lead_data.get('company', existing.company)
        else:
            new_lead = Lead(
                name=lead_data.get('name'),
                company=lead_data.get('company'),
                email=email,
                linkedin=lead_data.get('linkedin'),
                company_domain=lead_data.get('company_domain'),
                source_url=lead_data.get('source_url'),
                status=lead_data.get('status', 'New'),
                industry=lead_data.get('industry'),
                link=lead_data.get('link'),
                description=lead_data.get('description')
            )
            db.session.add(new_lead)
        
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        print(f"Error adding lead: {e}")
