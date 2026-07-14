from datetime import timedelta, datetime, timezone
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from models.room import Room
from schemas.room import RoomCreate


async def create(db: AsyncSession, data: RoomCreate, creator_id: int, duration: int) -> Room:
    room = Room(
        expires_at=datetime.now(timezone.utc) + timedelta(minutes=duration),
        creator_id=creator_id
    )

    db.add(room)
    await db.commit()
    await db.refresh(room)

    return room

async def get_room(db: AsyncSession, room_id) -> Room | None:
    stmt = select(Room).where(Room.room_id == room_id)
    result = await db.execute(stmt)

    return result.scalars().first()