from uuid import UUID
from fastapi import Depends
from services.user import UserService
from services.room import RoomService
from api.deps.services import get_user_service, get_room_service


class ConnectionChecker:
    MAX_UNITS = 2
    GUEST_ID = 0

    def __init__(self, connections: dict, room_id: UUID):
        self.connections = connections
        self.room_id = room_id

    def check_connect_opportunity(self):
        if len(self.connections.get(self.room_id, {})) < ConnectionChecker.MAX_UNITS:
            return True
        else:
            return False

    async def check_room_owner(self, user_id: int, service: RoomService = Depends(get_room_service)):
        creator_id = await service.get_creator_by_room_id(self.room_id)

        if user_id != ConnectionChecker.GUEST_ID:  # logging here !!
            if creator_id == user_id:
                return True
            else:
                return False

        else:
            if self.room_id in self.connections:
                return True
            else:
                return False

    async def check_rooms_limit(self, service: UserService = Depends(get_user_service)):
        is_room_empty = self.room_id not in self.connections or len(self.connections[self.room_id]) == 0

        if is_room_empty:
            total_users = await service.get_count_users()

            if len(self.connections) < total_users:
                return True
            else:
                return False

        else:
            return True