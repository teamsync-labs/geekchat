from datetime import datetime
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
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
    async def get_room(db: AsyncSession, room_id) -> Room | None:
        stmt = select(Room).where(Room.room_id == room_id)
        result = await db.execute(stmt)

        return result.scalars().first()

    @staticmethod
    def is_room_joinable(room: Room) -> dict | bool:
        if room.status == RoomStatus.ENDED:
            return {
                'joinable': False,
                'code': 'ROOM_INACTIVE'   # maybe status's enum class ???
            }

        elif room.expires_at < datetime.now():
            return {
                'joinable': False,
                'code': 'ROOM_EXPIRED',
                'expires_at': room.expires_at
            }

        else:
            return True