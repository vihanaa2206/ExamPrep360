# fix_feedback_dates.py
from app import app
from extensions import mongo
from datetime import datetime

with app.app_context():
    feedbacks = list(mongo.db.feedback.find())
    fixed = 0

    for fb in feedbacks:
        val = fb.get("createdAt")
        if isinstance(val, datetime):
            mongo.db.feedback.update_one(
                {"_id": fb["_id"]},
                {"$set": {"createdAt": val.isoformat()}}
            )
            fixed += 1

    print(f"Fixed {fixed} docs")ss
