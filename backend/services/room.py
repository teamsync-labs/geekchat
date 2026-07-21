from datetime import datetime, timezone, timedelta
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi.encoders import jsonable_encoder
from models.room import Room
from schemas.room import RoomCreate
from db.room_status import RoomStatus


class RoomService:
    MAX_CURRENT_ROOMS = 2

    def __init__(self, db: AsyncSession):
        self.db = db

    async def create(self, data: RoomCreate, creator_id: int) -> Room | None:
        now_time = datetime.now(timezone.utc)

        if await self._get_count_active_rooms(creator_id, now_time) < RoomService.MAX_CURRENT_ROOMS:
            room = Room(
                creator_id=creator_id,
                expires_at=now_time + timedelta(minutes=data.ttl)
            )

            self.db.add(room)
            await self.db.commit()
            await self.db.refresh(room)

            return room

        else:
            return None

    async def get_room_by_id(self, room_id) -> Room | None:
        stmt = select(Room).where(Room.room_id == room_id)
        result = await self.db.execute(stmt)

        return result.scalars().first()

    @staticmethod
    async def check_is_room_joinable(room: Room) -> dict | bool:
        if room.status == RoomStatus.ENDED:
            return jsonable_encoder( {'code': 'ROOM_INACTIVE'} )   # maybe status's enum class ???

        elif datetime.now(timezone.utc) > room.expires_at:
            return jsonable_encoder( {
                'code': 'ROOM_TIME_EXPIRED',
                'expires_at': room.expires_at
            } )

        else:
            return True

    async def _get_count_active_rooms(self, user_id: int, current_time) -> int:
        stmt = (
            select(func.count())
            .select_from(Room)
            .where(
                Room.creator_id == user_id,
                Room.status == RoomStatus.ACTIVE,
                Room.expires_at > current_time
            )
        )

        result = await self.db.execute(stmt)
        return result.scalar_one()
