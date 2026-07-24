from uuid import UUID
from fastapi import WebSocket
import asyncio
from core.error_codes import CODE_7001, CODE_7002, CODE_9004, CODE_5002


class ConnectionManager:
    MAX_UNITS = 2
    GUEST_ID = 0
    NONE_PEERS_IN_ROOM = 0

    def __init__(self):
        self.connections: dict[UUID, dict[int, WebSocket]] = {}
        self.lock = asyncio.Lock()

    async def try_join(self, room_id: UUID, user_id: int, websocket: WebSocket,
                       creator_id: int, total_users: int):

        async with self.lock:
            peers = self.connections.get(room_id, {})
            is_room_empty = len(peers) == ConnectionManager.NONE_PEERS_IN_ROOM

            if is_room_empty and len(self.connections) >= total_users:
                return False, CODE_7001

            if user_id != ConnectionManager.GUEST_ID:
                if creator_id != user_id:
                    return False, CODE_5002
            else:
                if room_id not in self.connections:
                    return False, CODE_7002

            is_reconnect = user_id in peers
            if not is_reconnect and len(peers) >= ConnectionManager.MAX_UNITS:
                return False, CODE_9004

            old_websocket = peers.get(user_id)
            if old_websocket is not None and old_websocket is not websocket:
                await old_websocket.close(code=4009, reason='RECONNECTED')   # state codes ??
                print(f'{user_id} reconnected')

            self.connections.setdefault(room_id, {})[user_id] = websocket

            return True, None

    def remove(self, room_id: UUID, user_id: int, websocket: WebSocket):
        peers = self.connections.get(room_id)

        if peers is None:
            return

        if peers.get(user_id) is websocket:
            del peers[user_id]

        if not peers:
            self.connections.pop(room_id, None)

    async def broadcast(self, room_id: UUID, message: dict, exclude_user_id: int):
        for user_id, ws in self.connections.get(room_id, {}).items():
            if user_id != exclude_user_id:
                await ws.send_json(message)

    async def send_to_peer(self, room_id: UUID, sender_id: int, message: dict):
        room = self.connections.get(room_id, {})
        for user_id, ws in room.items():
            if user_id != sender_id:
                await ws.send_json(message)

                return True

        return False


manager = ConnectionManager()