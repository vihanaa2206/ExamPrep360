import os
from flask import request, jsonify
from functools import wraps
import jwt
from bson import ObjectId

SECRET_KEY = os.environ.get("JWT_SECRET", "exam_prep_secret")

def admin_only(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        auth_header = request.headers.get("Authorization")
        if not auth_header:
            return jsonify({"error": "Token missing"}), 401
        try:
            token = auth_header.split(" ")[1]
            data = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
            if data.get("role") != "admin":
                return jsonify({"error": "Admin access required"}), 403
        except jwt.ExpiredSignatureError:
            return jsonify({"error": "Token expired"}), 401
        except jwt.InvalidTokenError:
            return jsonify({"error": "Invalid token"}), 401
        except Exception:
            return jsonify({"error": "Invalid token format"}), 401
        return func(*args, **kwargs)
    return wrapper

# ✅ NEW — token_required (any logged-in user)
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        auth_header = request.headers.get("Authorization")
        if not auth_header:
            return jsonify({"error": "Token missing"}), 401
        try:
            token = auth_header.split(" ")[1]
            decoded = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
            from extensions import mongo
            current_user = mongo.db.users.find_one({"_id": ObjectId(decoded["id"])})
            if not current_user:
                return jsonify({"error": "User not found"}), 401
        except jwt.ExpiredSignatureError:
            return jsonify({"error": "Token expired"}), 401
        except jwt.InvalidTokenError:
            return jsonify({"error": "Invalid token"}), 401
        except Exception:
            return jsonify({"error": "Invalid token format"}), 401
        return f(current_user, *args, **kwargs)
    return decorated
