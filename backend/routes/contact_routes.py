# backend/routes/contact_routes.py
from flask import Blueprint, jsonify, request
from extensions import mongo
from datetime import datetime
from bson import ObjectId
import smtplib, os
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

contact_bp = Blueprint("contact_bp", __name__)

SMTP_HOST     = "smtp.gmail.com"
SMTP_PORT     = 587
SMTP_USER     = os.environ.get("SMTP_USER",     "your_gmail@gmail.com")
SMTP_PASSWORD = os.environ.get("SMTP_PASSWORD", "your_app_password")


def send_email(to_email, subject, body):
    try:
        msg = MIMEMultipart("alternative")
        msg["Subject"] = subject
        msg["From"]    = f"ExamPrep360 <{SMTP_USER}>"
        msg["To"]      = to_email
        html = f"""
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;">
          <div style="background:linear-gradient(135deg,#2563eb,#4f46e5);padding:24px;border-radius:12px 12px 0 0;text-align:center;">
            <h2 style="color:white;margin:0;">ExamPrep360</h2>
          </div>
          <div style="background:#fff;padding:28px;border:1px solid #e5e7eb;border-radius:0 0 12px 12px;">
            <p style="color:#374151;font-size:15px;line-height:1.7;">{body.replace(chr(10),'<br>')}</p>
            <hr style="border:none;border-top:1px solid #e5e7eb;margin:20px 0;">
            <p style="color:#9ca3af;font-size:12px;">ExamPrep360 Team | examprep360.com</p>
          </div>
        </div>"""
        msg.attach(MIMEText(html, "html"))
        with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as s:
            s.starttls()
            s.login(SMTP_USER, SMTP_PASSWORD)
            s.sendmail(SMTP_USER, to_email, msg.as_string())
        return True
    except Exception as e:
        print(f"[Email Error]: {e}")
        return False


def doc_serialize(d):
    if d:
        d["_id"]        = str(d["_id"])
        d["created_at"] = str(d.get("created_at",""))
        if d.get("replied_at"):
            d["replied_at"] = str(d["replied_at"])
    return d


# ════════ CONTACT US ════════════════════════════════════════

@contact_bp.route("/contact", methods=["POST"])
def submit_contact():
    data = request.get_json()
    for f in ["name","email","subject","message"]:
        if not data.get(f,"").strip():
            return jsonify({"error": f"{f} is required"}), 400

    doc = {
        "type":        "contact",
        "name":        data["name"].strip(),
        "email":       data["email"].strip().lower(),
        "subject":     data["subject"].strip(),
        "message":     data["message"].strip(),
        "status":      "pending",
        "admin_reply": None,
        "created_at":  datetime.utcnow(),
        "replied_at":  None,
    }
    mongo.db.contact_queries.insert_one(doc)

    # Auto-confirm email to user
    send_email(
        data["email"],
        "We received your query — ExamPrep360",
        f"Dear {data['name']},\n\nThank you for contacting ExamPrep360!\n\n"
        f"We received your query about \"{data['subject']}\" and will respond within 24–48 hours.\n\n"
        f"Your Message:\n{data['message']}\n\nBest regards,\nExamPrep360 Support Team"
    )
    return jsonify({"message": "Query submitted successfully"}), 201


@contact_bp.route("/contact", methods=["GET"])
def get_contact_queries():
    docs = list(mongo.db.contact_queries.find({"type":"contact"}).sort("created_at",-1))
    return jsonify([doc_serialize(d) for d in docs]), 200


@contact_bp.route("/contact/<qid>/reply", methods=["POST"])
def reply_contact(qid):
    reply = request.get_json().get("reply","").strip()
    if not reply:
        return jsonify({"error":"Reply is required"}), 400

    doc = mongo.db.contact_queries.find_one({"_id": ObjectId(qid)})
    if not doc:
        return jsonify({"error":"Not found"}), 404

    ok = send_email(
        doc["email"],
        f"Re: {doc['subject']} — ExamPrep360",
        f"Dear {doc['name']},\n\nThank you for reaching out to ExamPrep360.\n\n"
        f"Your Query: {doc['subject']}\n\nOur Response:\n{reply}\n\n"
        f"Best regards,\nExamPrep360 Support Team"
    )
    mongo.db.contact_queries.update_one(
        {"_id": ObjectId(qid)},
        {"$set": {"admin_reply": reply, "status": "replied", "replied_at": datetime.utcnow()}}
    )
    return jsonify({"message":"Reply sent", "email_sent": ok}), 200


# ════════ ADVERTISE ═════════════════════════════════════════

@contact_bp.route("/advertise", methods=["POST"])
def submit_advertise():
    data = request.get_json()
    for f in ["name","company","email"]:
        if not data.get(f,"").strip():
            return jsonify({"error": f"{f} is required"}), 400

    doc = {
        "type":        "advertise",
        "name":        data.get("name","").strip(),
        "company":     data.get("company","").strip(),
        "email":       data.get("email","").strip().lower(),
        "phone":       data.get("phone","").strip(),
        "budget":      data.get("budget","").strip(),
        "message":     data.get("message","").strip(),
        "status":      "pending",
        "admin_reply": None,
        "created_at":  datetime.utcnow(),
        "replied_at":  None,
    }
    mongo.db.contact_queries.insert_one(doc)

    send_email(
        data["email"],
        "Advertising Enquiry Received — ExamPrep360",
        f"Dear {data['name']},\n\nThank you for your interest in advertising with ExamPrep360!\n\n"
        f"Company: {data.get('company','')}\nBudget: {data.get('budget','Not specified')}\n\n"
        f"Our advertising team will contact you within 24 hours.\n\nBest regards,\nExamPrep360 Team"
    )
    return jsonify({"message": "Enquiry submitted successfully"}), 201


@contact_bp.route("/advertise", methods=["GET"])
def get_advertise_queries():
    docs = list(mongo.db.contact_queries.find({"type":"advertise"}).sort("created_at",-1))
    return jsonify([doc_serialize(d) for d in docs]), 200


@contact_bp.route("/advertise/<qid>/reply", methods=["POST"])
def reply_advertise(qid):
    reply = request.get_json().get("reply","").strip()
    if not reply:
        return jsonify({"error":"Reply is required"}), 400

    doc = mongo.db.contact_queries.find_one({"_id": ObjectId(qid)})
    if not doc:
        return jsonify({"error":"Not found"}), 404

    ok = send_email(
        doc["email"],
        "Re: Advertising Enquiry — ExamPrep360",
        f"Dear {doc['name']} ({doc.get('company','')}),\n\n"
        f"Our Response:\n{reply}\n\nBest regards,\nExamPrep360 Advertising Team"
    )
    mongo.db.contact_queries.update_one(
        {"_id": ObjectId(qid)},
        {"$set": {"admin_reply": reply, "status": "replied", "replied_at": datetime.utcnow()}}
    )
    return jsonify({"message":"Reply sent", "email_sent": ok}), 200


# ════════ COMBINED (admin dashboard) ════════════════════════

@contact_bp.route("/queries/all", methods=["GET"])
def get_all_queries():
    docs = list(mongo.db.contact_queries.find({}).sort("created_at",-1))
    return jsonify([doc_serialize(d) for d in docs]), 200


@contact_bp.route("/queries/stats", methods=["GET"])
def get_stats():
    return jsonify({
        "total":     mongo.db.contact_queries.count_documents({}),
        "pending":   mongo.db.contact_queries.count_documents({"status":"pending"}),
        "replied":   mongo.db.contact_queries.count_documents({"status":"replied"}),
        "contact":   mongo.db.contact_queries.count_documents({"type":"contact"}),
        "advertise": mongo.db.contact_queries.count_documents({"type":"advertise"}),
    }), 200

# ════════ USER: APNI QUERIES DEKHO BY EMAIL ════════════════
@contact_bp.route("/contact/my-queries", methods=["GET"])
def get_my_contact_queries():
    email = request.args.get("email", "").strip().lower()
    if not email:
        return jsonify([]), 200
    
    docs = list(mongo.db.contact_queries.find(
        {"type": "contact", "email": email}
    ).sort("created_at", -1))
    
    return jsonify([doc_serialize(d) for d in docs]), 200


@contact_bp.route("/advertise/my-queries", methods=["GET"])
def get_my_advertise_queries():
    email = request.args.get("email", "").strip().lower()
    if not email:
        return jsonify([]), 200
    
    docs = list(mongo.db.contact_queries.find(
        {"type": "advertise", "email": email}
    ).sort("created_at", -1))
    
    return jsonify([doc_serialize(d) for d in docs]), 200
