from typing import Optional
import logging
from abc import ABC, abstractmethod
from pathlib import Path
from core.program_codes import LogLevel as l


class BaseLoggingEntity(ABC):
    def __init__(self) -> None:
        log_dir = Path('logs')
        log_file_path = log_dir / 'program_log.log'
        log_dir.mkdir(parents=True, exist_ok=True)

        logging.basicConfig(
            filename=log_file_path,
            level=logging.INFO,
            format=f'[ %(asctime)s - {self.get_current_entity()} - %(message)s ]',
            datefmt='%Y-%m-%d %H:%M:%S',
            encoding='utf-8'
        )

    @abstractmethod
    def get_current_entity(self):
        pass

    @staticmethod
    async def create_log_line(
            description: str,
            log_level: str,
            comment: Optional[str] = 'None',
            web_code: Optional[str] = 'not required'
    ):

        message = f'{description} - {log_level.upper()} - {comment} - web_code: {web_code}'

        match log_level.upper():
            case l.INFO:
                logging.info(message)
            case l.WARNING:
                logging.warning(message)
            case l.ERROR:
                logging.error(message)
            case l.CRITICAL:
                logging.critical(message)
