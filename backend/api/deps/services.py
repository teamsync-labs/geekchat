# 'services.py' - получение сервисов через зависимость.
from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession
from api.deps.db import get_db
from services.room import RoomService
from services.auth import AuthService


async def get_room_service(db: AsyncSession = Depends(get_db)):
    return RoomService(db)

async def get_auth_service(db: AsyncSession = Depends(get_db)):
    return AuthService(db)
