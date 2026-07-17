from datetime import datetime
from pydantic import BaseModel, ConfigDict, computed_field
from uuid import UUID
from core.config import settings as s
from db.room_status import RoomStatus


class RoomCreate(BaseModel):
    ttl: int     # validate ?? min max


class BaseRoomResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    room_id: UUID


class RoomJoinLinkResponse(BaseRoomResponse):
    @computed_field(return_type=str)
    @property
    def join_url(self):
        return f'{s.FRONTEND_URL}/call/{self.room_id}'


class RoomPreviewResponse(BaseRoomResponse):
    status: RoomStatus
    created_at: datetime
