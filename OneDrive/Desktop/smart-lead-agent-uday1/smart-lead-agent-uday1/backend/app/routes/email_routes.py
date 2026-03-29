from flask import Blueprint, request, jsonify
from app.models import Lead, db
from app.services.email_generator import generate_email
from app.services.mailer import send_email
import traceback

email_bp = Blueprint('email', __name__)

@email_bp.route('/api/leads/<int:lead_id>/send-email', methods=['POST'])
def send_email_to_lead(lead_id):
    """Send email to a specific lead"""
    try:
        lead = Lead.query.get(lead_id)
        if not lead:
            return jsonify({"error": "Lead not found"}), 404
        
        # Get product details from request or config
        # Ideally these should come from the campaign/discovery context
        # For now we'll use config/defaults which can be updated via settings API in future
        
        # Generate personalized email content
        lead_dict = {
            'name': lead.name,
            'company': lead.company,
            'email': lead.email,
            'industry': lead.industry,
            'product_name': lead.product_name,
            'product_benefit': "Save time and automate your workflow",
            'url': lead.linkedin or lead.source_url or ""
        }
        
        email_body, subject = generate_email(lead_dict)
        
        # Send the email
        send_email(lead.email, subject, email_body)
        
        # Update lead status
        lead.status = 'processed'
        db.session.commit()
        
        return jsonify({
            "message": f"Email sent to {lead.email}",
            "success": True
        })
            
    except Exception as e:
        print(f"Error sending email: {e}")
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

@email_bp.route('/api/leads/<int:lead_id>', methods=['DELETE'])
def delete_lead(lead_id):
    """Delete a specific lead"""
    try:
        lead = Lead.query.get(lead_id)
        if not lead:
            return jsonify({"error": "Lead not found"}), 404
        
        db.session.delete(lead)
        db.session.commit()
        
        return jsonify({
            "message": "Lead deleted successfully",
            "success": True
        })
        
    except Exception as e:
        print(f"Error deleting lead: {e}")
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

@email_bp.route('/api/leads/clear', methods=['DELETE'])
def clear_all_leads():
    """Clear all leads"""
    try:
        Lead.query.delete()
        db.session.commit()
        
        return jsonify({
            "message": "All leads cleared successfully",
            "success": True
        })
        
    except Exception as e:
        print(f"Error clearing leads: {e}")
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500
