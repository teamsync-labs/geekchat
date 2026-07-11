from sqlalchemy.ext.asyncio import AsyncSession
from models.user import User
from schemas.user import UserCreate
from core.security import hash_password


async def create_user(db: AsyncSession, user: UserCreate):
    db_user = User(user_name=user.username, password_hash=hash_password(user.password))
    db.add(db_user)
    await db.commit()
    await db.refresh(db_user)
    return db_user