# 'auth.py' - сервис пользователя (бизнес).
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from models.user import User
from schemas.auth import UserRegister, UserLogin
from core.security import UserPassword as hashing

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
                password_hash=hashing.hash_password(data.password)
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

    async def _get_by_email(self, email: str):
        stmt = select(User).where(User.email == email)
        result = await self.db.execute(stmt)

        return result.scalars().first()

    async def login_user(self, data: UserLogin) -> tuple[User, str, str]:
        stmt = select(User).where(User.user_name == data.username)
        result = await self.db.execute(stmt)
        user = result.scalars().first()

        if not user:
            print(f'Login attempt by a non-existent user: {data.username}')

            raise ValueError('False login or password')

        if not user.is_active:
            logger.warning(f"Попытка входа деактивированного пользователя: {user.username}")
            raise ValueError("Аккаунт деактивирован")

        # 3. Проверяем пароль
        if not verify_password(data.password, user.password_hash):
            logger.warning(f"Неправильный пароль для: {user.username}")
            raise ValueError("Неверное имя пользователя или пароль")

        # 4. Обновляем время последнего входа
        from datetime import datetime
        user.last_login = datetime.utcnow()
        await db.commit()

        # 5. Создаём токены
        access_token = create_access_token(user.id)
        refresh_token = create_refresh_token(user.id)

        logger.info(f"✅ Пользователь вошёл: {user.username}")

        return user, access_token, refresh_token

    @staticmethod
    async def get_current_user(db: AsyncSession, token: str) -> User:
        """
        Получить текущего пользователя по токену
        ✅ Используется в dependencies
        """

        # 1. Проверяем токен
        try:
            payload = verify_token(token, token_type="access")
        except ValueError as e:
            logger.warning(f"Ошибка при проверке токена: {e}")
            raise ValueError(str(e))

        user_id = payload.get("user_id")

        # 2. Получаем пользователя
        stmt = select(User).where(User.id == user_id)
        result = await db.execute(stmt)
        user = result.scalars().first()

        if not user:
            logger.warning(f"Пользователь не найден: {user_id}")
            raise ValueError("Пользователь не найден")

        if not user.is_active:
            logger.warning(f"Аккаунт деактивирован: {user.username}")
            raise ValueError("Аккаунт деактивирован")

        return user
