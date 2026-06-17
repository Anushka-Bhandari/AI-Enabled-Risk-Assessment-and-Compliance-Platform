import os
from dotenv import load_dotenv
from urllib.parse import quote_plus

load_dotenv()

class Config:
    DB_USER = os.getenv("DB_USER", "")
    DB_PASSWORD = os.getenv("DB_PASSWORD", "")
    DB_HOST = os.getenv("DB_HOST", "localhost")
    DB_NAME = os.getenv("DB_NAME", "")

    SECRET_KEY = os.getenv("SECRET_KEY", "dev-secret")
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "jwt-secret")

    SQLALCHEMY_DATABASE_URI = (
        f"mysql+pymysql://{DB_USER}:"
        f"{quote_plus(DB_PASSWORD)}@"
        f"{DB_HOST}/"
        f"{DB_NAME}"
    )

    SQLALCHEMY_TRACK_MODIFICATIONS = False