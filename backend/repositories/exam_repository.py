from extensions import mongo

# Base tabs template
def base_template():
    return {
        "application": [],
        "eligibility": [],
        "syllabus": [],
        "pattern": [],
        "preparation": [],
        "mockTests": [],
        "pyqs": [],
        "coaching": []
    }

# GET all exams (cards only)
def get_all():
    exams = mongo.db.exams.find({}, {"_id": 0, "fullData": 0})
    return list(exams)

# GET by slug
def get_by_slug(slug):
    exam = mongo.db.exams.find_one({"slug": slug}, {"_id": 0})
    return exam

# ADD exam
def add_exam(data):
    if not data.get("fullData"):
        data["fullData"] = base_template()

    mongo.db.exams.insert_one(data)
    return data

# UPDATE exam
def update_exam(slug, updated_data):
    mongo.db.exams.update_one(
        {"slug": slug},
        {"$set": {"fullData": updated_data}}
    )
    return True

# DELETE exam
def delete_exam(slug):
    mongo.db.exams.delete_one({"slug": slug})
    return True

# CATEGORY FILTER
def get_by_category(category):
    exams = mongo.db.exams.find(
        {"category": category},
        {"_id": 0, "fullData": 0}
    )
    return list(exams)
