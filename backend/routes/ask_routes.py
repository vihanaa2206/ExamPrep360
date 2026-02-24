from flask import Blueprint, request, jsonify
from datetime import datetime

ask_bp = Blueprint("ask_bp", __name__)

# 🔥 SAME STORAGE USE KARO
from routes.query_routes import queries, query_id

@ask_bp.route("/ask", methods=["POST"])
def ask_question():
    global query_id
    data = request.json

    q = {
        "id": query_id,
        "name": data["user"]["name"],
        "email": data["user"]["email"],
        "question": data["question"],
        "answer": "",
        "status": "pending",
        "created_at": datetime.now().strftime("%Y-%m-%d %H:%M")
    }

    queries.append(q)
    query_id += 1

    print("\n📩 NEW QUESTION RECEIVED")
    print("From:", q["email"])
    print("Question:", q["question"])
    print("-------------------------")

    return jsonify({"message": "Question submitted"}), 200
