import os

import pdfplumber
from docx import Document

def extract_pdf(filepath):
    text = ""
    with pdfplumber.open(filepath) as pdf:
        for page in pdf.pages:
            page_text = page.extract_text()
            if page_text:
                text += page_text + "\n"
    return text.strip()

def extract_docx(filepath):
    document = Document(filepath)
    text = ""
    for paragraph in document.paragraphs:
        text += paragraph.text + "\n"
    return text.strip()

def extract_text(filepath):
    extension = os.path.splitext(filepath)[1].lower()
    if extension == ".pdf":
        return extract_pdf(filepath)
    if extension ==  ".docx":
        return extract_docx(filepath)
    raise ValueError("Unsupported document type.")