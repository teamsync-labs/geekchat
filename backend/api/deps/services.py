# 'services.py' - получение сервисов через зависимость.
from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession
from api.deps.db import get_db
from services.room import RoomService
from services.user import UserService


async def get_room_service(db: AsyncSession = Depends(get_db)):
    return RoomService(db)

async def get_user_service(db: AsyncSession = Depends(get_db)):
    return UserService(db)
