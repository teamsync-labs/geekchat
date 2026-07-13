from dotenv import load_dotenv
from pydantic_settings import BaseSettings
import os


load_dotenv()


class Settings(BaseSettings):
    API_TITLE: str = 'GeekChat API'
    API_VERSION: str = '1.0.0'

    BASE_URL: str = os.getenv('BASE_URL')

    DATABASE_URL: str = os.getenv('DATABASE_URL')

    class Config:
        env_file = '.env'


settings = Settings()
