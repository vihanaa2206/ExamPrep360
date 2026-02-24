from flask import request, jsonify
from functools import wraps
import jwt

SECRET_KEY = "exam_prep_secret"

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
