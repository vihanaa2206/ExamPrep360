# ============================================================
# reports.py — FIXED VERSION
# Changes marked with # ✅ FIXED
# ============================================================

from flask import Blueprint, jsonify, request
from extensions import mongo
from datetime import datetime

reports_bp = Blueprint("reports_bp", __name__)


# GET all attempts for a specific user
@reports_bp.route("/reports/user/<user_id>", methods=["GET"])
def get_user_reports(user_id):
    try:
        results = list(
            mongo.db.mock_results.find({"user_id": user_id}).sort("attempted_at", -1)
        )
        for r in results:
            r["_id"] = str(r["_id"])
        return jsonify(results), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# GET all results (admin overview)
@reports_bp.route("/reports/all", methods=["GET"])
def get_all_reports():
    try:
        results = list(mongo.db.mock_results.find().sort("attempted_at", -1).limit(500))
        for r in results:
            r["_id"] = str(r["_id"])
        return jsonify(results), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# POST save result when user submits test
@reports_bp.route("/reports/save", methods=["POST"])
def save_result():
    try:
        data = request.get_json()

        user_id         = data.get("user_id")
        exam_name       = data.get("exam_name")
        test_no         = data.get("test_no")
        category        = data.get("category", "")
        score           = data.get("score", 0)
        total_questions = data.get("total_questions", 0)   # number of questions (e.g. 30)
        # ✅ FIXED: total_marks = max possible marks using marking scheme (e.g. 30 * 4 = 120 for AFMC)
        total_marks     = data.get("total_marks", total_questions)  # fallback to total_questions if not sent
        marking_scheme  = data.get("marking_scheme", "+1 / 0")     # ✅ FIXED: store scheme label
        answers         = data.get("answers", [])

        if not user_id or not exam_name or test_no is None:
            return jsonify({"error": "user_id, exam_name, test_no required"}), 400

        prev_attempts = mongo.db.mock_results.count_documents({
            "user_id":   user_id,
            "exam_name": exam_name,
            "test_no":   test_no
        })
        attempt_no = prev_attempts + 1

        result_doc = {
            "user_id":         user_id,
            "exam_name":       exam_name,
            "test_no":         test_no,
            "category":        category,
            "score":           score,
            "total_questions": total_questions,   # question count
            "total_marks":     total_marks,       # ✅ FIXED: max marks (score denominator)
            "marking_scheme":  marking_scheme,    # ✅ FIXED: e.g. "+4 / -1"
            "attempt_no":      attempt_no,
            "answers":         answers,
            "attempted_at":    datetime.utcnow().isoformat()
        }

        mongo.db.mock_results.insert_one(result_doc)
        result_doc["_id"] = str(result_doc["_id"])

        return jsonify({
            "message":    "Result saved",
            "attempt_no": attempt_no,
            "result":     result_doc
        }), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 500
