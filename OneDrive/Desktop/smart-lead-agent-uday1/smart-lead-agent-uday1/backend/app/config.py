import os
from dotenv import load_dotenv

basedir = os.path.abspath(os.path.dirname(__file__))
env_path = os.path.join(basedir, '.env')
load_dotenv(dotenv_path=env_path)  # Ensure env vars are loaded

class Config:
    # Database Configuration
    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL", "sqlite:///leads_v2.db")
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SECRET_KEY = os.getenv("SECRET_KEY")
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")
    JWT_EXPIRATION_HOURS = 24

    # Google OAuth
    GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
    GOOGLE_CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET")
    FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:3000")

    # Groq Configuration
    GROQ_API_KEY = os.getenv("GROQ_API_KEY")
    GROQ_MODEL = os.getenv("GROQ_MODEL", "llama-3.1-8b-instant")
    GROQ_BASE_URL = "https://api.groq.com/openai/v1"

    # Tavily Search API
    TAVILY_API_KEY = os.getenv("TAVILY_API_KEY")
    SUPABASE_KEY = os.getenv("SUPABASE_KEY")
    

    CELERY_BROKER_URL = "redis://localhost:6379/0"

    MAIL_SERVER = "smtp.gmail.com"
    MAIL_PORT = 587
    MAIL_USE_TLS = True
    MAIL_USERNAME = os.getenv("MAIL_USERNAME")
    MAIL_PASSWORD = os.getenv("MAIL_PASSWORD")
    MAIL_DEFAULT_SENDER = os.getenv("MAIL_USERNAME")
    
    # Default Product Info (Can be overridden dynamically)
    PRODUCT_NAME = "Lead Agent"
    PRODUCT_BENEFIT = "automate lead research in seconds"
