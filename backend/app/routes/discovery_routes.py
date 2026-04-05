from flask import Blueprint, request, jsonify
import logging
from app.agents.crew_pipeline import create_crew_pipeline
from app.services.storage_service import save_leads
from app.services.automation_service import process_all_leads

discovery_bp = Blueprint("discovery", __name__)

@discovery_bp.route("/search", methods=["POST"])
def search_leads():
    """
    Fresh-packet lead search.

    Request Body:
    {
        "query": "Head of Engineering",
        "product_name": "MyApp",
        "industry": "Fintech",
        "location": "San Francisco, CA"
    }
    """
    try:
        data = request.get_json() or {}

        query               = data.get("query", "software developers")
        product_name        = data.get("product_name", "Our Software Product")
        link                = data.get("link")
        description         = data.get("description")
        industry            = data.get("industry", "Technology")
        location            = data.get("location", "United States")
        leads_limit         = int(data.get("leads_limit", 10))

        print(f"[route] Triggering pipeline for: product={product_name!r} target={query!r} industry={industry!r} location={location!r} limit={leads_limit}")

        from app.agents.crew_pipeline import create_crew_pipeline
        from app.services.storage_service import save_leads
        raw_leads = create_crew_pipeline(
            product_name=product_name,
            target_person=query,
            industry=industry,
            location=location,
            leads_limit=leads_limit
        )

        if not raw_leads:
            return jsonify({
                "success": False,
                "message": "No leads found. Try a different search term.",
                "leads_found": 0,
                "leads": []
            }), 200

        # Save to DB
        save_leads(raw_leads, product_name=product_name, link=link, description=description)

        return jsonify({
            "success": True,
            "message": f"Found {len(raw_leads)} fresh leads.",
            "leads_found": len(raw_leads),
            "leads": raw_leads
        }), 200

    except Exception as e:
        print(f"Error in search_leads: {e}")
        return jsonify({
            "success": False,
            "error": str(e),
            "message": "An error occurred while searching for leads"
        }), 500
