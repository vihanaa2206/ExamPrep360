from flask import Flask
from flask_cors import CORS
from routes.exam_routes import exam_bp
from routes.auth_routes import auth_bp
from routes.user_routes import user_bp

app = Flask(__name__)
CORS(app)   

# Register blueprints
app.register_blueprint(exam_bp)
app.register_blueprint(auth_bp)
app.register_blueprint(user_bp)

@app.route("/")
def home():
    return "ExamPrep360 Backend Running"

if __name__ == "__main__":
    app.run(debug=True)
