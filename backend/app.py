import os
from dotenv import load_dotenv
load_dotenv()

import logging
logging.getLogger("pymongo").setLevel(logging.WARNING)

from routes.reports_routes import reports_bp
from flask import Flask
from flask_cors import CORS
from routes.exam_routes import exam_bp, coaching_bp
from routes.auth_routes import auth_bp
from routes.user_routes import user_bp
from routes.ask_routes import ask_bp
from routes.query_routes import query_bp
from routes.colleges import colleges_bp
from routes.notifications import notifications_bp
from routes.contact_routes import contact_bp
from extensions import mail, mongo
from routes.mock_routes import mock_bp
from routes.pyq_routes import pyq_bp
from routes.payment_routes import payment_bp
from routes.feedback import feedback_bp
from routes.ai_chat_routes import ai_chat_bp

app = Flask(__name__)
CORS(app)

# ---------------- MongoDB Config ---------------- #
app.config["MONGO_URI"] = os.environ.get("MONGO_URI")

# ---------------- Mail Config ---------------- #
app.config["MAIL_SERVER"]         = "smtp.gmail.com"
app.config["MAIL_PORT"]           = 587
app.config["MAIL_USE_TLS"]        = True
app.config["MAIL_USERNAME"]       = os.environ.get("MAIL_USERNAME")
app.config["MAIL_PASSWORD"]       = os.environ.get("MAIL_PASSWORD")
app.config["MAIL_DEFAULT_SENDER"] = os.environ.get("MAIL_USERNAME")

mail.init_app(app)
mongo.init_app(app)

# ---------------- Register Blueprints ---------------- #
app.register_blueprint(exam_bp,          url_prefix="/api")
app.register_blueprint(coaching_bp,      url_prefix="/api")
app.register_blueprint(auth_bp)
app.register_blueprint(user_bp,          url_prefix="/api")
app.register_blueprint(ask_bp)
app.register_blueprint(query_bp,         url_prefix="/api")
app.register_blueprint(colleges_bp,      url_prefix="/api")
app.register_blueprint(notifications_bp, url_prefix="/api")
app.register_blueprint(contact_bp,       url_prefix="/api")
app.register_blueprint(mock_bp,          url_prefix="/api")
app.register_blueprint(pyq_bp,           url_prefix="/api")
app.register_blueprint(reports_bp,       url_prefix="/api")
app.register_blueprint(payment_bp,       url_prefix="/api")
app.register_blueprint(feedback_bp,      url_prefix="/api")
app.register_blueprint(ai_chat_bp)

# ---------------- RUN SERVER ---------------- #
if __name__ == "__main__":
    app.run(debug=True)
