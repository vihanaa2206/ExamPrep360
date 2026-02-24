class Exam:
    def __init__(
        self,
        exam_id,
        name,
        slug,
        category,
        level,
        status,
        rating,
        card_data,
        full_data
    ):
        self.id = exam_id
        self.name = name
        self.slug = slug
        self.category = category
        self.level = level
        self.status = status
        self.rating = rating
        self.card_data = card_data
        self.full_data = full_data

    def to_card_dict(self):
        return {
            "name": self.name,
            "slug": self.slug,
            "category": self.category,
            "level": self.level,
            "status": self.status,
            "rating": self.rating,
            "cardData": self.card_data
        }

    def to_full_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "slug": self.slug,
            "category": self.category,
            "level": self.level,
            "status": self.status,
            "rating": self.rating,
            "cardData": self.card_data,
            "fullData": self.full_data
        }


# RAM based storage
exams_db = []
