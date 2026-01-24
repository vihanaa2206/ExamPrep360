from flask import Blueprint, jsonify, request
from services.user_service import get_all_users, get_user_by_id
from utils.role_check import admin_only

user_bp = Blueprint("user_bp", __name__)

# GET all users (ADMIN only)
@user_bp.route("/api/users", methods=["GET"])
@admin_only
def fetch_all_users():
    users = get_all_users()
    result = [user.to_dict() for user in users]
    return jsonify(result), 200


# GET single user profile
@user_bp.route("/api/users/<int:user_id>", methods=["GET"])
def fetch_user(user_id):
    user = get_user_by_id(user_id)

    if not user:
        return jsonify({"error": "User not found"}), 404

    return jsonify(user.to_dict()), 200
