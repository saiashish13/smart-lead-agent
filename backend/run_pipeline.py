import sys
import os

# Ensure backend directory is in python path
current_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.append(current_dir)

from app import create_app
from app.services.automation_service import process_all_leads

app = create_app()

def run_pipeline():
    print("--- Starting Lead Automation Pipeline ---")
    try:
        with app.app_context():
            result = process_all_leads()
            print("\nPipeline Execution Completed.")
            print(f"Status: {result.get('status')}")
            print(f"Processed Leads: {result.get('processed_count')}")
            
    except Exception as e:
        print(f"\n[ERROR] Pipeline failed: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    run_pipeline()
