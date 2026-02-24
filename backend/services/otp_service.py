import random
import time
from extensions import mongo

import random
import time
from extensions import mongo


def generate_otp(email, digits=4, purpose="forgot", force_new=False):

    existing = mongo.db.email_otps.find_one({
        "email": email,
        "purpose": purpose
    })

    # 🔁 Reuse only if NOT force_new AND still valid
    if existing and not force_new:
        if time.time() < existing["expiry"]:
            return existing["otp"]

    # 🔥 Always generate new OTP if:
    # 1. force_new=True
    # 2. expired
    # 3. no existing record

    if digits == 4:
        otp = random.randint(1000, 9999)
    else:
        otp = random.randint(100000, 999999)

    # ✅ Overwrite old OTP
    mongo.db.email_otps.update_one(
        {"email": email, "purpose": purpose},
        {
            "$set": {
                "otp": otp,
                "purpose": purpose,
                "expiry": time.time() + 60  # 1 minute validity
            }
        },
        upsert=True
    )

    print(f"[OTP-{purpose}] {email} -> {otp}")  # Terminal debug

    return otp



def verify_otp(email, user_otp, purpose="forgot"):

    data = mongo.db.email_otps.find_one({
        "email": email,
        "purpose": purpose
    })

    if not data:
        return False, "OTP not found"

    if time.time() > data["expiry"]:
        mongo.db.email_otps.delete_one({
            "email": email,
            "purpose": purpose
        })
        return False, "OTP expired"

    if str(data["otp"]) != str(user_otp):
        return False, "Invalid OTP"

    # ✅ Delete after successful verification
    mongo.db.email_otps.delete_one({
        "email": email,
        "purpose": purpose
    })

    return True, "OTP verified"
