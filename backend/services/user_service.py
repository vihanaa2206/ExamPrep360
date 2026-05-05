from extensions import mongo
from bson import ObjectId
from bson.errors import InvalidId
from datetime import datetime, timezone


# ==============================
# GET ALL USERS
# ==============================
def get_all_users():
    users = mongo.db.users.find()
    result = []
    for user in users:
        if not user.get("_id"):
            continue
        last_seen = user.get("last_seen")
        is_online = False
        if last_seen:
            now = datetime.now(timezone.utc)
            if last_seen.tzinfo is None:
                last_seen = last_seen.replace(tzinfo=timezone.utc)
            is_online = (now - last_seen).total_seconds() < 300

        result.append({
            "id":            str(user["_id"]),
            "_id":           str(user["_id"]),
            "email":         (user.get("email", "")).lower(),
            "role":          user.get("role", "user"),
            "is_blocked":    user.get("is_blocked", False),
            "status":        user.get("status", "active"),
            "name":          user.get("name", ""),
            "phone":         user.get("phone", ""),
            "city":          user.get("city", ""),
            "state":         user.get("state", ""),
            "target_exam":   user.get("target_exam", ""),
            "designation":   user.get("designation", ""),
            "profession":    user.get("profession", ""),
            "student_type":  user.get("student_type", ""),
            "institute_name": user.get("institute_name", ""),
            "registered_at": str(user.get("registered_at", "")),
            "last_seen":     str(last_seen) if last_seen else "",
            "is_online":     is_online,
            "login_history": user.get("login_history", [])[-10:],
            "password_change_history": user.get("password_change_history", []),
            "has_password":  bool(user.get("password") or user.get("password_hash")),
        })
    return result


# ==============================
# GET USER BY ID
# ==============================
def get_user_by_id(user_id):
    try:
        object_id = ObjectId(user_id)
    except InvalidId:
        return None

    user = mongo.db.users.find_one({"_id": object_id})
    if not user:
        return None

    last_seen = user.get("last_seen")
    is_online = False
    if last_seen:
        now = datetime.now(timezone.utc)
        if last_seen.tzinfo is None:
            last_seen = last_seen.replace(tzinfo=timezone.utc)
        is_online = (now - last_seen).total_seconds() < 300

    return {
        "id":            str(user["_id"]),
        "_id":           str(user["_id"]),
        "email":         (user.get("email", "")).lower(),
        "role":          user.get("role", "user"),
        "is_blocked":    user.get("is_blocked", False),
        "status":        user.get("status", "active"),
        "name":          user.get("name", ""),
        "phone":         user.get("phone", ""),
        "city":          user.get("city", ""),
        "state":         user.get("state", ""),
        "target_exam":   user.get("target_exam", ""),
        "designation":   user.get("designation", ""),
        "profession":    user.get("profession", ""),
        "student_type":  user.get("student_type", ""),
        "institute_name": user.get("institute_name", ""),
        "registered_at": str(user.get("registered_at", "")),
        "last_seen":     str(last_seen) if last_seen else "",
        "is_online":     is_online,
        "login_history": user.get("login_history", []),
        "password_change_history": user.get("password_change_history", []),
        "has_password":  bool(user.get("password") or user.get("password_hash")),
    }


# ==============================
# DELETE USER
# ==============================
def delete_user_by_id(user_id):
    try:
        object_id = ObjectId(user_id)
    except InvalidId:
        return False, "Invalid user ID"
    result = mongo.db.users.delete_one({"_id": object_id})
    if result.deleted_count == 0:
        return False, "User not found"
    return True, "User deleted successfully"


# ==============================
# UPDATE USER ROLE
# ==============================
def update_user_role(user_id, role):
    if role not in ["admin", "user"]:
        return False, "Invalid role"
    try:
        object_id = ObjectId(user_id)
    except InvalidId:
        return False, "Invalid user ID"
    result = mongo.db.users.update_one(
        {"_id": object_id},
        {"$set": {"role": role}}
    )
    if result.matched_count == 0:
        return False, "User not found"
    return True, "User role updated successfully"


# ==============================
# UPDATE USER STATUS (block/unblock/suspend)
# ==============================
def update_user_status(user_id, is_blocked, status_str=None):
    try:
        object_id = ObjectId(user_id)
    except InvalidId:
        return False, "Invalid user ID"

    update = {"is_blocked": is_blocked}
    if status_str:
        update["status"] = status_str
    elif is_blocked:
        update["status"] = "blocked"
    else:
        update["status"] = "active"

    result = mongo.db.users.update_one(
        {"_id": object_id},
        {"$set": update}
    )
    if result.matched_count == 0:
        return False, "User not found"
    return True, "Status updated"


# ==============================
# HEARTBEAT — update last seen
# ==============================
def update_last_seen(user_id):
    try:
        object_id = ObjectId(user_id)
    except InvalidId:
        return
    mongo.db.users.update_one(
        {"_id": object_id},
        {"$set": {"last_seen": datetime.now(timezone.utc)}}
    )


# ==============================
# UPDATE OWN PROFILE
# ==============================
def update_user_profile(user_id, update_data):
    try:
        object_id = ObjectId(user_id)
    except InvalidId:
        return False, "Invalid user ID"

    result = mongo.db.users.find_one_and_update(
        {"_id": object_id},
        {"$set": update_data},
        return_document=True
    )
    if not result:
        return False, "User not found"

    result["_id"] = str(result["_id"])
    safe = {k: result.get(k, "") for k in [
        "_id", "name", "email", "phone", "city", "state",
        "target_exam", "role", "designation", "avatar",
        "institute_name", "student_type", "profession"
    ]}
    safe["has_password"] = bool(result.get("password") or result.get("password_hash"))
    return True, safe


# ==============================
# CHANGE PASSWORD
# ==============================
def change_user_password(user_id, current_password, new_password):
    try:
        import bcrypt
        object_id = ObjectId(user_id)
    except InvalidId:
        return False, "Invalid user ID"
    except ImportError:
        return False, "bcrypt not installed. Run: pip install bcrypt"

    user = mongo.db.users.find_one({"_id": object_id})
    if not user:
        return False, "User not found"

    stored_pw = user.get("password") or user.get("password_hash")
    if not stored_pw:
        return False, "Password not set for this account"

    if isinstance(stored_pw, str):
        stored_pw = stored_pw.encode("utf-8")

    if not stored_pw.startswith(b"$2b$") and not stored_pw.startswith(b"$2a$"):
        return False, "Password format not supported. Please reset via email."

    try:
        if not bcrypt.checkpw(current_password.encode("utf-8"), stored_pw):
            return False, "Current password is incorrect"
    except Exception as e:
        return False, f"Password check failed: {str(e)}"

    hashed = bcrypt.hashpw(new_password.encode("utf-8"), bcrypt.gensalt())

    mongo.db.users.update_one(
        {"_id": object_id},
        {
            "$set": {"password": hashed},
            "$push": {
                "password_change_history": {
                    "changed_at": datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S UTC")
                }
            }
        }
    )
    return True, "Password changed successfully"
