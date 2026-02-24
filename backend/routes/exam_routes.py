from flask import Blueprint, request, jsonify
from services.exam_service import (
    get_all_exams,
    get_exam_by_slug,
    add_exam
)
from utils.role_check import admin_only


exam_bp = Blueprint("exam_bp", __name__)


# HOME PAGE (Cards)
@exam_bp.route("/api/exams", methods=["GET"])
def fetch_exams():
    exams = get_all_exams()
    return jsonify([exam.to_card_dict() for exam in exams]), 200


# DETAIL PAGE
@exam_bp.route("/api/exams/<slug>", methods=["GET"])
def fetch_exam_detail(slug):
    exam = get_exam_by_slug(slug)
    if not exam:
        return jsonify({"error": "Exam not found"}), 404

    return jsonify(exam.to_full_dict()), 200


#  ADMIN ADD EXAM
@exam_bp.route("/api/exams", methods=["POST"])
@admin_only
def create_exam():
    data = request.get_json()

    exam = add_exam(
        name=data["name"],
        slug=data["slug"],
        category=data["category"],
        level=data["level"],
        status=data["status"],
        rating=data["rating"],
        card_data=data["cardData"],
        full_data=data["fullData"]
    )

    return jsonify({
        "message": "Exam added successfully",
        "exam": exam.to_full_dict()
    }), 201

# UPDATE EXAM (ADMIN)
@exam_bp.route("/api/exams/<slug>", methods=["PUT"])
@admin_only
def update_exam(slug):
    data = request.get_json()

    exam = get_exam_by_slug(slug)
    if not exam:
        return jsonify({"error": "Exam not found"}), 404

    # optional fields update
    exam.name = data.get("name", exam.name)
    exam.category = data.get("category", exam.category)
    exam.level = data.get("level", exam.level)
    exam.status = data.get("status", exam.status)
    exam.rating = data.get("rating", exam.rating)
    exam.card_data = data.get("cardData", exam.card_data)
    exam.full_data = data.get("fullData", exam.full_data)

    return jsonify({
        "message": "Exam updated successfully",
        "exam": exam.to_full_dict()
    }), 200

# DELETE EXAM (ADMIN)
@exam_bp.route("/api/exams/<slug>", methods=["DELETE"])
@admin_only
def delete_exam(slug):
    exam = get_exam_by_slug(slug)

    if not exam:
        return jsonify({"error": "Exam not found"}), 404

    from models.exam_model import exams_db
    exams_db.remove(exam)

    return jsonify({
        "message": "Exam deleted successfully",
        "slug": slug
    }), 200


