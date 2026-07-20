from uuid import UUID
from fastapi import WebSocket


class ConnectionManager:
    MAX_UNITS = 2
    GUEST_ID = 0

    def __init__(self):
        # {room_id: {user_id: WebSocket}}
        self._connections: dict[UUID, dict[int, WebSocket]] = {}

    @property
    def connections(self):
        return self._connections

    def add(self, websocket: WebSocket, room_id: UUID, user_id: int):
        self._connections.setdefault(room_id, {})[user_id] = websocket

    def remove(self, room_id: UUID, user_id: int):
        room = self.connections.get(room_id)
        if room is None:
            return

        room.pop(user_id, None)

        if not room:
            del self.connections[room_id]

    async def broadcast(self, room_id: UUID, message: dict, exclude_user_id: int):
        for user_id, ws in self.connections.get(room_id, {}).items():
            if user_id != exclude_user_id:
                await ws.send_json(message)

    def check_connect_opportunity(self, room_id: UUID):
        if len(self.connections.get(room_id, {})) < ConnectionManager.MAX_UNITS:
            return True
        else:
            return False

    async def send_to_peer(self, room_id: UUID, sender_id: int, message: dict):
        room = self.connections.get(room_id, {})
        for user_id, ws in room.items():
            if user_id != sender_id:
                await ws.send_json(message)

                return True

        return False

    def check_room_owner(self, room_id: UUID, user_id: int):
        if user_id == ConnectionManager.GUEST_ID and room_id not in self.connections:
            return False
        else:
            return True


manager = ConnectionManager()