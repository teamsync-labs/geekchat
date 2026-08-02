# 'config.py' - класс настроек.
from dotenv import load_dotenv
from pydantic_settings import BaseSettings, SettingsConfigDict
import os


load_dotenv()


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file='.env')

    API_TITLE: str = 'GeekChat API'
    API_VERSION: str = '1.0.0'

    FRONTEND_URL: str | None = os.getenv('FRONTEND_URL')

    DATABASE_URL: str | None = os.getenv('DATABASE_URL')

    SECRET_KEY: str | None = os.getenv('SECRET_KEY')
    ALGORITHM: str = 'RS256'
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7


settings = Settings()
