from flask import Blueprint, jsonify, request
from extensions import mongo
from bson import ObjectId

mock_bp = Blueprint("mock_bp", __name__)


@mock_bp.route("/mock/exams", methods=["GET"])
def get_mock_exams():
    exams = mongo.db.questions.distinct("exam_name")
    result = []
    for exam in sorted(exams):
        tests   = mongo.db.questions.distinct("test_no", {"exam_name": exam})
        q_count = mongo.db.questions.count_documents({"exam_name": exam})
        result.append({"exam_name": exam, "test_count": len(tests), "total_questions": q_count})
    return jsonify(result), 200


@mock_bp.route("/mock/tests/<exam_name>", methods=["GET"])
def get_tests_for_exam(exam_name):
    tests  = mongo.db.questions.distinct("test_no", {"exam_name": exam_name})
    result = []
    for t in sorted(tests):
        count    = mongo.db.questions.count_documents({"exam_name": exam_name, "test_no": t})
        subjects = mongo.db.questions.distinct("subject", {"exam_name": exam_name, "test_no": t})
        result.append({"test_no": t, "question_count": count, "subjects": subjects})
    return jsonify(result), 200


@mock_bp.route("/mock/questions/<exam_name>/<int:test_no>", methods=["GET"])
def get_questions(exam_name, test_no):
    docs = list(mongo.db.questions.find(
        {"exam_name": exam_name, "test_no": test_no}, {"_id": 0}
    ).sort("question_id", 1))
    return jsonify(docs), 200


# ── ADMIN: Add question ──────────────────────────────────────────────────
@mock_bp.route("/mock/questions/add", methods=["POST"])
def add_question():
    data = request.get_json()
    if not data.get("exam_name") or not data.get("question_text"):
        return jsonify({"error": "exam_name and question_text required"}), 400

    # Auto question_id
    last = mongo.db.questions.find_one(
        {"exam_name": data["exam_name"], "test_no": data["test_no"]},
        sort=[("question_id", -1)]
    )
    data["question_id"] = (last["question_id"] + 1) if last else 1

    mongo.db.questions.insert_one(data)
    return jsonify({"message": "Question added"}), 201


# ── ADMIN: Update question ───────────────────────────────────────────────
@mock_bp.route("/mock/questions/<int:question_id>/update", methods=["PUT"])
def update_question(question_id):
    data     = request.get_json()
    exam     = data.get("exam_name")
    test_no  = data.get("test_no")
    if not exam or not test_no:
        return jsonify({"error": "exam_name and test_no required"}), 400

    update_data = {k: v for k, v in data.items() if k not in ["_id", "question_id"]}
    result = mongo.db.questions.update_one(
        {"exam_name": exam, "test_no": test_no, "question_id": question_id},
        {"$set": update_data}
    )
    if result.matched_count == 0:
        return jsonify({"error": "Question not found"}), 404
    return jsonify({"message": "Updated"}), 200


# ── ADMIN: Delete question ───────────────────────────────────────────────
@mock_bp.route("/mock/questions/<int:question_id>/delete", methods=["DELETE"])
def delete_question(question_id):
    data    = request.get_json()
    exam    = data.get("exam_name")
    test_no = data.get("test_no")
    result  = mongo.db.questions.delete_one(
        {"exam_name": exam, "test_no": test_no, "question_id": question_id}
    )
    if result.deleted_count == 0:
        return jsonify({"error": "Not found"}), 404
    return jsonify({"message": "Deleted"}), 200


# ── ADMIN: Delete entire test ────────────────────────────────────────────
@mock_bp.route("/mock/test/delete", methods=["DELETE"])
def delete_test():
    data    = request.get_json()
    exam    = data.get("exam_name")
    test_no = data.get("test_no")
    result  = mongo.db.questions.delete_many({"exam_name": exam, "test_no": test_no})
    return jsonify({"message": f"Deleted {result.deleted_count} questions"}), 200
