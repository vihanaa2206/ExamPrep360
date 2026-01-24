from flask import request, jsonify
from functools import wraps

def admin_only(func):
    @wraps(func)
    def wrapper(*args, **kwargs):

        # Temporary approach (learning phase)
        role = request.headers.get("Role")

        if role != "admin":
            return jsonify({"error": "Admin access required"}), 403

        return func(*args, **kwargs)

    return wrapper
