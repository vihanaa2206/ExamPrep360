from flask import Blueprint, jsonify, request
import os
import cloudinary
import cloudinary.uploader
import cloudinary.api
from werkzeug.utils import secure_filename

pyq_bp = Blueprint("pyq_bp", __name__)

def init_cloudinary():
    cloudinary.config(
        cloud_name=os.environ.get("CLOUDINARY_CLOUD_NAME"),
        api_key=os.environ.get("CLOUDINARY_API_KEY"),
        api_secret=os.environ.get("CLOUDINARY_API_SECRET"),
    )

def folder_name(exam_name):
    return f"pyqs/{exam_name}"


@pyq_bp.route("/pyq/exams", methods=["GET"])
def get_pyq_exams():
    init_cloudinary()
    try:
        result = cloudinary.api.subfolders("pyqs")
        folders = [f["name"] for f in result.get("folders", [])]
        return jsonify(sorted(folders)), 200
    except Exception as e:
        print(f"[PYQ] Error: {e}")
        return jsonify([]), 200


@pyq_bp.route("/pyq/files/<exam_name>", methods=["GET"])
def get_pyq_files(exam_name):
    init_cloudinary()
    try:
        result = cloudinary.api.resources(
            type="upload",
            prefix=f"pyqs/{exam_name}/",
            resource_type="raw",
            max_results=500
        )
        files = []
        for r in result.get("resources", []):
            raw_name = r["public_id"].split("/")[-1]

            # Skip internal init file
            if raw_name in [".folder_init", "folder_init", ".folder-init"]:
                continue

            display_name = raw_name + ".pdf"

            # View URL — inline viewing via Google Docs viewer (no CORS issue)
            raw_url = r["secure_url"]

            # Download URL — use fl_attachment to force download from Cloudinary
            download_url = raw_url.replace(
                "/raw/upload/",
                "/raw/upload/fl_attachment/"
            )

            files.append({
                "name": display_name,
                "path": raw_url,           # used for View (open in browser/Google Docs)
                "download_url": download_url,  # used for Download button
                "size_kb": round(r.get("bytes", 0) / 1024),
                "public_id": r["public_id"],
            })
        return jsonify(sorted(files, key=lambda x: x["name"])), 200
    except Exception as e:
        print(f"[PYQ] Error: {e}")
        return jsonify([]), 200


@pyq_bp.route("/pyq/upload", methods=["POST"])
def upload_pyq():
    init_cloudinary()
    exam_name = request.form.get("exam_name", "").strip()
    if not exam_name:
        return jsonify({"error": "exam_name required"}), 400

    files = request.files.getlist("files")
    if not files:
        return jsonify({"error": "No files uploaded"}), 400

    uploaded = []
    for f in files:
        if f.filename.lower().endswith(".pdf"):
            filename = secure_filename(f.filename).replace(".pdf", "").replace(".PDF", "")
            result = cloudinary.uploader.upload(
                f,
                resource_type="raw",
                folder=f"pyqs/{exam_name}",
                public_id=filename,
                use_filename=True,
                unique_filename=False,
            )
            uploaded.append(f.filename)

    return jsonify({"message": f"Uploaded {len(uploaded)} files", "files": uploaded}), 200


@pyq_bp.route("/pyq/delete", methods=["DELETE"])
def delete_pyq_file():
    init_cloudinary()
    data = request.get_json()
    public_id = data.get("public_id", "").strip()
    if not public_id:
        return jsonify({"error": "public_id required"}), 400
    cloudinary.uploader.destroy(public_id, resource_type="raw")
    return jsonify({"message": "File deleted"}), 200


@pyq_bp.route("/pyq/create-folder", methods=["POST"])
def create_pyq_folder():
    init_cloudinary()
    data = request.get_json()
    exam_name = data.get("exam_name", "").strip()
    if not exam_name:
        return jsonify({"error": "exam_name required"}), 400
    cloudinary.uploader.upload(
        "data:text/plain;base64,Lg==",
        resource_type="raw",
        folder=f"pyqs/{exam_name}",
        public_id=".folder_init",
    )
    return jsonify({"message": f"Folder '{exam_name}' created"}), 201


@pyq_bp.route("/pyq/delete-folder", methods=["DELETE"])
def delete_pyq_folder():
    init_cloudinary()
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


@pyq_bp.route("/pyq/rename", methods=["PUT"])
def rename_pyq_file():
    init_cloudinary()
    data = request.get_json()
    exam_name = data.get("exam_name", "").strip()
    old_name  = data.get("old_name", "").strip().replace(".pdf", "")
    new_name  = data.get("new_name", "").strip().replace(".pdf", "")
    if not exam_name or not old_name or not new_name:
        return jsonify({"error": "exam_name, old_name, new_name required"}), 400
    try:
        cloudinary.uploader.rename(
            f"pyqs/{exam_name}/{old_name}",
            f"pyqs/{exam_name}/{new_name}",
            resource_type="raw"
        )
        return jsonify({"message": "File renamed"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
