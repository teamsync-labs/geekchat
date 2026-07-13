from datetime import timedelta, datetime
from sqlalchemy.ext.asyncio import AsyncSession
from models.room import Room
from schemas.room import RoomCreate


async def create(db: AsyncSession, data: RoomCreate, creator_id: int, duration: int) -> Room:
    room = Room(
        expires_at=datetime.now() + timedelta(minutes=duration),
        creator_id=creator_id
    )

    db.add(room)
    await db.commit()
    await db.refresh(room)
    return room