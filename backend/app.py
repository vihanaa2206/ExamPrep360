import os
import re
from dotenv import load_dotenv
load_dotenv()
import logging
logging.getLogger("pymongo").setLevel(logging.WARNING)
from flask import Flask, jsonify
from flask_cors import CORS
from routes.reports_routes import reports_bp
from routes.exam_routes import exam_bp, coaching_bp
from routes.auth_routes import auth_bp
from routes.user_routes import user_bp
from routes.ask_routes import ask_bp
from routes.query_routes import query_bp
from routes.colleges import colleges_bp
from routes.notifications import notifications_bp
from routes.contact_routes import contact_bp
from routes.mock_routes import mock_bp
from routes.pyq_routes import pyq_bp
from routes.payment_routes import payment_bp
from routes.feedback import feedback_bp
from routes.ai_chat_routes import ai_chat_bp
from extensions import mongo

app = Flask(__name__)

CORS(app,
     origins=re.compile(r"https://.*\.vercel\.app"),
     supports_credentials=True,
     methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
     allow_headers=["Content-Type", "Authorization"])

# ---------------- MongoDB Config ---------------- #
app.config["MONGO_URI"] = os.environ.get("MONGO_URI")
mongo.init_app(app)

# ---------------- Register Blueprints ---------------- #
app.register_blueprint(exam_bp,          url_prefix="/api")
app.register_blueprint(coaching_bp,      url_prefix="/api")
app.register_blueprint(auth_bp,          url_prefix="/api")
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

# ---------------- Root Route ---------------- #
@app.route("/")
def root():
    return jsonify({"status": "ok", "message": "ExamPrep360 backend running"})

# ---------------- RUN SERVER ---------------- #
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=False)
