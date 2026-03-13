from flask import Blueprint, jsonify
from app.services.storage_service import load_leads
from app.extensions import db
from app.models import Lead

leads_bp = Blueprint("leads", __name__)

@leads_bp.route("/", methods=["GET"])
def get_leads():
    """Get all leads from the database"""
    try:
        leads = Lead.query.order_by(Lead.created_at.desc()).all()
        return jsonify({
            "success": True,
            "leads": [lead.to_dict() for lead in leads]
        })
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@leads_bp.route("/recent-sent", methods=["GET"])
def get_recent_sent():
    """Get the most recently emailed leads for the dashboard"""
    try:
        sent_leads = Lead.query.filter_by(status='processed').order_by(Lead.created_at.desc()).limit(10).all()
        return jsonify({
            "success": True,
            "leads": [lead.to_dict() for lead in sent_leads]
        })
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500
