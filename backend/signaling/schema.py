# 'schema.py' - схема сообщения между участниками комнаты.
from typing import Literal, Any
from pydantic import BaseModel


class SignalMessage(BaseModel):
    type: Literal['offer', 'answer', 'ice-candidate']
    payload: dict[str, Any]
