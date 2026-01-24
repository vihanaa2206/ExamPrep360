from models.exam_model import Exam, exams_db

def get_all_exams():
    """
    Returns list of all exams(in-memory)
    """
    return exams_db

def add_exam(name, level, description):
    """
    Adds a new exam to in-memory storage (ADMIN action)
    """
    exam_id = len(exams_db) + 1

    new_exam = Exam(
        exam_id=exam_id,
        name=name,
        level=level,
        description=description
    )

    exams_db.append(new_exam)

    return new_exam

def update_exam(exam_id, name, level, description):
    """
    Updates an existing exam (ADMIN action)
    """

    for exam in exams_db:
        if exam.id == exam_id:
            exam.name = name
            exam.level = level
            exam.description = description
            return exam

    return None

def delete_exam(exam_id):
    """
    Deletes an exam by id (ADMIN action)
    """
    for exam in exams_db:
        if exam.id == exam_id:
            exams_db.remove(exam)
            return True

    return False


