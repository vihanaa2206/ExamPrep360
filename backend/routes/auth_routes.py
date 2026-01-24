from flask import Blueprint, request, jsonify 
from services.auth_service import (
    register_user,
    login_user,
    forgot_password,
    verify_otp,
    reset_password
)

auth_bp = Blueprint("auth_bp", __name__)

# register users data 
@auth_bp.route("/auth/register", methods=["POST"])
def register():
    data = request.get_json()

    if not data:
        return jsonify({"error": "No data provided"}), 400

    name = data.get("name")
    email = data.get("email")
    password = data.get("password")

    if not name or not email or not password:
        return jsonify({"error": "All fields are required"}), 400

    user, error = register_user(name, email, password)

    if error:
        return jsonify({"error": error}), 400

    return jsonify({
        "message": "User registered successfully",
        "user": user.to_dict()
    }), 201


@auth_bp.route("/auth/login", methods=["POST"])
def login():
    data = request.get_json()

    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"error": "Email and password required"}), 400

    user = login_user(email, password)

    if user:
        return jsonify({
            "message": "Login successful",
            "user": user.to_dict()
        }), 200

    return jsonify({"error": "Invalid email or password"}), 401

@auth_bp.route("/auth/forgot-password", methods=["POST"])
def forgot_password_api():
    data = request.get_json()
    email = data.get("email")

    success, message = forgot_password(email)

    if not success:
        return jsonify({"error": message}), 404

    return jsonify({
        "message": message
    }), 200


#  VERIFY OTP 
@auth_bp.route("/auth/verify-otp", methods=["POST"])
def verify_otp_api():
    data = request.get_json()

    email = data.get("email")
    otp = data.get("otp")

    try:
        otp = int(otp)
    except:
        return jsonify({"error": "OTP must be numeric"}), 400

    success, message = verify_otp(email, otp)

    if not success:
        return jsonify({"error": message}), 400

    return jsonify({
        "message": message
    }), 200

@auth_bp.route("/auth/reset-password", methods=["POST"])
def reset_password_api():
    data = request.get_json()

    email = data.get("email")
    new_password = data.get("new_password")

    if not email or not new_password:
        return jsonify({"error": "Email and new password required"}), 400

    success, error = reset_password(email, new_password)

    if not success:
        return jsonify({"error": error}), 404

    return jsonify({
        "message": "Password reset successful"
    }), 200

