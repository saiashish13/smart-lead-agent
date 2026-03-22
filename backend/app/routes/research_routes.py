from flask import Blueprint, request, jsonify
from app.agents.research_agent import research_leads

research_bp = Blueprint("research", __name__)

@research_bp.route("/", methods=["POST"])
def research():
    data = request.json
    result = research_leads(data)
    return jsonify(result)
