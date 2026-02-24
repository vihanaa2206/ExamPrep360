from db import mongo

collection = mongo.db.email_otps

def save_otp(email, otp, expiry):
    collection.update_one(
        {"email": email},
        {"$set": {
            "email": email,
            "otp": otp,
            "expiry": expiry
        }},
        upsert=True
    )

def get_otp(email):
    return collection.find_one({"email": email})

def delete_otp(email):
    collection.delete_one({"email": email})
