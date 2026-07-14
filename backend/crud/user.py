from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from models.user import User
from schemas.user import UserCreate


async def create_user(db: AsyncSession, data: UserCreate, hashed_password: str) -> User:
    user = User(
        user_name = data.username,
        email = data.email,
        password_hash = hashed_password
    )

    db.add(user)
    await db.commit()
    await db.refresh(user)

    return user

async def get_by_email(db: AsyncSession, email: str) -> User | None:
    stmt = select(User).where(User.email == email)
    result = await db.execute(stmt)

    return result.scalars().first()