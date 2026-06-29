from flask import Blueprint, request, jsonify
import os
from datetime import datetime
from app.database import db
from app.models import Document, User
from app.services.document_extractor import extract_text
from sqlalchemy.exc import IntegrityError
from flask_jwt_extended import jwt_required, get_jwt_identity

documents = Blueprint(
    "documents",
    __name__
)

UPLOAD_FOLDER = "uploads"

ALLOWED_EXTENSIONS = {
    "pdf",
    "docx"
}

def cleanup_uploaded_files(saved_filepaths):
    for filepath in saved_filepaths:
        if os.path.exists(filepath):
            os.remove(filepath)


def allowed_file(filename):
    if "." not in filename:
        return False
    extension = filename.rsplit(".", 1)[1].lower()
    return extension in ALLOWED_EXTENSIONS

@documents.route(
    "/documents/upload",
    methods=["POST"]
)
@jwt_required()

def upload_documents():

    files = request.files.getlist(
        "documents"
    )

    if not files:
        return jsonify({
            "error": "No files uploaded"
        }), 400

    current_user = db.session.get(User, get_jwt_identity())

    if not current_user:
        return jsonify({
            "error": "User not found."
        }), 404

    university_id = current_user.university_id

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
                university_id=university_id,
                original_filename=file.filename,
                stored_filename=stored_filename,
                source="uploaded",
                extracted_text=extracted_text
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

        cleanup_uploaded_files(saved_filepaths)

        return jsonify({
            "error": "Unable to extract text from one or more files.",
            "failed_files": failed_files
        }), 400
          
    try:
        db.session.commit()
    except IntegrityError as e:
        db.session.rollback()
        print(e)
        cleanup_uploaded_files(saved_filepaths)
        
        return jsonify({
            "error": "Database integrity error."
        }), 400

    except Exception as e:
        db.session.rollback()
        print(e)
        cleanup_uploaded_files(saved_filepaths)

        return jsonify({
            "error": "Unable to save uploaded documents."
        }), 500
    
    return jsonify({
        "message": "Files uploaded successfully",
        "files_received": len(files)
    }), 200


