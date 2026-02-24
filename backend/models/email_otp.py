class EmailOTP:
    def __init__(self, email, otp, expiry):
        self.email = email
        self.otp = otp
        self.expiry = expiry

    def to_dict(self):
        return {
            "email": self.email,
            "otp": self.otp,
            "expiry": self.expiry
        }
