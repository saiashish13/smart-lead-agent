from flask import Blueprint, request, jsonify
from app.extensions import db
from app.models import User
import jwt
from datetime import datetime, timedelta
from app.config import Config
import functools
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests

auth_bp = Blueprint('auth', __name__)

def create_token(user_id):
    payload = {
        'exp': datetime.utcnow() + timedelta(hours=Config.JWT_EXPIRATION_HOURS),
        'iat': datetime.utcnow(),
        'sub': user_id
    }
    return jwt.encode(payload, Config.JWT_SECRET_KEY, algorithm='HS256')

def token_required(f):
    @functools.wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if 'Authorization' in request.headers:
            token = request.headers['Authorization'].split(" ")[1]
        
        if not token:
            return jsonify({'message': 'Token is missing!'}), 401
        
        try:
            data = jwt.decode(token, Config.JWT_SECRET_KEY, algorithms=['HS256'])
            current_user = User.query.get(data['sub'])
        except Exception as e:
            return jsonify({'message': 'Token is invalid!', 'error': str(e)}), 401
        
        return f(current_user, *args, **kwargs)
    return decorated

@auth_bp.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({'message': 'Email and password are required'}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({'message': 'User already exists'}), 400

    new_user = User(email=email)
    new_user.set_password(password)
    db.session.add(new_user)
    db.session.commit()

    token = create_token(new_user.id)
    return jsonify({'token': token, 'user': new_user.to_dict()}), 201

@auth_bp.route('/signin', methods=['POST'])
def signin():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({'message': 'Email and password are required'}), 400

    user = User.query.filter_by(email=email).first()
    if not user or not user.check_password(password):
        return jsonify({'message': 'Invalid credentials'}), 401

    token = create_token(user.id)
    return jsonify({'token': token, 'user': user.to_dict()}), 200

@auth_bp.route('/google', methods=['POST'])
def google_signin():
    data = request.get_json()
    token = data.get('token')

    if not token:
        return jsonify({'message': 'Token is required'}), 400

    try:
        # Specify the GOOGLE_CLIENT_ID of the app that accesses the backend:
        idinfo = id_token.verify_oauth2_token(
            token, 
            google_requests.Request(), 
            Config.GOOGLE_CLIENT_ID,
            clock_skew_in_seconds=10
        )

        # ID token is valid. Get the user's Google Account ID from the decoded token.
        email = idinfo['email']
        
        user = User.query.filter_by(email=email).first()
        if not user:
            # Create a new user if it doesn't exist
            user = User(email=email)
            # Google users don't have a local password, set a random one
            user.set_password(datetime.utcnow().isoformat()) 
            db.session.add(user)
            db.session.commit()

        jwt_token = create_token(user.id)
        return jsonify({'token': jwt_token, 'user': user.to_dict()}), 200

    except ValueError as e:
        # Invalid token
        return jsonify({'message': f'Invalid Google token: {str(e)}'}), 401

@auth_bp.route('/verify', methods=['GET'])
@token_required
def verify(current_user):
    return jsonify({'user': current_user.to_dict()}), 200
