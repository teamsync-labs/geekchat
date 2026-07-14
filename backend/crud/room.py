from datetime import datetime
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from models.room import Room


async def create(db: AsyncSession, creator_id: int, ttl: datetime) -> Room:
    room = Room(
        creator_id=creator_id,
        expires_at=ttl
    )

    db.add(room)
    await db.commit()
    await db.refresh(room)

    return room

async def get_room_by_id(db: AsyncSession, room_id) -> Room | None:
    stmt = select(Room).where(Room.room_id == room_id)
    result = await db.execute(stmt)

    return result.scalars().first()