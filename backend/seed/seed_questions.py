# backend/seed_questions.py
# Run: python seed_questions.py (from backend/ folder)

import json, sys, os
from pymongo import MongoClient

client = MongoClient("mongodb://127.0.0.1:27017/")
db     = client["ExamPrep360"]

# ── questions.json is in backend/data/ folder ────────────────────────────
json_path = os.path.join(
    os.path.dirname(os.path.abspath(__file__)),
    "data",
    "questions.json"
)

if not os.path.exists(json_path):
    print(f"❌ Not found: {json_path}")
    sys.exit(1)

print("📂 Loading data/questions.json...")
with open(json_path, "r", encoding="utf-8") as f:
    data = json.load(f)

# Clean MongoDB _id field
for item in data:
    if "_id" in item and isinstance(item["_id"], dict):
        del item["_id"]

print(f"📊 Total questions: {len(data)}")

db.questions.drop()
result = db.questions.insert_many(data)
print(f"✅ Inserted {len(result.inserted_ids)} questions into ExamPrep360.questions")

db.questions.create_index([("exam_name", 1), ("test_no", 1)])
db.questions.create_index("exam_name")
print("✅ Indexes created")

client.close()
print("🎉 Done! Mock tests ready.")
