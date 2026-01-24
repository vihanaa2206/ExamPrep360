from flask import Blueprint, request, jsonify
from services.exam_service import get_all_exams, add_exam, update_exam, delete_exam
from utils.role_check import admin_only

exam_bp = Blueprint("exam_bp", __name__)

# GET all exams (USER + ADMIN)
@exam_bp.route("/api/exams", methods=["GET"])
def fetch_exams():
    exams = get_all_exams()
    result = [exam.to_dict() for exam in exams]
    return jsonify(result), 200


# POST add new exam (ADMIN only)
@exam_bp.route("/api/exams", methods=["POST"])
@admin_only
def create_exam():
    data = request.get_json()

    name = data.get("name")
    level = data.get("level")
    description = data.get("description")

    exam = add_exam(name, level, description)

    return jsonify({
        "message": "Exam added successfully",
        "exam": exam.to_dict()
    }), 201


# PUT update exam (ADMIN only)
@exam_bp.route("/api/exams/<int:exam_id>", methods=["PUT"])
@admin_only
def update_exam_api(exam_id):
    data = request.get_json()

    updated_exam = update_exam(
        exam_id,
        data.get("name"),
        data.get("level"),
        data.get("description")
    )

    if not updated_exam:
        return jsonify({"error": "Exam not found"}), 404

    return jsonify({
        "message": "Exam updated successfully",
        "exam": updated_exam.to_dict()
    }), 200


# DELETE exam (ADMIN only)
@exam_bp.route("/api/exams/<int:exam_id>", methods=["DELETE"])
@admin_only
def delete_exam_api(exam_id):
    deleted = delete_exam(exam_id)

    if not deleted:
        return jsonify({"error": "Exam not found"}), 404

    return jsonify({"message": "Exam deleted successfully"}), 200
