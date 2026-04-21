from flask import Blueprint, jsonify, request
import os
import cloudinary
import cloudinary.uploader
import cloudinary.api
from werkzeug.utils import secure_filename

pyq_bp = Blueprint("pyq_bp", __name__)

cloudinary.config(
    cloud_name=os.environ.get("CLOUDINARY_CLOUD_NAME"),
    api_key=os.environ.get("CLOUDINARY_API_KEY"),
    api_secret=os.environ.get("CLOUDINARY_API_SECRET"),
)

CATEGORY_MAP = {
    "COMEDK UGET":"Engineering","Jee Advanced":"Engineering","Jee Main":"Engineering",
    "Jee Main With Solutions":"Engineering","KCET":"Engineering","MHT CET":"Engineering",
    "SRMJEEE":"Engineering","VITEEE":"Engineering","WBJEE":"Engineering",
    "NEET UG":"Medical","NEET PG":"Medical","JIPMER":"Medical","AFMC":"Medical",
    "GATE CS":"Computer Science","NIMCET":"Computer Science","CUET PG":"Computer Science",
    "IIT JAM":"Computer Science","TANCET":"Computer Science",
    "CLAT":"Law","AILET":"Law","DU LLB":"Law","AP LAWCET":"Law",
    "CAT":"Management","CMAT":"Management","MAT":"Management","NMAT":"Management","XAT":"Management",
    "IBPS PO":"Government","RRB NTPC":"Government","SSC CGL":"Government","UPSC CSE":"Government",
}

def folder_name(exam_name):
    return f"pyqs/{exam_name}"


@pyq_bp.route("/pyq/exams", methods=["GET"])
def get_pyq_exams():
    try:
        result = cloudinary.api.subfolders("pyqs")
        folders = [f["name"] for f in result.get("folders", [])]
        return jsonify(sorted(folders)), 200
    except Exception as e:
        print(f"[PYQ] Error: {e}")
        return jsonify([]), 200


@pyq_bp.route("/pyq/files/<exam_name>", methods=["GET"])
def get_pyq_files(exam_name):
    try:
        result = cloudinary.api.resources(
            type="upload",
            prefix=f"pyqs/{exam_name}/",
            resource_type="raw",
            max_results=500
        )
        files = []
        for r in result.get("resources", []):
            name = r["public_id"].split("/")[-1] + ".pdf"
            files.append({
                "name": name,
                "path": r["secure_url"],
                "size_kb": round(r.get("bytes", 0) / 1024),
                "public_id": r["public_id"],
            })
        return jsonify(sorted(files, key=lambda x: x["name"])), 200
    except Exception as e:
        print(f"[PYQ] Error: {e}")
        return jsonify([]), 200


@pyq_bp.route("/pyq/upload", methods=["POST"])
def upload_pyq():
    exam_name = request.form.get("exam_name", "").strip()
    if not exam_name:
        return jsonify({"error": "exam_name required"}), 400

    files = request.files.getlist("files")
    if not files:
        return jsonify({"error": "No files uploaded"}), 400

    uploaded = []
    for f in files:
        if f.filename.lower().endswith(".pdf"):
            filename = secure_filename(f.filename).replace(".pdf", "")
            result = cloudinary.uploader.upload(
                f,
                resource_type="raw",
                folder=f"pyqs/{exam_name}",
                public_id=filename,
            )
            uploaded.append(f.filename)

    return jsonify({"message": f"Uploaded {len(uploaded)} files", "files": uploaded}), 200


@pyq_bp.route("/pyq/delete", methods=["DELETE"])
def delete_pyq_file():
    data = request.get_json()
    public_id = data.get("public_id", "").strip()
    if not public_id:
        return jsonify({"error": "public_id required"}), 400
    cloudinary.uploader.destroy(public_id, resource_type="raw")
    return jsonify({"message": "File deleted"}), 200


@pyq_bp.route("/pyq/create-folder", methods=["POST"])
def create_pyq_folder():
    data = request.get_json()
    exam_name = data.get("exam_name", "").strip()
    if not exam_name:
        return jsonify({"error": "exam_name required"}), 400
    # Cloudinary mein folder auto-create hota hai upload pe
    # Placeholder upload karke folder banate hain
    cloudinary.uploader.upload(
        "data:text/plain;base64,Lg==",
        resource_type="raw",
        folder=f"pyqs/{exam_name}",
        public_id=".folder_init",
    )
    return jsonify({"message": f"Folder '{exam_name}' created"}), 201


@pyq_bp.route("/pyq/delete-folder", methods=["DELETE"])
def delete_pyq_folder():
    data = request.get_json()
    exam_name = data.get("exam_name", "").strip()
    if not exam_name:
        return jsonify({"error": "exam_name required"}), 400
    try:
        cloudinary.api.delete_resources_by_prefix(f"pyqs/{exam_name}/", resource_type="raw")
        cloudinary.api.delete_folder(f"pyqs/{exam_name}")
    except Exception as e:
        print(f"[PYQ] Delete folder error: {e}")
    return jsonify({"message": f"Folder '{exam_name}' deleted"}), 200
