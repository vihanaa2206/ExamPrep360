from flask import request, Blueprint, jsonify
from extensions import mongo
from datetime import datetime
from bson import ObjectId

exam_bp    = Blueprint("exam_bp", __name__)
coaching_bp = Blueprint("coaching_bp", __name__)


# ---------------- GET ALL EXAMS ----------------
@exam_bp.route("/exams", methods=["GET"])
def get_all_exams():
    category = request.args.get("category", "").strip()
    query = {}
    if category:
        query["category"] = {"$regex": f"^{category}$", "$options": "i"}

    exams = list(mongo.db.exams.find(
        query,
        {"name": 1, "slug": 1, "category": 1, "level": 1, "status": 1, "exam_date": 1, "rating": 1}
    ))
    for exam in exams:
        exam["_id"] = str(exam["_id"])
    return jsonify(exams), 200


# ---------------- GET SINGLE EXAM ----------------
@exam_bp.route("/exams/<slug>", methods=["GET"])
def get_single_exam(slug):
    # ✅ FIX: Agar duplicate hain toh latest wala lo (sort by _id descending)
    exams = list(mongo.db.exams.find({"slug": slug}).sort("_id", -1).limit(1))
    if not exams:
        return jsonify({"error": "Exam not found"}), 404

    exam = exams[0]
    exam["_id"] = str(exam["_id"])

    if "created_at" in exam:
        exam["created_at"] = str(exam["created_at"])
    if "updated_at" in exam:
        exam["updated_at"] = str(exam["updated_at"])

    raw = exam.get("tabs", {})
    exam["tabs"] = {
        "overview":         raw.get("overview", ""),
        "application":      raw.get("application", ""),
        "eligibility":      raw.get("eligibility", ""),
        "exam_pattern":     raw.get("exam_pattern", {}),
        "syllabus":         raw.get("syllabus", {}),
        "preparation_tips": raw.get("preparation_tips", []),
        "important_dates":  raw.get("important_dates", []),
        "pyqs":             raw.get("pyqs", {}),
        "mock_tests":       raw.get("mock_tests", {}),
    }

    return jsonify(exam), 200


# ---------------- GET COACHINGS BY EXAM ----------------
@coaching_bp.route("/coachings/<exam_slug>", methods=["GET"])
def get_coachings(exam_slug):
    coachings = list(
        mongo.db.coachings.find({
            "exam_slug": exam_slug,
            "city": "Lucknow"
        })
    )
    for c in coachings:
        c["_id"] = str(c["_id"])
        if "created_at" in c:
            c["created_at"] = str(c["created_at"])
        if "updated_at" in c:
            c["updated_at"] = str(c["updated_at"])
    return jsonify(coachings), 200


# ---------------- ADD EXAM ----------------
@exam_bp.route("/exams", methods=["POST"])
def add_exam():
    data = request.get_json()

    if not data.get("name") or not data.get("slug"):
        return jsonify({"error": "Name and slug required"}), 400

    # ✅ FIX: Duplicate slug check — same slug se dobara add na ho
    existing = mongo.db.exams.find_one({"slug": data["slug"]})
    if existing:
        return jsonify({
            "error": f"Exam with slug '{data['slug']}' already exists! Use a different slug or update the existing exam."
        }), 400

    exam = {
        "name":       data["name"],
        "slug":       data["slug"],
        "category":   data.get("category", ""),
        "level":      data.get("level", "National"),
        "status":     data.get("status", "Upcoming"),
        "exam_date":  data.get("exam_date", ""),
        "rating":     data.get("rating", 4.5),
        "tabs":       data.get("tabs", {}),
        "created_at": datetime.utcnow()
    }

    mongo.db.exams.insert_one(exam)
    return jsonify({"message": "Exam added successfully"}), 201


# ---------------- UPDATE EXAM ----------------
# ✅ REPLACE the update_exam function in routes/exam_routes.py with this:

@exam_bp.route("/exams/<id>", methods=["PUT"])
def update_exam(id):
    data = request.get_json()

    # Remove fields that should not be updated
    data.pop("_id", None)
    data.pop("created_at", None)

    # ✅ Add updated_at timestamp
    from datetime import datetime
    data["updated_at"] = datetime.utcnow()

    # ✅ If tabs is being updated, merge properly instead of replacing
    # First get existing exam
    try:
        existing = mongo.db.exams.find_one({"_id": ObjectId(id)})
        if not existing:
            return jsonify({"error": "Exam not found"}), 404

        # Build update dict - direct fields
        update_fields = {}
        direct_fields = ["name", "slug", "category", "level", "status", "exam_date", "rating", "updated_at"]
        for field in direct_fields:
            if field in data:
                update_fields[field] = data[field]

        # ✅ Handle tabs separately - merge with existing
        if "tabs" in data:
            existing_tabs = existing.get("tabs", {})
            new_tabs = data["tabs"]
            merged_tabs = {**existing_tabs, **new_tabs}
            update_fields["tabs"] = merged_tabs

        result = mongo.db.exams.update_one(
            {"_id": ObjectId(id)},
            {"$set": update_fields}
        )

        if result.matched_count == 0:
            return jsonify({"error": "Exam not found"}), 404

        return jsonify({"message": "Exam updated successfully"}), 200

    except Exception as e:
        print(f"[Exam Update Error]: {e}")
        return jsonify({"error": str(e)}), 400


# ---------------- DELETE EXAM ----------------
@exam_bp.route("/exams/<id>", methods=["DELETE"])
def delete_exam(id):
    result = mongo.db.exams.delete_one({"_id": ObjectId(id)})

    if result.deleted_count == 0:
        return jsonify({"error": "Exam not found"}), 404

    return jsonify({"message": "Exam deleted successfully"}), 200


# ---------------- UPDATE COACHING ----------------
@coaching_bp.route("/coachings/<coaching_id>", methods=["PUT"])
def update_coaching(coaching_id):
    data = request.get_json()
    try:
        data.pop("_id", None)
        data.pop("created_at", None)
        data.pop("updated_at", None)

        result = mongo.db.coachings.update_one(
            {"_id": ObjectId(coaching_id)},
            {"$set": data}
        )
        if result.matched_count == 0:
            return jsonify({"error": "Coaching not found"}), 404
        return jsonify({"message": "Updated successfully"}), 200
    except Exception as e:
        print(f"[Coaching Update Error]: {e}")
        return jsonify({"error": str(e)}), 400
    #------ADD COACHING ROUTE______
    # ✅ NEW: Add coaching
@coaching_bp.route("/coachings", methods=["POST"])
def add_coaching():
    data = request.get_json()
    if not data.get("institute_name") or not data.get("exam_slug"):
        return jsonify({"error": "institute_name and exam_slug required"}), 400

    data["created_at"] = datetime.utcnow()
    data["updated_at"] = datetime.utcnow()

    mongo.db.coachings.insert_one(data)
    return jsonify({"message": "Coaching added successfully"}), 201

# ✅ NEW: Delete coaching
@coaching_bp.route("/coachings/<coaching_id>", methods=["DELETE"])
def delete_coaching(coaching_id):
    result = mongo.db.coachings.delete_one({"_id": ObjectId(coaching_id)})
    if result.deleted_count == 0:
        return jsonify({"error": "Not found"}), 404
    return jsonify({"message": "Deleted successfully"}), 200
