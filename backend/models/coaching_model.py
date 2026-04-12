from datetime import datetime


def build_coaching_document(data: dict) -> dict:
    """Validates and returns a clean coaching document for MongoDB insertion."""
    return {
        "institute_name": data.get("institute_name", ""),
        "exam_slug": data.get("exam_slug", ""),
        "city": data.get("city", "Lucknow"),
        "course": data.get("course", ""),
        "fees": data.get("fees", ""),
        "mode": data.get("mode", ""),
        "rating": data.get("rating", 0.0),
        "students_enrolled": data.get("students_enrolled", 0),
        "success_rate": data.get("success_rate", ""),
        "faculty_count": data.get("faculty_count", 0),
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow(),
    }
