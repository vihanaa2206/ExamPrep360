from datetime import datetime


def get_exam_schema():
    return {
        "name": str,
        "slug": str,
        "category": str,
        "conducting_body": str,
        "official_website": str,
        "exam_mode": str,
        "exam_level": str,
        "tabs": {
            "overview": str,
            "application": str,
            "eligibility": str,
            "exam_pattern": dict,
            "syllabus": dict,
            "preparation_tips": list,
            "important_dates": list,
        },
        "created_at": datetime,
        "updated_at": datetime,
    }


def build_exam_document(data: dict) -> dict:
    """Validates and returns a clean exam document for MongoDB insertion."""
    return {
        "name": data.get("name", ""),
        "slug": data.get("slug", ""),
        "category": data.get("category", ""),
        "conducting_body": data.get("conducting_body", ""),
        "official_website": data.get("official_website", ""),
        "exam_mode": data.get("exam_mode", ""),
        "exam_level": data.get("exam_level", ""),
        "tabs": {
            "overview": data.get("tabs", {}).get("overview", ""),
            "application": data.get("tabs", {}).get("application", ""),
            "eligibility": data.get("tabs", {}).get("eligibility", ""),
            "exam_pattern": data.get("tabs", {}).get("exam_pattern", {}),
            "syllabus": data.get("tabs", {}).get("syllabus", {}),
            "preparation_tips": data.get("tabs", {}).get("preparation_tips", []),
            "important_dates": data.get("tabs", {}).get("important_dates", []),
        },
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow(),
    }
