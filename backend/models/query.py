from datetime import datetime, timedelta

class Query:
    def __init__(self, id, user_name, user_email, question):
        self.id = id
        self.user_name = user_name
        self.user_email = user_email
        self.question = question
        self.answer = None
        self.created_at = datetime.now()
        self.status = "Pending"

    def update_status(self):
        if self.answer:
            self.status = "Answered"
        else:
            if datetime.now() - self.created_at > timedelta(hours=24):
                self.status = "Pending"
