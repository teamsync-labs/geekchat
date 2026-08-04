# 'auth.py' - сервис пользователя (бизнес).
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from datetime import datetime, timezone
from models.user import User
from schemas.auth import UserRegister, UserLogin
from core.security import UserPassword, JwtToken

# Logging here !!
class AuthService:
    def __init__(self, db: AsyncSession):
        self.db = db

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

    async def get_count_users(self):
        stmt = select(func.count()).select_from(User)
        result = await self.db.execute(stmt)

        return result.scalar_one()

    async def _get_by_email(self, email):
        stmt = select(User).where(User.email == email)
        result = await self.db.execute(stmt)

        return result.scalars().first()

    async def login_user(self, data: UserLogin):
        stmt = select(User).where(User.user_name == data.username)
        result = await self.db.execute(stmt)
        user = result.scalars().first()

        if user is None:
            print(f'Login attempt by a non-existent user: {data.username}')   # error logging !!

            raise ValueError('False login or password')  # error codes ??

        if not user.is_active:
            print(f'Login attempt by a deactivated user: {user.user_name}')

            raise ValueError('Account deactivated')

        if not UserPassword.verify_password(data.password, user.password_hash):
            print(f'Invalid password for: {user.user_name}')

            raise ValueError('False login or password')

        user.last_login = datetime.now(timezone.utc)
        await self.db.commit()

        access_token = JwtToken.create_access_token(user.user_id)
        # refresh token create

        print(f'User login: {user.user_name}')

        return user, access_token     # > refresh_token

    async def get_current_user(self, token):
        try:
            payload = JwtToken.verify_token(token, token_type='access')
        except ValueError as e:
            print(f'Check token error: {e}')

            raise ValueError(str(e))

        user_id = payload.get('user_id')

        stmt = select(User).where(User.user_id == user_id)
        result = await self.db.execute(stmt)
        user = result.scalars().first()

        if not user:
            print(f'User not found: {user_id}')

            raise ValueError('User not found')

        if not user.is_active:
            print(f'Account deactivated: {user.user_name}')

            raise ValueError('Account deactivated')

        return user
