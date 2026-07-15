from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession
from api.deps.db import get_db
from services.room_service import RoomService
from services.user_service import UserService


async def get_room_service(db: AsyncSession = Depends(get_db)) -> RoomService:
    return RoomService(db)

async def get_user_service(db: AsyncSession = Depends(get_db)) -> UserService:
    return UserService(db)