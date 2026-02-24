from extensions import mongo
from models.user import User
import time
from bson import ObjectId

# ================= USER QUERIES =================

def get_user_by_email(email):
    doc = mongo.db.users.find_one({"email": email})
    return User.from_mongo(doc) if doc else None


def get_user_by_id(user_id):
    if not isinstance(user_id, ObjectId):
        user_id = ObjectId(user_id)

    doc = mongo.db.users.find_one({"_id": user_id})
    return User.from_mongo(doc) if doc else None


def add_user(
    name,
    email,
    hashed_password,
    role="user",
    designation=None,
    profession=None,
    student_type=None,
    institute_name=None
):
    user_doc = {
        "name": name,
        "email": email,
        "password": hashed_password,
        "role": role,
        "designation": designation,
        "profession": profession,
        "student_type": student_type,
        "institute_name": institute_name,
        "is_verified": True,
        "created_at": time.time()
    }

    result = mongo.db.users.insert_one(user_doc)
    user_doc["_id"] = result.inserted_id

    return User.from_mongo(user_doc)


def update_password(email, hashed_password):
    mongo.db.users.update_one(
        {"email": email},
        {"$set": {"password": hashed_password}}
    )


# ================= EMAIL OTP QUERIES =================
# ⚠️ IMPORTANT: auth_routes & otp_service BOTH depend on these

def save_otp(email, otp):
    mongo.db.email_otps.update_one(
        {"email": email},
        {
            "$set": {
                "otp": otp,
                "expiry": time.time() + 300  # 5 minutes
            }
        },
        upsert=True
    )


def get_otp(email):
    return mongo.db.email_otps.find_one({"email": email})


def delete_otp(email):
    mongo.db.email_otps.delete_one({"email": email})
