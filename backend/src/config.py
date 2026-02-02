from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    DATABASE_URL: str
    BETTER_AUTH_SECRET: str

    class Config:
        env_file = ".env"
        env_file_encoding = 'utf-8'
        # ✅ CRITICAL FIX: Allow environment variables from system (Vercel)
        case_sensitive = False
        extra = "ignore"

settings = Settings()