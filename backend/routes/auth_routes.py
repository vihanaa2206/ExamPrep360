from flask import Blueprint, request, jsonify
import jwt

from services.auth_service import (
    complete_registration,
    login_user,
    forgot_password,
    update_password,
    send_otp_email,
    SECRET_KEY,
)

from services.otp_service import generate_otp, verify_otp

auth_bp = Blueprint("auth_bp", __name__)


# ================= EMAIL SEND OTP =================
@auth_bp.route("/auth/email/send-otp", methods=["POST"])
def send_email_otp():
    data = request.get_json()
    email = data.get("email")

    if not email:
        return jsonify({"error": "Email required"}), 400

    otp = generate_otp(email)
    send_otp_email(email, otp)

    return jsonify({"message": "OTP sent"}), 200


# ================= EMAIL VERIFY OTP =================
@auth_bp.route("/auth/email/verify-otp", methods=["POST"])
def verify_email_otp():
    data = request.get_json()
    email = data.get("email")
    otp = data.get("otp")

    if not email or not otp:
        return jsonify({"error": "Email and OTP required"}), 400

    success, message = verify_otp(email, otp)

    if not success:
        return jsonify({"error": message}), 400

    return jsonify({"message": message}), 200


# ================= REGISTER COMPLETE =================
# ================= REGISTER COMPLETE =================
@auth_bp.route("/auth/register/complete", methods=["POST"])
def register_complete():
    data = request.get_json()

    name = data.get("name", "").strip()
    email = data.get("email", "").strip()
    password = data.get("password", "")
    designation = data.get("designation", "").strip()
    profession = data.get("profession", "").strip()
    student_type = data.get("studentType", "").strip()
    institute = data.get("institute", "").strip()

    # ✅ NEW: All fields mandatory check
    if not name:
        return jsonify({"error": "Name is required"}), 400

    if not email:
        return jsonify({"error": "Email is required"}), 400

    if not password:
        return jsonify({"error": "Password is required"}), 400

    # ✅ NEW: Strong password validation
    import re
    if len(password) < 8:
        return jsonify({"error": "Password must be at least 8 characters"}), 400
    if not re.search(r'[A-Z]', password):
        return jsonify({"error": "Password must contain at least one uppercase letter"}), 400
    if not re.search(r'[a-z]', password):
        return jsonify({"error": "Password must contain at least one lowercase letter"}), 400
    if not re.search(r'[0-9]', password):
        return jsonify({"error": "Password must contain at least one digit"}), 400
    if not re.search(r'[!@#$%^&*()_+\-=\[\]{};\':"\\|,.<>\/?]', password):
        return jsonify({"error": "Password must contain at least one special character"}), 400

    # ✅ NEW: Designation mandatory
    if not designation:
        return jsonify({"error": "Select designation first"}), 400

    # ✅ NEW: Institute mandatory for student/professor
    if designation in ["student", "professor"] and not institute:
        return jsonify({"error": "Please enter your School / College name"}), 400

    # ✅ NEW: Profession mandatory for other
    if designation == "other" and not profession:
        return jsonify({"error": "Please enter your profession"}), 400

    # ✅ Original logic - bilkul unchanged
    user, error = complete_registration(
        name=name,
        email=email,
        password=password,
        otp="verified",
        designation=designation,
        profession=profession,
        student_type=student_type,
        institute_name=institute,
    )

    if error:
        return jsonify({"error": error}), 400

    return jsonify({
        "message": "Registration successful",
        "user": user.to_dict()
    }), 201

# ================= LOGIN =================
@auth_bp.route("/auth/login", methods=["POST"])
def login():
    data = request.get_json()

    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"error": "Email and password required"}), 400

    user, token_or_error = login_user(email, password)

    if not user:
        return jsonify({"error": token_or_error}), 401

    return jsonify({
        "message": "Login successful",
        "token": token_or_error,
        "user": user.to_dict()
    }), 200


# ================= FORGOT PASSWORD =================
@auth_bp.route("/auth/forgot-password", methods=["POST"])
def forgot_password_route():
    data = request.get_json()
    email = data.get("email")

    if not email:
        return jsonify({"error": "Email required"}), 400

    # Normal OTP generate
    otp = generate_otp(email, digits=4, purpose="forgot")

    send_otp_email(email, otp)

    return jsonify({"message": "OTP sent"}), 200


# ================= VERIFY OTP (FORGOT) =================
@auth_bp.route("/auth/verify-otp", methods=["POST"])
def verify_otp_route():
    data = request.get_json()

    email = data.get("email")
    otp = data.get("otp")

    if not email or not otp:
        return jsonify({"error": "Email and OTP required"}), 400

    # ✅ Verify using forgot purpose
    success, message = verify_otp(email, otp, purpose="forgot")

    if not success:
        return jsonify({"error": message}), 400

    return jsonify({"message": "OTP verified successfully"}), 200


# ================= RESET PASSWORD =================
@auth_bp.route("/auth/reset-password", methods=["POST"])
def update_password_route():
    data = request.get_json()

    email = data.get("email")
    new_password = data.get("password")

    if not email or not new_password:
        return jsonify({"error": "Email and new password required"}), 400

    success, message = update_password(email, new_password)

    if not success:
        return jsonify({"error": message}), 400

    return jsonify({"message": message}), 200


# ================= RESEND FORGOT OTP =================
@auth_bp.route("/auth/resend-forgot-otp", methods=["POST"])
def resend_forgot_otp():
    data = request.get_json()
    email = data.get("email")

    if not email:
        return jsonify({"error": "Email required"}), 400

    # 🔥 FORCE NEW OTP
    otp = generate_otp(email, digits=4, purpose="forgot", force_new=True)

    send_otp_email(email, otp)

    return jsonify({"message": "OTP resent successfully"}), 200


# ================= ROLE CHECK =================
@auth_bp.route("/auth/check-role", methods=["GET"])
def check_role():
    auth_header = request.headers.get("Authorization")

    if not auth_header:
        return jsonify({"error": "Token missing"}), 401

    token = auth_header.split(" ")[1]

    try:
        decoded = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        return jsonify({
            "role": decoded["role"],
            "email": decoded["email"]
        }), 200
    except:
        return jsonify({"error": "Invalid token"}), 401
