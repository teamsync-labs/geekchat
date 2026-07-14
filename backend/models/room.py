from sqlalchemy import Column, Integer, DateTime, ForeignKey, text, UUID, func, Enum as SQLEnum
from db.session import Base
from db.room_status import RoomStatus


class Room(Base):
    __tablename__ = 'rooms'

    room_id = Column(UUID(as_uuid=True), primary_key=True, server_default=text('gen_random_uuid()'))
    creator_id = Column(Integer, ForeignKey('users.user_id'), nullable=True)    # null if not auth !!
    status = Column(SQLEnum(RoomStatus, native_enum=True, name='room_status_enum',
                            values_callable=lambda obj: [e.value for e in obj]),
                            default=RoomStatus.ACTIVE, nullable=False, server_default=RoomStatus.ACTIVE.value)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    expires_at = Column(DateTime(timezone=True), nullable=False)

    def __repr__(self):
        return (f"Room(id={self.room_id}, creator_id={self.creator_id}, status={self.status}, "
                f"create_time={self.created_at}, expire_time={self.expires_at})")