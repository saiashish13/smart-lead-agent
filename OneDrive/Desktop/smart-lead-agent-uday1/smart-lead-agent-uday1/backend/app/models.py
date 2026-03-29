from datetime import datetime
import json
import bcrypt
from app.extensions import db

class Lead(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120))
    company = db.Column(db.String(120))
    email = db.Column(db.String(120), unique=True, index=True)
    linkedin = db.Column(db.String(255))
    company_domain = db.Column(db.String(255))
    source_url = db.Column(db.String(255))
    status = db.Column(db.String(50), default='New')

    # Keep a few legacy fields to avoid breaking the frontend entirely (or we can migrate them)
    industry = db.Column(db.String(100))
    product_name = db.Column(db.String(120))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'company': self.company,
            'email': self.email,
            'linkedin': self.linkedin,
            'company_domain': self.company_domain,
            'source_url': self.source_url,
            'status': self.status,
            'industry': self.industry,
            'product_name': self.product_name,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }


class DiscoverySession(db.Model):
    """Tracks synonyms, companies, and niches used in each discovery run for freshness."""
    __tablename__ = 'discovery_session'

    id              = db.Column(db.Integer, primary_key=True)
    product_name    = db.Column(db.String(120), index=True, nullable=False)
    used_synonyms   = db.Column(db.Text, default='[]')   # JSON list of synonym strings
    used_companies  = db.Column(db.Text, default='[]')   # JSON list of company names
    niche           = db.Column(db.String(120), index=True) # The niche/industry targeted
    leads_found     = db.Column(db.Integer, default=0)
    created_at      = db.Column(db.DateTime, default=datetime.utcnow)

    def get_used_synonyms(self):
        try:
            return json.loads(self.used_synonyms or '[]')
        except Exception:
            return []

    def get_used_companies(self):
        try:
            return json.loads(self.used_companies or '[]')
        except Exception:
            return []

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(128), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def set_password(self, password):
        salt = bcrypt.gensalt()
        self.password_hash = bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')

    def check_password(self, password):
        return bcrypt.checkpw(password.encode('utf-8'), self.password_hash.encode('utf-8'))

    def to_dict(self):
        return {
            'id': self.id,
            'email': self.email,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
