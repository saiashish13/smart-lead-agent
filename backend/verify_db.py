import sys
import os

# Ensure backend directory is in python path
current_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.append(current_dir)

from app import create_app
from app.models import Lead

app = create_app()

def verify():
    print("--- Verifying Database Content ---")
    try:
        with app.app_context():
            count = Lead.query.count()
            print(f"Total Leads in DB: {count}")
            
            leads = Lead.query.all()
            if leads:
                print("\nListing Leads:")
                for lead in leads:
                    print(f"- {lead.name} | {lead.email} | {lead.company} | Status: {lead.status}")
            else:
                print("No leads found.")
                
            print("\nDatabase connection successful.")
    except Exception as e:
        print(f"Error connecting to database: {e}")

if __name__ == "__main__":
    verify()
