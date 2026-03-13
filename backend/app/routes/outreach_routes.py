from flask import Blueprint, request, jsonify
from app.agents.outreach_agent import generate_outreach
from app.services.mailer import send_email

outreach_bp = Blueprint("outreach", __name__)

@outreach_bp.route("/", methods=["POST"])
def outreach():
    data = request.json
    return jsonify(generate_outreach(data))

@outreach_bp.route("/send-email", methods=["POST"])
def send_outreach_email():
    data = request.json
    to = data.get("to")
    subject = data.get("subject")
    body = data.get("body")

    if not all([to, subject, body]):
        return jsonify({"error": "Missing required fields: to, subject, body"}), 400

    try:
        send_email(to, subject, body)
        return jsonify({"message": f"Email sent successfully to {to}"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
