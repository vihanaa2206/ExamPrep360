import random
from models.user import User, users_db
from werkzeug.security import generate_password_hash, check_password_hash

otp_store = {}

def register_user(name, email, password, role="user"):
    for user in users_db:
        if user.email == email:
            return None, "Email already registered"

    user_id = len(users_db) + 1
    hashed_password = generate_password_hash(password)

    new_user = User(user_id, name, email, hashed_password, role)
    users_db.append(new_user)

    return new_user, None


def login_user(email, password):
    for user in users_db:
        if user.email == email and check_password_hash(user.password, password):
            return user
    return None


def forgot_password(email):
    for user in users_db:
        if user.email == email:
            otp = random.randint(1000, 9999)
            otp_store[email] = otp
            print(f"[DEBUG OTP] {email} → {otp}")
            return True, "OTP sent"
    return False, "User not found"


def verify_otp(email, otp):
    if email not in otp_store:
        return False, "OTP expired or not requested"

    stored_otp = otp_store[email]

    if stored_otp != otp:
        return False, "Invalid OTP"

    del otp_store[email]

    return True, "OTP verified successfully"



def reset_password(email, new_password):
    for user in users_db:
        if user.email == email:
            user.password = generate_password_hash(new_password)
            return True, "Password reset successful"

    return False, "User not found"
