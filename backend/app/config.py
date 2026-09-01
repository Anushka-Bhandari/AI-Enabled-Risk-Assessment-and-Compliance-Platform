import os
from dotenv import load_dotenv
from urllib.parse import quote_plus
from datetime import timedelta

load_dotenv()


def get_env(key, default=None, required=False):
    value = os.getenv(key, default)

    if required and not value:
        raise Exception(f"Missing environment variable: {key}")

    return value


class Config:

    # =====================================================
    # Database Configuration
    # =====================================================

    DB_USER = get_env("DB_USER")
    DB_PASSWORD = get_env("DB_PASSWORD")
    DB_HOST = get_env("DB_HOST")
    DB_PORT = get_env("DB_PORT", "3306")
    DB_NAME = get_env("DB_NAME")
    DATABASE_URL = os.getenv("DATABASE_URL")

    if DATABASE_URL:
        SQLALCHEMY_DATABASE_URI = DATABASE_URL
    else:
        SQLALCHEMY_DATABASE_URI = (
            f"mysql+pymysql://{DB_USER}:"
            f"{quote_plus(DB_PASSWORD)}@"
            f"{DB_HOST}:{DB_PORT}/"
            f"{DB_NAME}"
        )

    print("DB URI =", SQLALCHEMY_DATABASE_URI)


    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # =====================================================
    # Security
    # =====================================================

    SECRET_KEY = get_env("SECRET_KEY", "dev-secret")
    JWT_SECRET_KEY = get_env("JWT_SECRET_KEY", "jwt-secret")
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(days=1)

    # =====================================================
    # Email
    # =====================================================

    MAIL_SERVER = "smtp.gmail.com"
    MAIL_PORT = 587
    MAIL_USE_TLS = True
    MAIL_USE_SSL = False

    MAIL_USERNAME = get_env("MAIL_USERNAME")
    MAIL_PASSWORD = get_env("MAIL_PASSWORD")
    MAIL_DEFAULT_SENDER = MAIL_USERNAME

    MAIL_DEBUG = False

    # =====================================================
    # Report Configuration
    # =====================================================

    # backend/app
    BASE_DIR = os.path.abspath(
        os.path.dirname(__file__)
    )

    # app/reports
    REPORT_FOLDER = os.path.join(
        BASE_DIR,
        "reports"
    )

    # app/reports/templates
    REPORT_TEMPLATE_FOLDER = os.path.join(
        REPORT_FOLDER,
        "templates"
    )

    # app/reports/css
    REPORT_CSS_FOLDER = os.path.join(
        REPORT_FOLDER,
        "css"
    )

    # app/reports/images
    REPORT_IMAGE_FOLDER = os.path.join(
        REPORT_FOLDER,
        "images"
    )

    # app/reports/generated
    REPORT_OUTPUT_FOLDER = os.path.join(
        REPORT_FOLDER,
        "generated"
    )

    # app/reports/generated/charts
    REPORT_CHART_FOLDER = os.path.join(
        REPORT_OUTPUT_FOLDER,
        "charts"
    )

    @staticmethod
    def create_report_directories():
        """
        Create report directories automatically if they do not exist.
        Safe to call multiple times.
        """
        directories = [
            Config.REPORT_FOLDER,
            Config.REPORT_TEMPLATE_FOLDER,
            Config.REPORT_CSS_FOLDER,
            Config.REPORT_IMAGE_FOLDER,
            Config.REPORT_OUTPUT_FOLDER,
            Config.REPORT_CHART_FOLDER,
        ]

        for directory in directories:
            os.makedirs(directory, exist_ok=True)