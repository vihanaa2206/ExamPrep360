from models.exam_model import exams_db, Exam


# GET all exams
def get_all():
    return exams_db


# GET exam by slug
def get_by_slug(slug):
    for exam in exams_db:
        if exam.slug == slug:
            return exam
    return None


# ADD new exam
def add_exam(
    name,
    slug,
    category,
    level,
    status,
    rating,
    card_data,
    full_data
):
    exam_id = len(exams_db) + 1

    exam = Exam(
        exam_id=exam_id,
        name=name,
        slug=slug,
        category=category,
        level=level,
        status=status,
        rating=rating,
        card_data=card_data,
        full_data=full_data
    )

    exams_db.append(exam)
    return exam


# UPDATE exam (by slug)
def update_exam(slug, updated_data):
    exam = get_by_slug(slug)
    if not exam:
        return None

    exam.full_data = updated_data
    return exam


# DELETE exam (by slug)
def delete_exam(slug):
    exam = get_by_slug(slug)
    if not exam:
        return False

    exams_db.remove(exam)
    return True


# CATEGORY WISE LIST
def get_by_category(category):
    return [exam for exam in exams_db if exam.category == category]
