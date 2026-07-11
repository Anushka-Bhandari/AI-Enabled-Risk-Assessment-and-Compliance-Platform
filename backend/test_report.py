from pprint import pprint

from app import create_app
from app.services.report_service import ReportService

app = create_app()

with app.app_context():

    report_data = ReportService(
        assessment_id=1
    ).build_report_data()

    pprint(report_data)