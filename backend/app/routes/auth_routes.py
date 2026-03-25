from flask import Blueprint, request, jsonify, url_for, redirect, current_app
from app.models import User
from app.extensions import db, oauth
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from datetime import timedelta
import os

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')

    if User.query.filter_by(username=username).first():
        return jsonify({"msg": "Username already exists"}), 400
    if User.query.filter_by(email=email).first():
        return jsonify({"msg": "Email already exists"}), 400

    new_user = User(username=username, email=email)
    new_user.set_password(password)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({"msg": "User created successfully"}), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    user = User.query.filter_by(email=email).first()
    if user and user.check_password(password):
        access_token = create_access_token(identity=str(user.id), expires_delta=timedelta(days=1))
        return jsonify(access_token=access_token, user=user.to_dict()), 200
    
    return jsonify({"msg": "Bad email or password"}), 401

@auth_bp.route('/me', methods=['GET'])
@jwt_required()
def me():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    return jsonify(user=user.to_dict()), 200

@auth_bp.route('/google')
def google_login():
    redirect_uri = url_for('auth.google_callback', _external=True)
    return oauth.google.authorize_redirect(redirect_uri)

@auth_bp.route('/google/callback')
def google_callback():
    token = oauth.google.authorize_access_token()
    user_info = token.get('userinfo')
    if not user_info:
        return jsonify({"msg": "Failed to get user info from Google"}), 400

    google_id = user_info.get('sub')
    email = user_info.get('email')
    username = user_info.get('name', email.split('@')[0])

    user = User.query.filter((User.google_id == google_id) | (User.email == email)).first()

    if not user:
        user = User(username=username, email=email, google_id=google_id)
        db.session.add(user)
    else:
        user.google_id = google_id  # Update google_id if it was a legacy email-only user
    
    db.session.commit()

    access_token = create_access_token(identity=str(user.id), expires_delta=timedelta(days=1))
    
    # Redirect back to frontend with the token
    frontend_url = os.getenv('FRONTEND_URL', 'http://localhost:3000')
    return redirect(f"{frontend_url}/auth/callback?token={access_token}")
