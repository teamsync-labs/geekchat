from datetime import datetime, timezone
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi.encoders import jsonable_encoder
from models.room import Room
from crud.room import create
from schemas.room import RoomCreate
from db.room_status import RoomStatus


class RoomService:
    DEFAULT_DURATION_MINUTES = 30  # можно где-нибудь менять извне

    @staticmethod
    async def create(db: AsyncSession, data: RoomCreate, creator_id: int) -> Room:
        room = await create(db, data, creator_id=creator_id,
                            duration=RoomService.DEFAULT_DURATION_MINUTES)

        return room

    @staticmethod
    async def is_room_joinable(room: Room) -> dict | bool:
        if room.status == RoomStatus.ENDED:
            return jsonable_encoder( {'code': 'ROOM_INACTIVE'} )   # maybe status's enum class ???

        elif datetime.now(timezone.utc) > room.expires_at:
            return jsonable_encoder( {
                'code': 'ROOM_TIME_EXPIRED',
                'expires_at': room.expires_at
            } )

        else:
            return True