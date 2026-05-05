from flask import Blueprint, jsonify, request
from services.user_service import (
    get_all_users,
    get_user_by_id,
    delete_user_by_id,
    update_user_role,
    update_user_status
)
from utils.role_check import admin_only, token_required
import os, base64
from bson import ObjectId

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
# GET CURRENT USER (/users/me)
# ==============================
@user_bp.route("/users/me", methods=["GET"])
@token_required
def get_me(current_user):
    # ✅ Auto-logout: blocked/suspended user hits any API → 403
    is_blocked = current_user.get("is_blocked", False)
    status     = current_user.get("status", "active")
    if is_blocked or status in ["blocked", "suspended"]:
        return jsonify({
            "error": "Your account has been suspended. Contact support.",
            "code":  "ACCOUNT_SUSPENDED"
        }), 403
    return jsonify({"user": current_user}), 200

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
# BLOCK / UNBLOCK / STATUS
# ==============================
@user_bp.route("/users/<user_id>/status", methods=["PUT"])
@admin_only
def change_user_status(user_id):
    data = request.get_json()
    if not data or "is_blocked" not in data:
        return jsonify({"error": "Status value required"}), 400
    status_str = data.get("status", None)
    success, message = update_user_status(user_id, data["is_blocked"], status_str)
    if not success:
        return jsonify({"error": message}), 400
    return jsonify({"message": message}), 200

# ==============================
# GET USER FULL DETAILS (ADMIN)
# ==============================
@user_bp.route("/users/<user_id>/details", methods=["GET"])
@admin_only
def get_user_details(user_id):
    user = get_user_by_id(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404
    return jsonify(user), 200

# ==============================
# HEARTBEAT
# ==============================
@user_bp.route("/users/heartbeat", methods=["POST"])
def heartbeat():
    auth_header = request.headers.get("Authorization")
    if not auth_header:
        return jsonify({"error": "Token missing"}), 401
    try:
        import jwt as pyjwt
        from services.auth_service import SECRET_KEY
        token = auth_header.split(" ")[1]
        decoded = pyjwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        from services.user_service import update_last_seen
        update_last_seen(decoded["id"])
        return jsonify({"ok": True}), 200
    except Exception:
        return jsonify({"error": "Invalid token"}), 401

# ==============================
# UPDATE OWN PROFILE
# ==============================
@user_bp.route("/users/profile", methods=["PUT"])
@token_required
def update_profile(current_user):
    # ✅ Block check
    if current_user.get("is_blocked") or current_user.get("status") in ["blocked", "suspended"]:
        return jsonify({"error": "Account suspended", "code": "ACCOUNT_SUSPENDED"}), 403

    data = request.get_json()
    allowed = ["name", "phone", "city", "state", "target_exam", "designation", "institute_name"]
    update_data = {k: v for k, v in data.items() if k in allowed}

    if "designation" in update_data and update_data["designation"]:
        valid_designations = ["student", "professor", "other"]
        if update_data["designation"].lower() not in valid_designations:
            return jsonify({"error": f"Invalid designation. Must be one of: {', '.join(valid_designations)}"}), 400
        update_data["designation"] = update_data["designation"].lower()

    if "institute_name" in update_data and update_data["institute_name"]:
        update_data["institute_name"] = update_data["institute_name"].strip()

    if not update_data:
        return jsonify({"error": "Nothing to update"}), 400

    from services.user_service import update_user_profile
    success, result = update_user_profile(str(current_user["_id"]), update_data)
    if not success:
        return jsonify({"error": result}), 400
    return jsonify({"message": "Profile updated", "user": result}), 200

# ==============================
# UPLOAD AVATAR (base64)
# ==============================
@user_bp.route("/users/avatar", methods=["PUT"])
@token_required
def upload_avatar(current_user):
    data = request.get_json()
    avatar_b64 = data.get("avatar")
    if not avatar_b64:
        return jsonify({"error": "No image data"}), 400
    from services.user_service import update_user_profile
    success, result = update_user_profile(str(current_user["_id"]), {"avatar": avatar_b64})
    if not success:
        return jsonify({"error": result}), 400
    return jsonify({"message": "Avatar updated", "user": result}), 200

# ==============================
# CHANGE PASSWORD (logged-in)
# ==============================
@user_bp.route("/users/change-password", methods=["PUT"])
@token_required
def change_password(current_user):
    # ✅ Block check
    if current_user.get("is_blocked") or current_user.get("status") in ["blocked", "suspended"]:
        return jsonify({"error": "Account suspended", "code": "ACCOUNT_SUSPENDED"}), 403

    data = request.get_json()
    current_pw = data.get("current_password")
    new_pw     = data.get("new_password")
    if not current_pw or not new_pw:
        return jsonify({"error": "Both passwords required"}), 400
    if len(new_pw) < 6:
        return jsonify({"error": "Password must be at least 6 characters"}), 400

    from services.user_service import change_user_password
    success, message = change_user_password(str(current_user["_id"]), current_pw, new_pw)
    if not success:
        return jsonify({"error": message}), 400
    return jsonify({"message": message}), 200

# ==============================
# DELETE OWN ACCOUNT
# ==============================
@user_bp.route("/users/me/delete", methods=["DELETE"])
@token_required
def delete_own_account(current_user):
    from services.user_service import delete_user_by_id
    success, message = delete_user_by_id(str(current_user["_id"]))
    if not success:
        return jsonify({"error": message}), 400
    return jsonify({"message": "Account deleted successfully"}), 200

# ==============================
# SAVE FEEDBACK
# ==============================
@user_bp.route("/feedback", methods=["POST"])
def save_feedback():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "No data provided"}), 400
        from extensions import mongo
        from datetime import datetime
        feedback_doc = {
            "user_id":      data.get("user_id", ""),
            "user_email":   data.get("user_email", ""),
            "user_name":    data.get("user_name", ""),
            "modules":      data.get("modules", {}),
            "submitted_at": datetime.utcnow(),
        }
        mongo.db.feedback.insert_one(feedback_doc)
        return jsonify({"message": "Feedback saved, thank you!"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ==============================
# GET ALL FEEDBACK (ADMIN)
# ==============================
@user_bp.route("/feedback/all", methods=["GET"])
@admin_only
def get_all_feedback():
    try:
        from extensions import mongo
        feedbacks = list(mongo.db.feedback.find().sort("submitted_at", -1))
        for f in feedbacks:
            f["_id"] = str(f["_id"])
            f["submitted_at"] = str(f.get("submitted_at", ""))
        return jsonify(feedbacks), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
