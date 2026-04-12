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


# ── NEW: user ki saari queries + replies ─────────────────────────────────
@ask_bp.route("/ask/my-replies", methods=["GET"])
def get_my_replies():
    email = request.args.get("email", "").strip().lower()
    if not email:
        return jsonify([]), 200

    user_queries = [
        q for q in queries
        if q.get("email", "").lower() == email
    ]
    user_queries = sorted(
        user_queries,
        key=lambda x: x.get("created_at", ""),
        reverse=True
    )
    return jsonify(user_queries), 200


# ── NEW: unread answered count (bell badge ke liye) ──────────────────────
@ask_bp.route("/ask/unread-count", methods=["GET"])
def get_unread_count():
    email = request.args.get("email", "").strip().lower()
    if not email:
        return jsonify({"count": 0}), 200

    count = sum(
        1 for q in queries
        if q.get("email", "").lower() == email
        and q.get("status") == "answered"
        and q.get("answer", "").strip()
    )
    return jsonify({"count": count}), 200
