import os
from dotenv import load_dotenv
from urllib.parse import quote_plus

load_dotenv()

def get_env(key, default=None, required=False):
    value = os.getenv(key, default)
    if required and not value:
        raise Exception(f"Missing environment variable: {key}")
    return value


class Config:

    # ---------------- DB ----------------
    DB_USER = get_env("DB_USER")
    DB_PASSWORD = get_env("DB_PASSWORD")
    DB_HOST = get_env("DB_HOST", "localhost")
    DB_PORT = get_env("DB_PORT", "3306")
    DB_NAME = get_env("DB_NAME")

    SQLALCHEMY_DATABASE_URI = (
        f"mysql+pymysql://{DB_USER}:"
        f"{quote_plus(DB_PASSWORD)}@"
        f"{DB_HOST}:{DB_PORT}/"
        f"{DB_NAME}"
    )

    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # ---------------- SECURITY ----------------
    SECRET_KEY = get_env("SECRET_KEY", "dev-secret")
    JWT_SECRET_KEY = get_env("JWT_SECRET_KEY", "jwt-secret")

    # ---------------- EMAIL ----------------
    MAIL_SERVER = "smtp.gmail.com"
    MAIL_PORT = 587
    MAIL_USE_TLS = True
    MAIL_USE_SSL = False

    MAIL_USERNAME = os.getenv("MAIL_USERNAME")
    MAIL_PASSWORD = os.getenv("MAIL_PASSWORD")
    MAIL_DEFAULT_SENDER = MAIL_USERNAME

    # optional debugging
    MAIL_DEBUG = False