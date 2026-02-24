from flask import Blueprint, jsonify, request
from services.user_service import (
    get_all_users,
    get_user_by_id,
    delete_user_by_id,
    update_user_role,
    update_user_status
)
from utils.role_check import admin_only

user_bp = Blueprint("user_bp", __name__)

# ==============================
# GET ALL USERS (ADMIN ONLY)
# ==============================
@user_bp.route("/users", methods=["GET"])
@admin_only
def fetch_all_users():
    users = get_all_users()
    return jsonify(users), 200


# ==============================
# GET SINGLE USER
# ==============================
@user_bp.route("/users/<user_id>", methods=["GET"])
def fetch_user(user_id):
    user = get_user_by_id(user_id)

    if not user:
        return jsonify({"error": "User not found"}), 404

    return jsonify(user), 200


# ==============================
# DELETE USER
# ==============================
@user_bp.route("/users/<user_id>", methods=["DELETE"])
@admin_only
def remove_user(user_id):
    success, message = delete_user_by_id(user_id)

    if not success:
        return jsonify({"error": message}), 400

    return jsonify({"message": message}), 200


# ==============================
# UPDATE ROLE
# ==============================
@user_bp.route("/users/<user_id>/role", methods=["PUT"])
@admin_only
def change_user_role(user_id):

    data = request.get_json()

    if not data or "role" not in data:
        return jsonify({"error": "Role is required"}), 400

    success, message = update_user_role(user_id, data["role"])

    if not success:
        return jsonify({"error": message}), 400

    return jsonify({"message": message}), 200


# ==============================
# BLOCK / UNBLOCK USER
# ==============================
@user_bp.route("/users/<user_id>/status", methods=["PUT"])
@admin_only
def change_user_status(user_id):

    data = request.get_json()

    if not data or "is_blocked" not in data:
        return jsonify({"error": "Status value required"}), 400

    success, message = update_user_status(user_id, data["is_blocked"])

    if not success:
        return jsonify({"error": message}), 400

    return jsonify({"message": message}), 200
