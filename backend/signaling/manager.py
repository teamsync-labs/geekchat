# 'manager.py' - менеджер подключений к комнатам.
import uuid
from uuid import UUID
from fastapi import WebSocket
import asyncio
from core.error_codes import CODE_7001, CODE_7002, CODE_9004, CODE_5002


class ConnectionManager:
    MAX_UNITS = 2
    GUEST_ID = 0
    NONE_PEERS_IN_ROOM = 0

    def __init__(self):
        # room_id -> {session_id: {"websocket": WebSocket, "user_id": int}}
        self.connections: dict[UUID, dict[UUID, dict]] = {}
        self.lock = asyncio.Lock()

    async def try_join(self, room_id: UUID, user_id: int, websocket: WebSocket,
                       creator_id: int, total_users: int):

        async with self.lock:
            if user_id != ConnectionManager.GUEST_ID:
                if creator_id != user_id:
                    return False, CODE_5002, None
            else:
                if room_id not in self.connections:
                    return False, CODE_7002, None

            peers = self.connections.get(room_id, {})
            is_room_empty = len(peers) == ConnectionManager.NONE_PEERS_IN_ROOM

            if is_room_empty and len(self.connections) >= total_users:
                return False, CODE_7001, None

            if len(peers) >= ConnectionManager.MAX_UNITS:
                return False, CODE_9004, None

            session_id = uuid.uuid4()
            self.connections.setdefault(room_id, {})[session_id] = {
                'websocket': websocket,
                'user_id': user_id
            }

            return True, None, session_id

    def remove(self, room_id: UUID, session_id: UUID):
        room = self.connections.get(room_id)

        if room is None:
            return

        room.pop(session_id, None)

        if not room:
            del self.connections[room_id]

    async def broadcast(self, room_id: UUID, message: dict, exclude_session_id: UUID | None = None):
        for session_id, info in list(self.connections.get(room_id, {}).items()):
            if session_id != exclude_session_id:
                await info['websocket'].send_json(message)

    async def send_to_peer(self, room_id: UUID, sender_session_id: UUID, message: dict):
        room = self.connections.get(room_id, {})
        for session_id, info in room.items():
            if session_id != sender_session_id:
                await info['websocket'].send_json(message)

                return True

        return False


manager = ConnectionManager()
