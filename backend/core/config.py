# 'config.py' - класс настроек.
from dotenv import load_dotenv
from pydantic_settings import BaseSettings, SettingsConfigDict
import os


load_dotenv()


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file='.env')

    API_TITLE: str = 'GeekChat API'
    API_VERSION: str = '1.0.0'

    BASE_URL: str = os.getenv('BASE_URL')

    DATABASE_URL: str = os.getenv('DATABASE_URL')

    JWT_SECRET: str | None = os.getenv('JWT_SECRET')
    JWT_ALGORITHM: str | None = os.getenv('JWT_ALGORITHM')
    ACCESS_TOKEN_EXPIRE_MINUTES: str | None = os.getenv('ACCESS_TOKEN_EXPIRE_MINUTES')


settings = Settings()
