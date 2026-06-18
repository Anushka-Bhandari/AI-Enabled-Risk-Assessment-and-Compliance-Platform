from flask import Blueprint, request, jsonify

documents = Blueprint(
    "documents",
    __name__
)

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

    for file in files:
        if file.filename == "":
            return jsonify({
                "error": "Empty filename"
            }), 400

        if not allowed_file(file.filename):
            return jsonify({
                "error": f"Invalid file type: {file.filename}"
            }), 400

    return jsonify({
        "message": "All files are valid",
        "files_received": len(files)
    }), 200


