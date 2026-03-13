from flask_admin import Admin
from flask_admin.contrib.sqla import ModelView
from app.database.db import db
from app.models.lead_model import Lead

def setup_admin(app):
    admin = Admin(app, name="SmartLead Admin", template_mode="bootstrap4")
    admin.add_view(ModelView(Lead, db.session))
