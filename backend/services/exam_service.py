from extensions import mongo
from bson.objectid import ObjectId

def get_all_exams():
    # Fetching all exams and converting _id for frontend compatibility
    exams = list(mongo.db.exams.find())
    for exam in exams:
        exam["_id"] = str(exam["_id"])
    return exams


def get_exam_by_slug(slug):
    # Fetching specific exam using slug
    exam = mongo.db.exams.find_one({"slug": slug})
    if exam:
        exam["_id"] = str(exam["_id"])
    return exam


def add_exam(name, slug, category, level, status, rating, card_data, full_data):
    exam = {
        "name": name,
        "slug": slug,
        "category": category,
        "level": level,
        "status": status,
        "rating": rating,
        "cardData": card_data,
        "fullData": full_data
    }

    result = mongo.db.exams.insert_one(exam)
    exam["_id"] = str(result.inserted_id)
    return exam


def update_exam(identifier, data):
    """
    Modified to handle both Slug and MongoDB ID for robustness.
    """
    query = {}
    if ObjectId.is_valid(identifier):
        query = {"_id": ObjectId(identifier)}
    else:
        query = {"slug": identifier}

    # Remove _id from data to prevent immutable field update error
    if "_id" in data:
        del data["_id"]

    mongo.db.exams.update_one(
        query,
        {"$set": data}
    )
    
    # Return updated document
    updated_exam = mongo.db.exams.find_one(query)
    if updated_exam:
        updated_exam["_id"] = str(updated_exam["_id"])
    return updated_exam


def delete_exam(identifier):
    """
    INDUSTRY FIX: Tries to delete by ObjectId first (for corrupted N/A slugs),
    then falls back to Slug.
    """
    query = {}
    if ObjectId.is_valid(identifier):
        query = {"_id": ObjectId(identifier)}
    else:
        query = {"slug": identifier}

    result = mongo.db.exams.delete_one(query)
    
    # Returns True if a document was actually deleted
    return result.deleted_count > 0
