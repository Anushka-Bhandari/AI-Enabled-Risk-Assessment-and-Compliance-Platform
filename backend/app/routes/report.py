from flask import Blueprint, jsonify, send_file

from app.services.pdf_service import PDFService

from datetime import datetime

import os
import glob

report_bp = Blueprint(
    "report",
    __name__,
    url_prefix="/reports"
)

@report_bp.route("/generate/<int:assessment_id>", methods=["POST"])
def generate_report(assessment_id):

    try:

        result = PDFService(
            assessment_id
        ).generate()

        return jsonify(result), 201

    except Exception as e:

        return jsonify({
            "success": False,
            "message": str(e)
        }), 500
    

@report_bp.route("/download/<int:assessment_id>", methods=["GET"])
def download_report(assessment_id):

    try:

        reports_directory = os.path.join(
            os.path.dirname(__file__),
            "..",
            "reports",
            "generated",
        )

        pattern = os.path.join(
            reports_directory,
            f"assessment_{assessment_id}_*.pdf",
        )

        report_files = glob.glob(pattern)

        if not report_files:
            return jsonify({
                "success": False,
                "message": "Report not found."
            }), 404

        latest_report = max(
            report_files,
            key=os.path.getmtime
        )

        return send_file(
            latest_report,
            as_attachment=True,
            download_name=os.path.basename(latest_report),
            mimetype="application/pdf"
        )

    except Exception as e:

        return jsonify({
            "success": False,
            "message": str(e)
        }), 500
    

@report_bp.route("/history", methods=["GET"])
def report_history():

    try:

        reports_directory = os.path.join(
            os.path.dirname(__file__),
            "..",
            "reports",
            "generated",
        )

        report_files = sorted(
            glob.glob(os.path.join(reports_directory, "*.pdf")),
            key=os.path.getmtime,
            reverse=True,
        )

        reports = []

        for report in report_files:

            filename = os.path.basename(report)

            reports.append({
                "file_name": filename,
                "assessment_id": (
                    filename.split("_")[1]
                    if filename.startswith("assessment_")
                    else None
                ),
                "generated_at": datetime.fromtimestamp(
                    os.path.getmtime(report)
                ).strftime("%d-%m-%Y %H:%M:%S"),
                "size_bytes": os.path.getsize(report),
            })

        return jsonify({
            "success": True,
            "count": len(reports),
            "reports": reports,
        }), 200

    except Exception as e:

        return jsonify({
            "success": False,
            "message": str(e),
        }), 500