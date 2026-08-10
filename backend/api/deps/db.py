# 'db.py' - получение сессии базы данных.
from db.session import AsyncSessionLocal


async def get_db():
    async with AsyncSessionLocal() as session:
        yield session
