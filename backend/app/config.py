import os
from dotenv import load_dotenv

basedir = os.path.abspath(os.path.dirname(__file__))
env_path = os.path.join(basedir, '.env')
load_dotenv(dotenv_path=env_path)  # Ensure env vars are loaded

class Config:
    SECRET_KEY = os.getenv("SECRET_KEY", "default-secret-key")
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "default-jwt-secret-key")
    
    # Database Configuration
    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL", "sqlite:///leads_v2.db")
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # HuggingFace Configuration
    HF_TOKEN = os.getenv("HF_TOKEN")
    HF_MODEL = os.getenv("HF_MODEL", "Qwen/Qwen2.5-7B-Instruct")
    HF_BASE_URL = os.getenv("HF_BASE_URL", "https://api-inference.huggingface.co/v1")

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
