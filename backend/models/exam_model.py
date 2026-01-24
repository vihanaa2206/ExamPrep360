class Exam:
    """
    Represents the structure of an exam entity
    """

    def __init__(self, exam_id, name, level, description):
        self.id = exam_id          
        self.name = name
        self.level = level
        self.description = description

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "level": self.level,
            "description": self.description
        }


# In-memory storage for exams (temporary)
exams_db = []

