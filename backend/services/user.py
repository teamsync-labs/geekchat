from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from models.user import User
from schemas.user import UserCreate
from core.security import hash_password


class UserService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def register(self, data: UserCreate) -> User | None:
        existing_user = await self._get_by_email(data.email)

        if existing_user is None:
            user = User(
                user_name=data.username,
                email=data.email,
                password_hash=hash_password(data.password)
            )

            self.db.add(user)
            await self.db.commit()
            await self.db.refresh(user)

            return user
        else:
            return None

    async def _get_by_email(self, email: str) -> User | None:
        stmt = select(User).where(User.email == email)
        result = await self.db.execute(stmt)

        return result.scalars().first()
