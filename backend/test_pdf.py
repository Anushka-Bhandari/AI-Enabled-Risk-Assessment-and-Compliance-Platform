from pprint import pprint

from app import create_app
from app.services.pdf_service import PDFService

app = create_app()

with app.app_context():

    result = PDFService(
        assessment_id=1
    ).generate()

    pprint(result)