from typing import Optional
import logging
from abc import ABC, abstractmethod
from pathlib import Path
from core.program_codes import LogLevel as l


class BaseLoggingEntity(ABC):
    def __init__(self):            # здесь 2 пробела не нужны
        log_dir = Path('logs')
        log_file_path = log_dir / 'program_log.log'
        log_dir.mkdir(parents=True, exist_ok=True)

        logging.basicConfig(
            filename=log_file_path,
            level='INFO',
            format=f'[ %(asctime)s - {self.get_current_entity()} - %(levelname)s - %(message)s ]',
            datefmt='%Y-%m-%d %H:%M:%S',
            encoding='utf-8'
        )
    # Переопределяем в классах - наследниках, по бизнес-сущностям (SYSTEM_LOGGER, USER_LOGGER и т.д.)
    @abstractmethod
    def get_current_entity(self):
        pass
    # Получается, два обязательных параметра CODE, Level (передаем явно, для самодокументации)
    @staticmethod
    async def create_log_line(internal_code, log_level: str, description: Optional[str] = 'None',
                              web_code: Optional[str] = 'not required'):    # возвращать не нужно явно (-> None), это не по питоновски )

        message = f'{internal_code} - {description} - web_code: {web_code}'
        # Коды log level из специального класса.
        match log_level.upper():
            case l.INFO:
                logging.info(message)
            case l.WARNING:
                logging.warning(message)
            case l.ERROR:
                logging.error(message)
            case l.CRITICAL:
                logging.critical(message)
