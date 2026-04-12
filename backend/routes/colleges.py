from flask import Blueprint, jsonify, request
from extensions import mongo
from bson import ObjectId

colleges_bp = Blueprint("colleges_bp", __name__)


def serialize(doc):
    """Convert MongoDB doc to JSON-safe dict"""
    if doc:
        doc["_id"] = str(doc["_id"])
    return doc


@colleges_bp.route("/colleges", methods=["GET"])
def get_all_colleges():
    category     = request.args.get("category", "").strip()
    exam         = request.args.get("exam", "").strip()
    course       = request.args.get("course", "").strip()
    state        = request.args.get("state", "").strip()
    college_type = request.args.get("type", "").strip()

    query = {}
    if category:
        query["category"] = {"$regex": f"^{category}$", "$options": "i"}
    if exam:
        query["exams_accepted"] = exam
    if state:
        query["state"] = {"$regex": f"^{state}$", "$options": "i"}
    if college_type:
        query["type"] = {"$regex": f"^{college_type}$", "$options": "i"}

    docs = list(mongo.db.colleges.find(query))

    # Course filter (array field)
    if course:
        docs = [d for d in docs if any(
            course.lower() in c.lower() for c in d.get("courses", [])
        )]

    return jsonify([serialize(d) for d in docs]), 200


@colleges_bp.route("/colleges/<slug>", methods=["GET"])
def get_college(slug):
    doc = mongo.db.colleges.find_one({"slug": slug})
    if not doc:
        return jsonify({"error": "College not found"}), 404
    return jsonify(serialize(doc)), 200


# ✅ NEW: Admin — update college
@colleges_bp.route("/colleges/<slug>", methods=["PUT"])
def update_college(slug):
    data = request.get_json()
    # Remove _id if present to avoid errors
    data.pop("_id", None)
    result = mongo.db.colleges.update_one(
        {"slug": slug},
        {"$set": data}
    )
    if result.matched_count == 0:
        return jsonify({"error": "College not found"}), 404
    return jsonify({"message": "College updated successfully"}), 200
