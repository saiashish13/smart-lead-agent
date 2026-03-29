from flask import Flask
from app.config import Config
from flask_cors import CORS

def create_app():
    app = Flask(__name__)
    CORS(app, resources={r"/api/*": {"origins": ["http://localhost:3000", "http://127.0.0.1:3000"]}}, supports_credentials=True)
    app.config.from_object(Config)

    from app.extensions import db, migrate
    db.init_app(app)
    migrate.init_app(app, db)
    
    from app import models # Verify models are loaded
    
    with app.app_context():
        db.create_all()

    from app.services.mailer import mail
    mail.init_app(app)

    from app.routes.research_routes import research_bp
    from app.routes.enrichment_routes import enrichment_bp
    from app.routes.verify_routes import verify_bp
    from app.routes.outreach_routes import outreach_bp
    from app.routes.automation_routes import automation_bp
    from app.routes.discovery_routes import discovery_bp
    from app.routes.leads_routes import leads_bp
    from app.routes.email_routes import email_bp
    from app.routes.auth_routes import auth_bp

    app.register_blueprint(research_bp, url_prefix="/api/research")
    app.register_blueprint(enrichment_bp, url_prefix="/api/enrich")
    app.register_blueprint(verify_bp, url_prefix="/api/verify")
    app.register_blueprint(outreach_bp, url_prefix="/api/outreach")
    app.register_blueprint(automation_bp, url_prefix="/api/automation")
    app.register_blueprint(discovery_bp, url_prefix="/api/campaign")
    app.register_blueprint(leads_bp, url_prefix="/api/leads")
    app.register_blueprint(email_bp)
    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    
    from app.routes.dashboard_routes import dashboard_bp
    app.register_blueprint(dashboard_bp)

    @app.route('/')
    def home():
        return "<h1>Lead Agent Server is Running!</h1><p>Check /admin for the dashboard.</p>"

    return app
