from flask import Blueprint, request, jsonify
import os
from datetime import datetime
from app.database import db
from app.models import Document
from app.services.document_extractor import extract_text

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
    assessment_id = 2   #temporary

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

    failed_files = []
    saved_filepaths = []

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
        saved_filepaths.append(filepath)

        try:
            extracted_text = extract_text(filepath)

            if not extracted_text.strip():
                raise ValueError("No readable text found in the document.")

            document = Document(
                university_id = university_id,
                assessment_id = assessment_id,
                original_filename = file.filename,
                stored_filename = stored_filename,
                document_type = None,
                source = "uploaded",
                extracted_text = extracted_text
            )
            db.session.add(document)

        except Exception as e:
            print(e)
            failed_files.append({
                "filename": file.filename,
                "reason": str(e)
            })
    
    if failed_files:
        db.session.rollback()

        for filepath in saved_filepaths:
            if os.path.exists(filepath):
                os.remove(filepath)

        return jsonify({
            "error": "Unable to extract text from one or more files.",
            "failed_files": failed_files
        }), 400
          
    db.session.commit()
    
    return jsonify({
        "message": "Files uploaded successfully",
        "files_received": len(files)
    }), 200


