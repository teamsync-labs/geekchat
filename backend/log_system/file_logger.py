import logging
from pathlib import Path
from typing import Optional
from log_system.base_logging import BaseLoggingEntity
from backend.core.program_codes import UserState, RoomState, WebsocketState


class FileLogger(BaseLoggingEntity):


    def __init__(self) -> None:
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

        description = 'UNKNOWN ERROR'

        if hasattr(UserState, internal_error_code):
            description = getattr(UserState, internal_error_code)
        elif hasattr(RoomState, internal_error_code):
            description = getattr(RoomState, internal_error_code)
        elif hasattr(WebsocketState, internal_error_code):
            description = getattr(WebsocketState, internal_error_code)

        message = (f'{internal_error_code} -'
                   f' {description} -'
                   f' {comment} -'
                   f' {web_code}')

        match level.upper():
            case 'DEBUG':
                logging.debug(message)
            case 'WARNING':
                logging.warning(message)
            case 'ERROR':
                logging.error(message)
            case 'CRITICAL':
                logging.critical(message)
            case _:
                (logging.info(message))