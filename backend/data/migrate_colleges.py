"""
backend/data/migrate_colleges.py
Run once: python migrate_colleges.py
Moves COLLEGES_DATA from Python file to MongoDB
"""
from pymongo import MongoClient
from colleges_data import COLLEGES_DATA

client = MongoClient("mongodb://localhost:27017/")
db = client["ExamPrep360"]

if __name__ == "__main__":
    db.colleges.drop()
    result = db.colleges.insert_many(COLLEGES_DATA)
    print(f"✅ Inserted {len(result.inserted_ids)} colleges into MongoDB")
    db.colleges.create_index("slug", unique=True)
    print("✅ Index on slug created")
