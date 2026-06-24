from flask import Blueprint, request, jsonify
import os
from datetime import datetime
from app.database import db
from app.models import Document

documents = Blueprint(
    "documents",
    __name__
)

UPLOAD_FOLDER = "uploads"

ALLOWED_EXTENSIONS = {
    "pdf",
    "docx"
}

def allowed_file(filename):
    if "." not in filename:
        return False
    extension = filename.rsplit(".", 1)[1].lower()
    return extension in ALLOWED_EXTENSIONS

@documents.route(
    "/documents/upload",
    methods=["POST"]
)

def upload_documents():

    files = request.files.getlist(
        "documents"
    )

    if len(files) == 0:
        return jsonify({
            "error": "No files uploaded"
        }), 400

    university_id = 1   # TEMPORARY

    university_folder = os.path.join(
        UPLOAD_FOLDER,
        str(university_id)
    )

    uploaded_folder = os.path.join(
        university_folder,
        "uploaded"
    )

    generated_folder = os.path.join(
        university_folder,
        "generated"
    )

    os.makedirs(
        uploaded_folder,
        exist_ok = True
    )

    os.makedirs(
        generated_folder,
        exist_ok = True
    )

    for file in files:
        if file.filename == "":
            return jsonify({
                "error": "Empty filename"
            }), 400

        if not allowed_file(file.filename):
            return jsonify({
                "error": f"Invalid file type: {file.filename}"
            }), 400

    for file in files:
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")

        stored_filename = (
            f"{timestamp}_{file.filename}"
        )

        filepath = os.path.join(
            uploaded_folder,
            stored_filename
        )

        file.save(filepath)

        document = Document(
            university_id = university_id,
            original_filename = file.filename,
            stored_filename = stored_filename,
            document_type = None,
            source = "uploaded"
        )

        db.session.add(document)

    db.session.commit()
    
    return jsonify({
        "message": "Files uploaded successfully",
        "files_received": len(files)
    }), 200


