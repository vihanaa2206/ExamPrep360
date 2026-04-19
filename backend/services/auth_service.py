import os
from flask_mail import Message
from extensions import mail, mongo
from werkzeug.security import generate_password_hash, check_password_hash
import jwt
import datetime
from datetime import timezone
from repositories.auth_respository import (
    get_user_by_email,
    add_user
)
from services.otp_service import generate_otp

SECRET_KEY = os.environ.get("JWT_SECRET", "exam_prep_secret")


# ================= EMAIL — UNCHANGED =================
def send_otp_email(email, otp):
    msg = Message(
        subject="Your OTP Verification Code",
        recipients=[email],
        body=f"Your OTP is: {otp}\nValid for 1 minute."
    )
    mail.send(msg)


# ================= REGISTER COMPLETE =================
def complete_registration(
    name,
    email,
    password,
    otp,
    designation=None,
    profession=None,
    student_type=None,
    institute_name=None
):
    # 🔒 Check if already exists — UNCHANGED
    if get_user_by_email(email):
        return None, "Email already registered"

    # 🔐 Hash password — UNCHANGED
    hashed_password = generate_password_hash(password)

    # 🎯 Role logic — UNCHANGED
    role = "admin" if email == "admin@gmail.com" else "user"

    user = add_user(
        name=name,
        email=email,
        hashed_password=hashed_password,
        role=role,
        designation=designation,
        profession=profession,
        student_type=student_type,
        institute_name=institute_name
    )

    # ✅ NEW: registered_at + empty history fields save karo
    mongo.db.users.update_one(
        {"email": email},
        {"$set": {
            "registered_at":           datetime.datetime.now(timezone.utc),
            "login_history":           [],
            "password_change_history": [],
            "last_seen":               None,
        }}
    )

    return user, None


# ================= LOGIN =================
def login_user(email, password):
    # UNCHANGED logic
    user = get_user_by_email(email)
    if not user:
        return None, "This email is not registered. Please register first."

    stored_password = user.password
    if not stored_password:
        return None, "Password not found in database"

    if not check_password_hash(stored_password, password):
        return None, "Incorrect password"

    token = jwt.encode(
        {
            "id":    str(user.id),
            "email": user.email,
            "role":  user.role,
            "exp":   datetime.datetime.utcnow() + datetime.timedelta(hours=6)
        },
        SECRET_KEY,
        algorithm="HS256"
    )

    # ✅ NEW: login time history save karo
    login_entry = {
        "login_time": datetime.datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S UTC"),
        "status": "logged_in"
    }
    mongo.db.users.update_one(
        {"email": email},
        {
            "$push": {
                "login_history": {
                    "$each":     [login_entry],
                    "$slice":    -50,
                    "$position": 0
                }
            },
            "$set": {
                "last_seen": datetime.datetime.now(timezone.utc)
            }
        }
    )

    return user, token


# ================= FORGOT PASSWORD — BILKUL UNCHANGED =================
def forgot_password(email):
    user = get_user_by_email(email)
    if not user:
        return False, "Email not registered"

    otp = generate_otp(
        email,
        digits=4,
        purpose="forgot",
        force_new=True
    )
    send_otp_email(email, otp)
    return True, "OTP sent successfully"


# ================= RESET PASSWORD =================
def update_password(email, new_password):
    # UNCHANGED logic
    user = get_user_by_email(email)
    if not user:
        return False, "User not found"

    hashed_password = generate_password_hash(new_password)

    # ✅ NEW: password change history bhi save karo
    change_entry = {
        "changed_at": datetime.datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S UTC"),
    }

    mongo.db.users.update_one(
        {"email": email},
        {
            "$set": {"password": hashed_password},
            "$push": {
                "password_change_history": {
                    "$each":     [change_entry],
                    "$slice":    -20,
                    "$position": 0
                }
            }
        }
    )

    return True, "Password updated successfully"
