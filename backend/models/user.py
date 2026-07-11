from db.session import Base
from sqlalchemy import Column, Integer, Text, DateTime
from datetime import datetime

# Добавление полей по мере развития системы (эл. почта, номер тел., и т.п.)
class User(Base):
    __tablename__ = 'users'

    user_id = Column(Integer, primary_key=True, autoincrement=True)    # default index
    user_name = Column(Text, nullable=False, index=True)
    password_hash = Column(Text, nullable=False)    # no index !
    created_at = Column(DateTime, default=datetime.now(), nullable=False)


#email = Column(VARCHAR(255), nullable=False, unique=True)   # default index