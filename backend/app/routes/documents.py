from flask import Blueprint, request, jsonify

documents = Blueprint(
    "documents",
    __name__
)

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

    return jsonify({
        "files_received": len(files)
    }), 200