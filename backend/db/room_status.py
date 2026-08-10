# 'room_status.py' - статусы комнаты.
from enum import Enum


class RoomStatus(Enum):
    ACTIVE = 'active'
    ENDED = 'ended'
