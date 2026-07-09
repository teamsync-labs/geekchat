from app.db.session import Base
from sqlalchemy import Column, Integer, Text


class User(Base):
    __tablename__ = 'users'

    user_id = Column(Integer, primary_key=True)
    username = Column(Text, nullable=False)
    password_hash = Column(Text, nullable=False)
