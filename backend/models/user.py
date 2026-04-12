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
        institute_name=None,
        is_blocked=False,
        status="active",
        phone=None,
        city=None,
        state=None,
        target_exam=None,
        registered_at=None,
    ):
        self.id             = user_id
        self.name           = name
        self.email          = email
        self.password       = password
        self.role           = role
        self.designation    = designation
        self.profession     = profession
        self.student_type   = student_type
        self.institute_name = institute_name
        self.is_blocked     = is_blocked
        self.status         = status
        self.phone          = phone
        self.city           = city
        self.state          = state
        self.target_exam    = target_exam
        self.registered_at  = registered_at

    @staticmethod
    def from_mongo(doc):
        if not doc:
            return None
        return User(
            user_id=        str(doc.get("_id")),
            name=           doc.get("name"),
            email=          doc.get("email"),
            password=       doc.get("password"),
            role=           doc.get("role", "user"),
            designation=    doc.get("designation"),
            profession=     doc.get("profession"),
            student_type=   doc.get("student_type"),
            institute_name= doc.get("institute_name"),
            is_blocked=     doc.get("is_blocked", False),
            status=         doc.get("status", "active"),
            phone=          doc.get("phone"),
            city=           doc.get("city"),
            state=          doc.get("state"),
            target_exam=    doc.get("target_exam"),
            registered_at=  str(doc.get("registered_at", "")),
        )

    def to_dict(self):
        return {
            "id":            self.id,
            "_id":           self.id,
            "name":          self.name,
            "email":         self.email,
            "role":          self.role,
            "designation":   self.designation,
            "profession":    self.profession,
            "student_type":  self.student_type,
            "institute_name": self.institute_name,
            "is_blocked":    self.is_blocked,
            "status":        self.status,
            "phone":         self.phone       or "",
            "city":          self.city        or "",
            "state":         self.state       or "",
            "target_exam":   self.target_exam or "",
            "registered_at": self.registered_at or "",
        }
