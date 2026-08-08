import logging
from pathlib import Path
from typing import Optional
from log_system.base_logging import BaseLoggingEntity


class FileLogger(BaseLoggingEntity):


    def __init__(self):
        log_dir = Path('logs')
        log_file_path = log_dir / 'program_log.log'
        log_dir.mkdir(parents=True, exist_ok=True)

        logging.basicConfig(
            filename=log_file_path,
            level=logging.INFO,
            format='[ %(asctime)s - LogEntity - %(levelname)s - %(message)s ]',
            datefmt='%Y-%m-%d %H:%M:%S',
            encoding='utf-8'
        )

    def create_log_line(
            self,
            internal_error_code: str,
            comment: str,
            level: str = 'INFO',
            web_code: Optional[str] = 'not required'
    ) -> None:

        message = (f'Код: {internal_error_code},'
                   f'Коммент: {comment},'
                   f'Веб-Код: {web_code}')

        level = level.upper()
        match level:
            case 'DEBUG':
                logging.debug(message)
            case 'INFO':
                logging.info(message)
            case 'WARNING':
                logging.warning(message)
            case 'ERROR':
                logging.error(message)
            case 'CRITICAL':
                logging.critical(message)
            case _:
                (logging.info(message))