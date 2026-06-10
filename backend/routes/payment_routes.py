# routes/payment_routes.py
import os
import hmac
import hashlib
import razorpay
from datetime import datetime, timedelta
from flask import Blueprint, request, jsonify
from extensions import mongo
from bson import ObjectId

payment_bp = Blueprint("payment_bp", __name__)

RAZORPAY_KEY_ID     = os.environ.get("RAZORPAY_KEY_ID",     "rzp_test_SdfeTa9dq4DYws")
RAZORPAY_KEY_SECRET = os.environ.get("RAZORPAY_KEY_SECRET", "MzDFpEXhGkEIdTPjFWC2zIr")

client = razorpay.Client(auth=(RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET))

ALL_CATEGORIES = ["Law", "Government", "Engineering", "Medical", "Management", "Computer Science"]

PLANS = {
    "basic": {
        "name": "Basic Plan", "amount": 19900,
        "description": "Choose any 2 exam categories",
        "max_categories": 2, "duration_days": 90,
    },
    "standard": {
        "name": "Standard Plan", "amount": 49900,
        "description": "Choose any 4 exam categories",
        "max_categories": 4, "duration_days": 180,
    },
    "premium": {
        "name": "Premium Plan", "amount": 99900,
        "description": "Access to ALL 6 exam categories",
        "max_categories": 6, "duration_days": 365,
    },
}

CATEGORY_EXAMS = {
    "Law":              ["CLAT", "AILET", "DU LLB", "AP LAWCET"],
    "Government":       ["UPSC CSE", "SSC CGL", "IBPS PO", "RRB NTPC"],
    "Engineering":      ["JEE Main", "JEE Advanced", "BITSAT", "VITEEE"],
    "Medical":          ["NEET UG", "NEET PG", "JIPMER", "AFMC"],
    "Management":       ["CAT", "CMAT", "MAT", "XAT"],
    "Computer Science": ["GATE CS", "NIMCET", "CUET PG", "IIT JAM"],
}


def get_exams_for_categories(categories):
    exams = []
    for cat in categories:
        exams.extend(CATEGORY_EXAMS.get(cat, []))
    return exams


def user_has_access(user_doc, exam_name):
    purchases = user_doc.get("purchases", [])
    now = datetime.utcnow()
    for p in purchases:
        if p.get("status") != "paid":
            continue
        expires = p.get("expires_at")
        if expires and datetime.fromisoformat(expires) < now:
            continue
        if p.get("plan") == "premium":
            return True
        if exam_name in get_exams_for_categories(p.get("categories", [])):
            return True
    return False


@payment_bp.route("/payment/plans", methods=["GET"])
def get_plans():
    return jsonify([{
        "key": key, "name": p["name"],
        "amount": p["amount"], "amount_inr": p["amount"] // 100,
        "description": p["description"],
        "max_categories": p["max_categories"],
        "duration_days": p["duration_days"],
        "all_categories": ALL_CATEGORIES,
    } for key, p in PLANS.items()]), 200


@payment_bp.route("/payment/order", methods=["POST"])
def create_order():
    data = request.get_json()
    user_id, plan_key = data.get("user_id"), data.get("plan")
    categories = data.get("categories", [])

    if not user_id or not plan_key:
        return jsonify({"error": "user_id and plan required"}), 400
    plan = PLANS.get(plan_key)
    if not plan:
        return jsonify({"error": "Invalid plan"}), 400

    if plan_key == "premium":
        categories = ALL_CATEGORIES
    else:
        if len(categories) != plan["max_categories"]:
            return jsonify({"error": f"Choose exactly {plan['max_categories']} categories"}), 400
        for c in categories:
            if c not in ALL_CATEGORIES:
                return jsonify({"error": f"Invalid category: {c}"}), 400

    try:
        user = mongo.db.users.find_one({"_id": ObjectId(user_id)})
    except Exception:
        return jsonify({"error": "Invalid user_id"}), 400
    if not user:
        return jsonify({"error": "User not found"}), 404

    try:
        order = client.order.create({
            "amount": plan["amount"], "currency": "INR",
            "receipt": f"rcpt_{int(datetime.utcnow().timestamp())}",
            "notes": {"user_id": user_id, "plan": plan_key,
                      "categories": ",".join(categories)},
        })
    except Exception as e:
        return jsonify({"error": f"Razorpay error: {str(e)}"}), 500

    payment_doc = {
        "user_id": user_id, "user_name": user.get("name", ""),
        "user_email": user.get("email", ""), "plan": plan_key,
        "plan_name": plan["name"], "categories": categories,
        "order_id": order["id"], "amount": plan["amount"],
        "currency": "INR", "status": "pending",
        "created_at": datetime.utcnow().isoformat(),
    }
    mongo.db.payments.insert_one(payment_doc)
    payment_doc.pop("_id", None)

    return jsonify({
        "order_id": order["id"], "amount": plan["amount"],
        "currency": "INR", "key_id": RAZORPAY_KEY_ID,
        "plan_name": plan["name"], "categories": categories,
        "user_name": user.get("name", ""), "user_email": user.get("email", ""),
    }), 200


@payment_bp.route("/payment/verify", methods=["POST"])
def verify_payment():
    data = request.get_json()
    order_id   = data.get("razorpay_order_id")
    payment_id = data.get("razorpay_payment_id")
    signature  = data.get("razorpay_signature")
    user_id    = data.get("user_id")
    plan_key   = data.get("plan")
    categories = data.get("categories", [])

    if not all([order_id, payment_id, signature, user_id, plan_key]):
        return jsonify({"error": "Missing fields"}), 400

    try:
        client.utility.verify_payment_signature({
            "razorpay_order_id":   order_id,
            "razorpay_payment_id": payment_id,
            "razorpay_signature":  signature,
        })
    except razorpay.errors.SignatureVerificationError:
        return jsonify({"error": "Payment verification failed - invalid signature"}), 400
    except Exception as e:
        return jsonify({"error": f"Verification error: {str(e)}"}), 400

    plan = PLANS.get(plan_key)
    if not plan:
        return jsonify({"error": "Invalid plan"}), 400

    if plan_key == "premium":
        categories = ALL_CATEGORIES

    now = datetime.utcnow()
    expires_at = (now + timedelta(days=plan["duration_days"])).isoformat()

    purchase_entry = {
        "plan": plan_key, "plan_name": plan["name"],
        "order_id": order_id, "payment_id": payment_id,
        "amount": plan["amount"], "amount_inr": plan["amount"] // 100,
        "status": "paid", "purchased_at": now.isoformat(),
        "expires_at": expires_at, "categories": categories,
        "exams": get_exams_for_categories(categories),
    }

    try:
        mongo.db.users.update_one(
            {"_id": ObjectId(user_id)},
            {"$push": {"purchases": purchase_entry}}
        )
    except Exception as e:
        return jsonify({"error": f"DB error: {str(e)}"}), 500

    mongo.db.payments.update_one(
        {"order_id": order_id},
        {"$set": {"status": "paid", "payment_id": payment_id,
                  "paid_at": now.isoformat(), "expires_at": expires_at,
                  "categories": categories}}
    )

    updated_user = mongo.db.users.find_one({"_id": ObjectId(user_id)})
    return jsonify({
        "success": True,
        "message": f"{plan['name']} activated successfully!",
        "expires_at": expires_at,
        "purchases": updated_user.get("purchases", []),
    }), 200


@payment_bp.route("/payment/access/<user_id>/<exam_name>", methods=["GET"])
def check_access(user_id, exam_name):
    try:
        user = mongo.db.users.find_one({"_id": ObjectId(user_id)})
    except Exception:
        return jsonify({"has_access": False}), 200
    if not user:
        return jsonify({"has_access": False}), 200
    return jsonify({"has_access": user_has_access(user, exam_name)}), 200


@payment_bp.route("/payment/my-purchases/<user_id>", methods=["GET"])
def my_purchases(user_id):
    try:
        user = mongo.db.users.find_one({"_id": ObjectId(user_id)})
    except Exception:
        return jsonify({"purchases": []}), 200
    if not user:
        return jsonify({"purchases": []}), 200
    return jsonify({"purchases": user.get("purchases", [])}), 200


@payment_bp.route("/payment/all", methods=["GET"])
def all_payments():
    return jsonify(
        list(mongo.db.payments.find({}, {"_id": 0}).sort("created_at", -1))
    ), 200


@payment_bp.route("/payment/stats", methods=["GET"])
def payment_stats():
    all_p = list(mongo.db.payments.find({}))
    paid    = [p for p in all_p if p.get("status") == "paid"]
    pending = [p for p in all_p if p.get("status") == "pending"]
    plan_breakdown = {}
    for p in paid:
        pk = p.get("plan", "unknown")
        plan_breakdown[pk] = plan_breakdown.get(pk, 0) + 1
    return jsonify({
        "total_transactions": len(paid),
        "total_revenue":      sum(p.get("amount", 0) for p in paid) // 100,
        "pending_count":      len(pending),
        "plan_breakdown":     plan_breakdown,
    }), 200


@payment_bp.route("/payment/delete/<order_id>", methods=["DELETE"])
def delete_payment(order_id):
    result = mongo.db.payments.delete_one({"order_id": order_id})
    if result.deleted_count == 0:
        return jsonify({"error": "Record not found"}), 404
    return jsonify({"success": True, "message": "Payment record deleted"}), 200