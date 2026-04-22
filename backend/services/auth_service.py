import os
import threading
import smtplib
from email.mime.text import MIMEText
import jwt
import datetime
from datetime import timezone
from extensions import mongo
from werkzeug.security import generate_password_hash, check_password_hash
from repositories.auth_respository import (
    get_user_by_email,
    add_user
)
from services.otp_service import generate_otp

SECRET_KEY = os.environ.get("JWT_SECRET", "exam_prep_secret")

def send_otp_email(email, otp):
    sender = os.environ.get("MAIL_USERNAME")
    password = os.environ.get("MAIL_PASSWORD")

    msg = MIMEText(f"Your OTP is: {otp}\nValid for 1 minute.")
    msg["Subject"] = "Your OTP Verification Code"
    msg["From"] = sender
    msg["To"] = email

    with smtplib.SMTP("smtp-relay.brevo.com", 587) as server:
        server.starttls()
        server.login(sender, password)
        server.sendmail(sender, email, msg.as_string())

def complete_registration(
    name, email, password, otp,
    designation=None, profession=None,
    student_type=None, institute_name=None
):
    if get_user_by_email(email):
        return None, "Email already registered"
    hashed_password = generate_password_hash(password)
    role = "admin" if email == "admin@gmail.com" else "user"
    user = add_user(
        name=name, email=email,
        hashed_password=hashed_password, role=role,
        designation=designation, profession=profession,
        student_type=student_type, institute_name=institute_name
    )
    mongo.db.users.update_one(
        {"email": email},
        {"$set": {
            "registered_at": datetime.datetime.now(timezone.utc),
            "login_history": [],
            "password_change_history": [],
            "last_seen": None,
        }}
    )
    return user, None

def login_user(email, password):
    user = get_user_by_email(email)
    if not user:
        return None, "This email is not registered. Please register first."
    if not user.password:
        return None, "Password not found in database"
    if not check_password_hash(user.password, password):
        return None, "Incorrect password"
    token = jwt.encode(
        {
            "id": str(user.id),
            "email": user.email,
            "role": user.role,
            "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=6)
        },
        SECRET_KEY, algorithm="HS256"
    )
    login_entry = {
        "login_time": datetime.datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S UTC"),
        "status": "logged_in"
    }
    mongo.db.users.update_one(
        {"email": email},
        {
            "$push": {"login_history": {"$each": [login_entry], "$slice": -50, "$position": 0}},
            "$set": {"last_seen": datetime.datetime.now(timezone.utc)}
        }
    )
    return user, token

def forgot_password(email):
    user = get_user_by_email(email)
    if not user:
        return False, "Email not registered"
    otp = generate_otp(email, digits=4, purpose="forgot", force_new=True)
    send_otp_email(email, otp)
    return True, "OTP sent successfully"

def update_password(email, new_password):
    user = get_user_by_email(email)
    if not user:
        return False, "User not found"
    hashed_password = generate_password_hash(new_password)
    change_entry = {"changed_at": datetime.datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S UTC")}
    mongo.db.users.update_one(
        {"email": email},
        {
            "$set": {"password": hashed_password},
            "$push": {"password_change_history": {"$each": [change_entry], "$slice": -20, "$position": 0}}
        }
    )
    return True, "Password updated successfully"


def send_otp_email(email, otp):
    def send():
        try:
            with smtplib.SMTP("smtp-relay.brevo.com", 587) as server:
                server.starttls()
                server.login(
                    os.environ.get("MAIL_USERNAME"),
                    os.environ.get("MAIL_PASSWORD")
                )
                server.sendmail(
                    os.environ.get("MAIL_USERNAME"),
                    email,
                    f"Subject: Your OTP\n\nYour OTP is: {otp}\nValid for 1 minute."
                )
        except Exception as e:
            print(f"[EMAIL ERROR] {e}")
    
    threading.Thread(target=send).start()
