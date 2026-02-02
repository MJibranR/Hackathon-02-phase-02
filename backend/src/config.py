from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str
    BETTER_AUTH_SECRET: str

    class Config:
        env_file = ".env"

settings = Settings()
