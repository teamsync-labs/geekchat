from datetime import datetime
from pydantic import BaseModel, ConfigDict, computed_field
from uuid import UUID
from core.config import settings
from db.room_status import RoomStatus


class RoomCreate(BaseModel): pass


class RoomResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    room_id: UUID
    creator_id: int
    status: RoomStatus
    created_at: datetime
    expires_at: datetime

    @computed_field(return_type=str)
    @property
    def join_url(self):
        return f'{settings.BASE_URL}/call/{self.room_id}'