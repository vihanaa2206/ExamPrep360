from flask import Blueprint, jsonify, request
import os, shutil
from werkzeug.utils import secure_filename

pyq_bp = Blueprint("pyq_bp", __name__)

PDFS_DIR = r"D:\ExamPrep360\frontend\public\pdfs"


def get_exam_path(exam_name):
    return os.path.join(PDFS_DIR, exam_name)


@pyq_bp.route("/pyq/exams", methods=["GET"])
def get_pyq_exams():
    try:
        if not os.path.exists(PDFS_DIR):
            return jsonify([]), 200
        folders = [f for f in os.listdir(PDFS_DIR)
                   if os.path.isdir(os.path.join(PDFS_DIR, f))]
        return jsonify(sorted(folders)), 200
    except Exception as e:
        print(f"[PYQ] Error: {e}")
        return jsonify([]), 200


@pyq_bp.route("/pyq/files/<exam_name>", methods=["GET"])
def get_pyq_files(exam_name):
    try:
        exam_path = get_exam_path(exam_name)
        if not os.path.exists(exam_path):
            return jsonify([]), 200
        files = [f for f in os.listdir(exam_path) if f.lower().endswith(".pdf")]
        result = []
        for f in sorted(files):
            fp = os.path.join(exam_path, f)
            result.append({
                "name":     f,
                "path":     f"/pdfs/{exam_name}/{f}",
                "size_kb":  round(os.path.getsize(fp) / 1024),
            })
        return jsonify(result), 200
    except Exception as e:
        print(f"[PYQ] Error: {e}")
        return jsonify([]), 200


# ── ADMIN: Upload PDFs ───────────────────────────────────────────────────
@pyq_bp.route("/pyq/upload", methods=["POST"])
def upload_pyq():
    exam_name = request.form.get("exam_name", "").strip()
    if not exam_name:
        return jsonify({"error": "exam_name required"}), 400

    exam_path = get_exam_path(exam_name)
    os.makedirs(exam_path, exist_ok=True)

    files = request.files.getlist("files")
    if not files:
        return jsonify({"error": "No files uploaded"}), 400

    uploaded = []
    for f in files:
        if f.filename.lower().endswith(".pdf"):
            filename = secure_filename(f.filename)
            f.save(os.path.join(exam_path, filename))
            uploaded.append(filename)

    return jsonify({"message": f"Uploaded {len(uploaded)} files", "files": uploaded}), 200


# ── ADMIN: Delete PDF file ───────────────────────────────────────────────
@pyq_bp.route("/pyq/delete", methods=["DELETE"])
def delete_pyq_file():
    data      = request.get_json()
    exam_name = data.get("exam_name", "").strip()
    filename  = data.get("filename", "").strip()

    if not exam_name or not filename:
        return jsonify({"error": "exam_name and filename required"}), 400

    file_path = os.path.join(get_exam_path(exam_name), filename)
    if not os.path.exists(file_path):
        return jsonify({"error": "File not found"}), 404

    os.remove(file_path)
    return jsonify({"message": "File deleted"}), 200


# ── ADMIN: Create new exam folder ────────────────────────────────────────
@pyq_bp.route("/pyq/create-folder", methods=["POST"])
def create_pyq_folder():
    data      = request.get_json()
    exam_name = data.get("exam_name", "").strip()
    if not exam_name:
        return jsonify({"error": "exam_name required"}), 400

    exam_path = get_exam_path(exam_name)
    if os.path.exists(exam_path):
        return jsonify({"error": "Folder already exists"}), 400

    os.makedirs(exam_path)
    return jsonify({"message": f"Folder '{exam_name}' created"}), 201


# ── ADMIN: Delete exam folder ────────────────────────────────────────────
@pyq_bp.route("/pyq/delete-folder", methods=["DELETE"])
def delete_pyq_folder():
    data      = request.get_json()
    exam_name = data.get("exam_name", "").strip()
    if not exam_name:
        return jsonify({"error": "exam_name required"}), 400

    exam_path = get_exam_path(exam_name)
    if not os.path.exists(exam_path):
        return jsonify({"error": "Folder not found"}), 404

    shutil.rmtree(exam_path)
    return jsonify({"message": f"Folder '{exam_name}' deleted"}), 200
#----
 
@pyq_bp.route("/pyq/rename", methods=["PUT"])
def rename_pyq_file():
    data     = request.get_json()
    exam_name = data.get("exam_name", "").strip()
    old_name  = data.get("old_name", "").strip()
    new_name  = data.get("new_name", "").strip()
 
    if not exam_name or not old_name or not new_name:
        return jsonify({"error": "exam_name, old_name and new_name required"}), 400
 
    exam_path = get_exam_path(exam_name)
    old_path  = os.path.join(exam_path, old_name)
    new_path  = os.path.join(exam_path, new_name)
 
    if not os.path.exists(old_path):
        return jsonify({"error": "File not found"}), 404
 
    if os.path.exists(new_path):
        return jsonify({"error": "A file with this name already exists"}), 400
 
    os.rename(old_path, new_path)
    return jsonify({"message": f"Renamed to {new_name}"}), 200
