import logging
logging.getLogger("pymongo").setLevel(logging.WARNING)

from flask import Flask
from flask_cors import CORS
from routes.exam_routes import exam_bp
from routes.auth_routes import auth_bp
from routes.user_routes import user_bp
from routes.ask_routes import ask_bp
from routes.query_routes import query_bp

from extensions import mail, mongo

app = Flask(__name__)
CORS(app)

# MongoDB config
app.config["MONGO_URI"] = "mongodb://127.0.0.1:27017/ExamPrep360"

# Mail config
app.config["MAIL_SERVER"] = "smtp.gmail.com"
app.config["MAIL_PORT"] = 587
app.config["MAIL_USE_TLS"] = True
app.config["MAIL_USERNAME"] = "bhavnapandey173@gmail.com"
app.config["MAIL_PASSWORD"] = "nxvdmwsnammsxzsy"
app.config["MAIL_DEFAULT_SENDER"] = "bhavnapandey173@gmail.com"

mail.init_app(app)
mongo.init_app(app)

# 🔥 IMPORTANT FIX
app.register_blueprint(exam_bp)
app.register_blueprint(auth_bp)
app.register_blueprint(user_bp, url_prefix="/api")   # ✅ FIXED
app.register_blueprint(ask_bp, url_prefix="/api")
app.register_blueprint(query_bp)

if __name__ == "__main__":
    app.run(debug=True)
