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

    # JWT_SECRET — обязательно в prod (GitHub Secret → compose .env).
    # Algorithm и TTL без GitHub vars: дефолты здесь, env только для локального override.
    JWT_SECRET: str | None = os.getenv('JWT_SECRET')
    JWT_ALGORITHM: str = os.getenv('JWT_ALGORITHM') or 'HS256'
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv('ACCESS_TOKEN_EXPIRE_MINUTES') or '30')


settings = Settings()
