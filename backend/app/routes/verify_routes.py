from flask import Blueprint, request, jsonify
from app.agents.verify_agent import verify_lead

verify_bp = Blueprint("verify", __name__)

@verify_bp.route("/", methods=["POST"])
def verify():
    data = request.json
    return jsonify(verify_lead(data))
