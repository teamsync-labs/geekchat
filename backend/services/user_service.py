from sqlalchemy.ext.asyncio import AsyncSession
from models.user import User
from schemas.user import UserCreate
from crud.user import get_by_email, create_user
from core.security import hash_password


class UserService:
    @staticmethod
    async def register(db: AsyncSession, data: UserCreate) -> User | None:
        existing_user = await get_by_email(db, data.email)

        if existing_user is None:
            user = await create_user(db, data, hash_password(data.password))

            return user
        else:
            return None
