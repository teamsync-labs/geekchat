# 'auth.py' - сервис пользователя (бизнес).
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from datetime import datetime, timezone
from models.user import User
from schemas.auth import UserRegister, UserLogin
from core.security import UserPassword, JwtToken
from log_system.logger_entities import user_logger as ul
from core.program_codes import UserState, LogLevel


class AuthService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_count_users(self):
        stmt = select(func.count()).select_from(User)
        result = await self.db.execute(stmt)

        return result.scalar_one()

    async def get_current_user(self, token):
        try:
            payload = JwtToken.verify_token(token, token_type='access')
        except ValueError as e:
            ul.create_log_line(UserState.CODE_5024, LogLevel.ERROR, f'{e}')

            raise ValueError(UserState.CODE_5024)

        user_id = payload.get('user_id')

        stmt = select(User).where(User.user_id == user_id)
        result = await self.db.execute(stmt)
        user = result.scalars().first()

        if not user:
            ul.create_log_line(UserState.CODE_5202, LogLevel.ERROR, f'user-id: {user_id}')

            raise ValueError(UserState.CODE_5202)

        if not user.is_active:
            ul.create_log_line(UserState.CODE_5203, LogLevel.ERROR, f'user-name: {user.user_name}')

            raise ValueError(UserState.CODE_5203)

        return user

    async def login_user(self, data: UserLogin):
        stmt = select(User).where(User.email == data.email)
        result = await self.db.execute(stmt)
        user = result.scalars().first()

        if user is None:
            ul.create_log_line(UserState.CODE_5204, LogLevel.ERROR)

            raise ValueError(UserState.CODE_5204)

        if not user.is_active:
            ul.create_log_line(UserState.CODE_5205, LogLevel.ERROR, f'user-name: {user.user_name}')

            raise ValueError(UserState.CODE_5205)

        if not UserPassword.verify_password(data.password, user.password_hash):
            ul.create_log_line(UserState.CODE_5206, LogLevel.ERROR, f'user-name: {user.user_name}')

            raise ValueError(UserState.CODE_5206)

        user.last_login = datetime.now(timezone.utc)
        await self.db.commit()

        access_token = JwtToken.create_access_token(user.user_id)
        # refresh token create

        ul.create_log_line(UserState.CODE_5101, LogLevel.INFO, f'user-name: {user.user_name}')

        return access_token     # > refresh_token

    async def register(self, data: UserRegister):
        existing_user = await self._get_by_email(data.email)

        if existing_user is None:
            user = User(
                user_name=data.username,
                email=data.email,
                password_hash=UserPassword.hash_password(data.password)
            )

            self.db.add(user)
            await self.db.commit()
            await self.db.refresh(user)

            return user
        else:
            return None

    async def _get_by_email(self, email):
        stmt = select(User).where(User.email == email)
        result = await self.db.execute(stmt)

        return result.scalars().first()
