from typing import Optional
from abc import ABC, abstractmethod


class BaseLoggingEntity(ABC):


    @abstractmethod
    def create_log_line(
            self,
            internal_error_code: str,
            comment: str,
            web_code: Optional[str] = 'not required') -> None:
        pass