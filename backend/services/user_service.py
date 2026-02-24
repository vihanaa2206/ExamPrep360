from extensions import mongo
from bson import ObjectId
from bson.errors import InvalidId


# ==============================
# GET ALL USERS
# ==============================
def get_all_users():
    users = mongo.db.users.find()

    result = []

    for user in users:
        # Skip corrupted records
        if not user.get("_id"):
            continue

        result.append({
            "id": str(user["_id"]),
            "email": user.get("email", ""),
            "role": user.get("role", "user"),
            "is_blocked": user.get("is_blocked", False)
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

    return {
        "id": str(user["_id"]),
        "email": user.get("email", ""),
        "role": user.get("role", "user"),
        "is_blocked": user.get("is_blocked", False)
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
# BLOCK / UNBLOCK USER
# ==============================
def update_user_status(user_id, is_blocked):

    if not isinstance(is_blocked, bool):
        return False, "Invalid status value"

    try:
        object_id = ObjectId(user_id)
    except InvalidId:
        return False, "Invalid user ID"

    result = mongo.db.users.update_one(
        {"_id": object_id},
        {"$set": {"is_blocked": is_blocked}}
    )

    if result.matched_count == 0:
        return False, "User not found"

    return True, "User status updated successfully"
