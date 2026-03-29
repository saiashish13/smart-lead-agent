from flask import Blueprint, jsonify
from app.models import Lead, db

dashboard_bp = Blueprint('dashboard', __name__)

@dashboard_bp.route('/api/dashboard/stats', methods=['GET'])
def get_dashboard_stats():
    """Get real-time statistics for the dashboard"""
    try:
        total_leads = Lead.query.count()
        emails_sent = Lead.query.filter_by(status='processed').count()
        verified_leads = Lead.query.filter(Lead.email != None, Lead.email != '').count()
        
        # Count unique product names as "Active Campaigns"
        active_campaigns = db.session.query(Lead.product_name).filter(Lead.product_name != None).distinct().count() or 0
        
        return jsonify({
            "total_leads": total_leads,
            "emails_sent": emails_sent,
            "verified_leads": verified_leads,
            "active_campaigns": active_campaigns
        })
        
    except Exception as e:
        print(f"Error getting dashboard stats: {e}")
        return jsonify({
            "total_leads": 0,
            "emails_sent": 0,
            "verified_leads": 0,
            "active_campaigns": 0
        }), 500
