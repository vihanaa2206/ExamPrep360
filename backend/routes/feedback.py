# ============================================================
# backend/routes/feedback.py  —  FIXED v2
# ============================================================
from flask import Blueprint, jsonify, request
from extensions import mongo
from bson import ObjectId
from datetime import datetime
from collections import Counter
import traceback

feedback_bp = Blueprint("feedback_bp", __name__)


def serialize(doc):
    doc["_id"] = str(doc["_id"])
    if "user_id" in doc and isinstance(doc["user_id"], ObjectId):
        doc["user_id"] = str(doc["user_id"])
    return doc


def normalize(fb):
    # ── field name aliases ────────────────────────────────────
    if "user_name" in fb and not fb.get("userName"):
        fb["userName"] = fb.pop("user_name")
    if "user_email" in fb and not fb.get("userEmail"):
        fb["userEmail"] = fb.pop("user_email")

    # modules → ratings
    if "modules" in fb and not fb.get("ratings"):
        fb["ratings"] = fb.pop("modules")

    # ── flatten nested ratings ────────────────────────────────
    if isinstance(fb.get("ratings"), dict):
        flat = {}
        for k, v in fb["ratings"].items():
            if isinstance(v, dict):
                flat[k] = v.get("rating", "")
            else:
                flat[k] = v
        fb["ratings"] = flat

    # ── overallRating from ratings values ────────────────────
    if not fb.get("overallRating") and fb.get("ratings"):
        vals = [v for v in fb["ratings"].values() if v]
        fb["overallRating"] = Counter(vals).most_common(1)[0][0] if vals else "Average"

    # normalize overallRating to Title Case
    rating_map = {
        "excellent": "Excellent", "good": "Good",
        "average": "Average",     "bad": "Bad", "worst": "Worst"
    }
    raw = (fb.get("overallRating") or "average").lower().strip()
    fb["overallRating"] = rating_map.get(raw, "Average")

    # ── date ─────────────────────────────────────────────────
    if "submitted_at" in fb and not fb.get("createdAt"):
        fb["createdAt"] = fb.pop("submitted_at")

    val = fb.get("createdAt")
    if isinstance(val, datetime):
        fb["createdAt"] = val.isoformat()
    elif not val:
        fb["createdAt"] = ""

    return fb


# ── POST /api/feedbacks ──────────────────────────────────────
@feedback_bp.route("/feedbacks", methods=["POST"])
def submit_feedback():
    try:
        data = request.get_json()
        user_id    = data.get("user_id")
        user_name  = data.get("userName", "Anonymous")
        user_email = data.get("userEmail", "")
        ratings    = data.get("ratings", {})

        # flatten nested if needed
        flat_ratings = {}
        for k, v in ratings.items():
            if isinstance(v, dict):
                flat_ratings[k] = v.get("rating", "")
            else:
                flat_ratings[k] = v

        if flat_ratings:
            vals = [v for v in flat_ratings.values() if v]
            overall = Counter(vals).most_common(1)[0][0] if vals else "Average"
        else:
            overall = data.get("overallRating", "Average")

        # Title-case overall
        rating_map = {
            "excellent": "Excellent", "good": "Good",
            "average": "Average",     "bad": "Bad", "worst": "Worst"
        }
        overall = rating_map.get(overall.lower().strip(), overall)

        suggestion = data.get("suggestion", "").strip()

        if not user_id:
            return jsonify({"error": "user_id is required"}), 400

        doc = {
            "user_id":       user_id,
            "userName":      user_name,
            "userEmail":     user_email,
            "ratings":       flat_ratings,
            "overallRating": overall,
            "suggestion":    suggestion,
            "createdAt":     datetime.utcnow().isoformat(),
        }

        result = mongo.db.feedback.insert_one(doc)
        doc["_id"] = str(result.inserted_id)
        return jsonify({"message": "Feedback saved", "feedback": doc}), 201

    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500


# ── GET /api/feedbacks ───────────────────────────────────────
@feedback_bp.route("/feedbacks", methods=["GET"])
def get_all_feedbacks():
    try:
        feedbacks = list(mongo.db.feedback.find())

        result = []
        for fb in feedbacks:
            fb = serialize(fb)
            fb = normalize(fb)

            # look up userName from users collection if missing/empty
            if not fb.get("userName") or fb["userName"].strip() in ("", "Anonymous"):
                try:
                    uid = fb.get("user_id")
                    if uid:
                        user = mongo.db.users.find_one(
                            {"_id": ObjectId(uid)},
                            {"name": 1, "email": 1, "_id": 0}
                        )
                        if user:
                            fb["userName"]  = user.get("name",  "") or fb.get("userName", "Anonymous")
                            fb["userEmail"] = user.get("email", "") or fb.get("userEmail", "")
                except Exception:
                    pass

            # same for userEmail
            if not fb.get("userEmail") or fb["userEmail"].strip() == "":
                try:
                    uid = fb.get("user_id")
                    if uid:
                        user = mongo.db.users.find_one(
                            {"_id": ObjectId(uid)},
                            {"email": 1, "_id": 0}
                        )
                        if user:
                            fb["userEmail"] = user.get("email", "")
                except Exception:
                    pass

            result.append(fb)

        result.sort(key=lambda x: x.get("createdAt") or "", reverse=True)
        return jsonify(result), 200

    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500


# ── GET /api/feedbacks/<id> ──────────────────────────────────
@feedback_bp.route("/feedbacks/<feedback_id>", methods=["GET"])
def get_feedback(feedback_id):
    try:
        fb = mongo.db.feedback.find_one({"_id": ObjectId(feedback_id)})
        if not fb:
            return jsonify({"error": "Feedback not found"}), 404
        fb = serialize(fb)
        fb = normalize(fb)
        return jsonify(fb), 200
    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500


# ── DELETE /api/feedbacks/<id> ───────────────────────────────
@feedback_bp.route("/feedbacks/<feedback_id>", methods=["DELETE"])
def delete_feedback(feedback_id):
    try:
        res = mongo.db.feedback.delete_one({"_id": ObjectId(feedback_id)})
        if res.deleted_count == 0:
            return jsonify({"error": "Feedback not found"}), 404
        return jsonify({"message": "Feedback deleted"}), 200
    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500


# ── GET /api/feedbacks/stats ─────────────────────────────────
@feedback_bp.route("/feedbacks/stats", methods=["GET"])
def feedback_stats():
    try:
        pipeline = [{"$group": {"_id": "$overallRating", "count": {"$sum": 1}}}]
        raw   = list(mongo.db.feedback.aggregate(pipeline))
        total = mongo.db.feedback.count_documents({})
        stats = {item["_id"]: item["count"] for item in raw if item["_id"]}
        return jsonify({"total": total, "breakdown": stats}), 200
    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500
