from datetime import datetime, timezone, timedelta
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi.encoders import jsonable_encoder
from models.room import Room
from schemas.room import RoomCreate
from db.room_status import RoomStatus
from core.error_codes import CODE_9002, CODE_9003


class RoomService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def create(self, data: RoomCreate, creator_id: int):
        room = Room(
            creator_id=creator_id,
            expires_at=datetime.now(timezone.utc) + timedelta(minutes=data.ttl)
        )

        self.db.add(room)
        await self.db.commit()
        await self.db.refresh(room)

        return room

    async def get_room_by_id(self, room_id):
        stmt = select(Room).where(Room.room_id == room_id)
        result = await self.db.execute(stmt)

        return result.scalars().first()

    @staticmethod
    async def check_room_joinable(room: Room):
        if room.status == RoomStatus.ENDED:
            return jsonable_encoder({'code': CODE_9002})

        elif datetime.now(timezone.utc) > room.expires_at:
            return jsonable_encoder( {
                'code': CODE_9003,
                'expired_at': room.expires_at
            } )

        else:
            return True

    async def get_creator_by_room_id(self, room_id):
        stmt = select(Room.creator_id).where(Room.room_id == room_id)
        result = await self.db.execute(stmt)

        return result.scalar_one()