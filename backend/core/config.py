# 'config.py' - класс настроек.
from dotenv import load_dotenv
from pydantic_settings import BaseSettings, SettingsConfigDict
import os


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file='.env')

    load_dotenv()

    API_TITLE: str = 'GeekChat API'
    API_VERSION: str = '1.0.0'

    FRONTEND_URL: str | None = os.getenv('FRONTEND_URL')
    DATABASE_URL: str | None = os.getenv('DATABASE_URL')

    JWT_SECRET: str | None = os.getenv('JWT_SECRET')
    JWT_ALGORITHM: str | None = os.getenv('JWT_ALGORITHM')

    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7


settings = Settings()
