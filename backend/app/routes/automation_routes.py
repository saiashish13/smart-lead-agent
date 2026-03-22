from flask import Blueprint, jsonify
from app.services.automation_service import process_all_leads, LOG_BUFFER

automation_bp = Blueprint("automation", __name__)

@automation_bp.route("/run", methods=["POST"])
def run_automation():
    results = process_all_leads()
    return jsonify(results)

@automation_bp.route("/logs", methods=["GET"])
def get_logs():
    return jsonify(LOG_BUFFER)
