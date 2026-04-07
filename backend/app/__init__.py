from flask import Flask
from app.config import Config
from flask_cors import CORS
from app.celery import celery


def create_app():
    app = Flask(__name__)
    CORS(app)
    app.config.from_object(Config)

    # 🔌 Initialize Extensions
    from app.extensions import db, migrate, bcrypt, jwt, oauth
    db.init_app(app)
    migrate.init_app(app, db)
    bcrypt.init_app(app)
    jwt.init_app(app)
    oauth.init_app(app)

    # 🔐 Google OAuth
    oauth.register(
        name='google',
        client_id=app.config.get('GOOGLE_CLIENT_ID'),
        client_secret=app.config.get('GOOGLE_CLIENT_SECRET'),
        server_metadata_url='https://accounts.google.com/.well-known/openid-configuration',
        client_kwargs={'scope': 'openid email profile'},
    )

    # 📦 Load Models
    from app import models

    # 🗄️ Create DB Tables
    with app.app_context():
        db.create_all()

    # 📧 Mail Setup
    from app.services.mailer import mail
    mail.init_app(app)

    # 📡 Register Blueprints
    from app.routes.research_routes import research_bp
    from app.routes.enrichment_routes import enrichment_bp
    from app.routes.verify_routes import verify_bp
    from app.routes.outreach_routes import outreach_bp
    from app.routes.automation_routes import automation_bp
    from app.routes.discovery_routes import discovery_bp
    from app.routes.leads_routes import leads_bp
    from app.routes.email_routes import email_bp
    from app.routes.auth_routes import auth_bp
    from app.routes.dashboard_routes import dashboard_bp

    app.register_blueprint(research_bp, url_prefix="/api/research")
    app.register_blueprint(enrichment_bp, url_prefix="/api/enrich")
    app.register_blueprint(verify_bp, url_prefix="/api/verify")
    app.register_blueprint(outreach_bp, url_prefix="/api/outreach")
    app.register_blueprint(automation_bp, url_prefix="/api/automation")
    app.register_blueprint(discovery_bp, url_prefix="/api/campaign")
    app.register_blueprint(leads_bp, url_prefix="/api/leads")
    app.register_blueprint(email_bp)
    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(dashboard_bp)

    # 🏠 Home Route
    @app.route('/')
    def home():
        return "<h1>Lead Agent Server is Running!</h1><p>Check /admin for the dashboard.</p>"

    # ⚡ Configure Celery with Flask Context
    class ContextTask(celery.Task):
        def __call__(self, *args, **kwargs):
            with app.app_context():
                return self.run(*args, **kwargs)

    celery.Task = ContextTask
    celery.conf.update(app.config)

    return app
