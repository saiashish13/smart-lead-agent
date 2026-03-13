from flask import Blueprint, request, jsonify
from app.agents.enrichment_agent import enrich_lead

enrichment_bp = Blueprint("enrichment", __name__)

@enrichment_bp.route("/", methods=["POST"])
def enrich():
    data = request.json
    return jsonify(enrich_lead(data))
