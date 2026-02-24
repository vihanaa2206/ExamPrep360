class User:
    def __init__(
        self,
        user_id,
        name,
        email,
        password,
        role="user",
        designation=None,
        profession=None,
        student_type=None,
        institute_name=None
    ):
        self.id = user_id
        self.name = name
        self.email = email
        self.password = password
        self.role = role
        self.designation = designation
        self.profession = profession
        self.student_type = student_type
        self.institute_name = institute_name

    @staticmethod
    def from_mongo(doc):
        if not doc:
            return None

        return User(
            user_id=str(doc.get("_id")),
            name=doc.get("name"),
            email=doc.get("email"),
            password=doc.get("password"),
            role=doc.get("role", "user"),
            designation=doc.get("designation"),
            profession=doc.get("profession"),
            student_type=doc.get("student_type"),
            institute_name=doc.get("institute_name")
        )

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "role": self.role,
            "designation": self.designation,
            "profession": self.profession,
            "student_type": self.student_type,
            "institute_name": self.institute_name
        }
