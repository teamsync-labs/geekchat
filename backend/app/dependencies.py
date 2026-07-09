from app.db.session import SessionLocal
from fastapi import Depends


async def get_db():
    async with SessionLocal() as session:
        yield session
