from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from utils import read_json, write_json
import os

auth_bp = Blueprint("auth", __name__)
DATA_DIR = os.path.join(os.path.dirname(__file__), "data")
USERS_FILE = os.path.join(DATA_DIR, "users.json")

def _next_id(items):
    return max([i.get("id", 0) for i in items], default=0) + 1

@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json() or {}
    email = data.get("email", "").strip().lower()
    password = data.get("password", "")
    username = data.get("username", "")

    if not email or not password:
        return jsonify({"error": "email and password required"}), 400

    users = read_json(USERS_FILE)
    if any(u["email"] == email for u in users):
        return jsonify({"error": "email already registered"}), 400

    new_user = {
        "id": _next_id(users),
        "email": email,
        "username": username,
        "password": generate_password_hash(password)  # hashed
    }
    users.append(new_user)
    write_json(USERS_FILE, users)
    # hide password from response
    resp = {k: v for k, v in new_user.items() if k != "password"}
    return jsonify(resp), 201

@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json() or {}
    email = data.get("email", "").strip().lower()
    password = data.get("password", "")

    users = read_json(USERS_FILE)
    user = next((u for u in users if u["email"] == email), None)
    if not user:
        return jsonify({"error": "invalid credentials"}), 401

    if not check_password_hash(user["password"], password):
        return jsonify({"error": "invalid credentials"}), 401

    resp = {k: v for k, v in user.items() if k != "password"}
    return jsonify(resp)
