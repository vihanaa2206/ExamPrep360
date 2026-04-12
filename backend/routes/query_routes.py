from flask import Blueprint, request, jsonify
from datetime import datetime

query_bp = Blueprint("query_bp", __name__)

queries = []
query_id = 1


# =====================
# USER → ASK QUESTION
# =====================
@query_bp.route("/ask", methods=["POST"])
def create_query():
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


# =====================
# ADMIN → GET QUERIES
# =====================
@query_bp.route("/admin/queries", methods=["GET"])
def get_queries():
    return jsonify(queries), 200


# =====================
# ADMIN → ANSWER QUERY
# =====================
@query_bp.route("/admin/queries/<int:id>/answer", methods=["POST"])
def answer_query(id):
    data = request.json

    for q in queries:
        if q["id"] == id:
            q["answer"] = data["answer"]
            q["status"] = "answered"
            return jsonify({"message": "Answered"}), 200

    return jsonify({"error": "Query not found"}), 404

# ADMIN → PENDING COUNT
@query_bp.route("/admin/queries/pending-count", methods=["GET"])
def pending_count():
    count = len([q for q in queries if q["status"] == "pending"])
    return jsonify({"count": count}), 200

