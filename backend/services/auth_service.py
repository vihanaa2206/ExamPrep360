from flask_mail import Message
from extensions import mail, mongo
from werkzeug.security import generate_password_hash, check_password_hash
import jwt
import datetime

from repositories.auth_respository import (
    get_user_by_email,
    add_user
)

from services.otp_service import generate_otp

SECRET_KEY = "exam_prep_secret"


# ================= EMAIL =================
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
    # 🔒 Check if already exists
    if get_user_by_email(email):
        return None, "Email already registered"

    # 🔐 Hash password
    hashed_password = generate_password_hash(password)

    # 🎯 Role logic
    role = "admin" if email == "admin@gmail.com" else "user"

    user = add_user(
        name=name,
        email=email,
        hashed_password=hashed_password,  # IMPORTANT: repository must store as "password"
        role=role,
        designation=designation,
        profession=profession,
        student_type=student_type,
        institute_name=institute_name
    )

    return user, None


# ================= LOGIN =================
def login_user(email, password):
    user = get_user_by_email(email)

    if not user:
        return None, "This email is not registered. Please register first."

    # 🔥 Object style access
    stored_password = user.password

    if not stored_password:
        return None, "Password not found in database"

    if not check_password_hash(stored_password, password):
        return None, "Incorrect password"

    token = jwt.encode(
        {
            "id": str(user.id),
            "email": user.email,
            "role": user.role,
            "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=6)
        },
        SECRET_KEY,
        algorithm="HS256"
    )

    return user, token




# ================= FORGOT PASSWORD =================
def forgot_password(email):
    user = get_user_by_email(email)

    if not user:
        return False, "Email not registered"

    # 🔥 Always generate NEW OTP on resend
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
    user = get_user_by_email(email)

    if not user:
        return False, "User not found"

    hashed_password = generate_password_hash(new_password)

    mongo.db.users.update_one(
        {"email": email},
        {"$set": {"password": hashed_password}}
    )

    return True, "Password updated successfully"
