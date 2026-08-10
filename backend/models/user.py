# 'user.py' - модель сущности "пользователь" базы данных.
from sqlalchemy import Column, Integer, Text, DateTime, VARCHAR, func, Boolean
from db.session import Base

# Добавление полей по мере развития системы (номер тел., дополнительный емайл и т.п.)
class User(Base):
    __tablename__ = 'users'

    user_id = Column(Integer, primary_key=True, autoincrement=True)

    user_name = Column(Text, nullable=False, index=True)

    email = Column(VARCHAR(255), nullable=False, unique=True)
    password_hash = Column(Text, nullable=False)

    is_active = Column(Boolean, default=True, nullable=False)
    is_verified = Column(Boolean, default=False, nullable=False)

    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(),
                        onupdate=func.now(), nullable=False)

    last_login = Column(DateTime(timezone=True), nullable=True)

    def __repr__(self):
        return (f"<User(id={self.user_id}, username={self.user_name}, e-mail={self.email}, "
                f"secure_hash={self.password_hash}, created_at={self.created_at})>")
