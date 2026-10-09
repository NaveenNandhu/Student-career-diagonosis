import os

class Settings:
    APP_NAME: str = os.getenv("APP_NAME", "Student Success & Career Intelligence")
    ENV: str = os.getenv("ENV", "development")
    DEBUG: bool = os.getenv("DEBUG", "True").lower() == "true"
    SECRET_KEY: str = os.getenv("SECRET_KEY", "cryptora26_secret_key_change_in_production")
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./sql_app.db")
    ALLOWED_ORIGINS: list = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000"
    ]
    DEMO_MODE: bool = True

settings = Settings()
