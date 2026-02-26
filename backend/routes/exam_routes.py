from flask import Blueprint, request, jsonify
from extensions import mongo
from bson.objectid import ObjectId

# Blueprint define karte waqt prefix mat lagaiye yahan
exam_bp = Blueprint("exam_bp", __name__)

def base_tabs_template():
    return {
        "application": "Information updated soon...",
        "eligibility": "Information updated soon...",
        "syllabus": "Information updated soon...",
        "pattern": "Information updated soon...",
        "preparation": "Information updated soon...",
        "mockTests": "Information updated soon...",
        "pyqs": "Information updated soon...",
        "coaching": "Information updated soon..."
    }

# Route simple rakhein: "/exams"
@exam_bp.route("/exams", methods=["GET", "POST"])
def handle_exams():
    if request.method == "POST":
        data = request.get_json()
        if not data:
            return jsonify({"error": "Invalid request"}), 400

        existing = mongo.db.exams.find_one({"slug": data.get("slug")})
        if existing:
            return jsonify({"error": "Slug already exists"}), 400

        exam_document = {
            "name": data.get("name"),
            "slug": data.get("slug"),
            "category": data.get("category"),
            "level": data.get("level"),
            "status": "Upcoming",
            "rating": 4.5,
            "fullData": data.get("tabs") or base_tabs_template()
        }
        mongo.db.exams.insert_one(exam_document)
        return jsonify({"message": "Success"}), 201

    # GET ALL
    exams = list(mongo.db.exams.find())
    for exam in exams:
        exam["_id"] = str(exam["_id"])
    return jsonify(exams), 200

@exam_bp.route("/exams/<identifier>", methods=["GET", "PUT", "DELETE"])
def handle_single_exam(identifier):
    query = {"_id": ObjectId(identifier)} if ObjectId.is_valid(identifier) else {"slug": identifier}
    
    exam = mongo.db.exams.find_one(query)
    if not exam:
        return jsonify({"error": "Not found"}), 404

    if request.method == "DELETE":
        mongo.db.exams.delete_one(query)
        return jsonify({"message": "Deleted"}), 200

    if request.method == "PUT":
        data = request.get_json()
        mongo.db.exams.update_one(query, {"$set": {
            "name": data.get("name"),
            "category": data.get("category"),
            "level": data.get("level"),
            "fullData": data.get("tabs") or data.get("fullData") or {}
        }})
        return jsonify({"message": "Updated"}), 200

    exam["_id"] = str(exam["_id"])
    exam["tabs"] = exam.get("fullData", base_tabs_template())
    return jsonify(exam), 200
