class User:
    """
    Represents a user entity
    """

    def __init__(self, user_id, name, email, password, role="user"):
        self.id = user_id
        self.name = name
        self.email = email
        self.password = password   # 🔑 REQUIRED for login
        self.role = role

    def to_dict(self):
        #password intentionally NOT returned
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "role": self.role
        }


# In-memory user storage
users_db = []
