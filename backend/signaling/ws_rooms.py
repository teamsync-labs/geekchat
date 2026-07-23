from uuid import UUID
from fastapi import APIRouter, WebSocket, WebSocketDisconnect, status, Depends
from pydantic import ValidationError
from api.deps.services import get_room_service
from services.room import RoomService
from signaling.manager import manager
from signaling.schema import SignalMessage
from signaling.service import ConnectionChecker


router = APIRouter()

@router.websocket('/rooms/{room_id}/{user_id}')
async def ws_room(websocket: WebSocket, room_id: UUID, user_id: int,
                  room_service: RoomService = Depends(get_room_service)):  # user Auth !!

    room = await room_service.get_room_by_id(room_id)
    if room is None:
        await websocket.close(code=status.WS_1008_POLICY_VIOLATION, reason='ROOM_NOT_FOUND')  # enum class !!

        return

    availability = await room_service.check_room_joinable(room)
    if availability is not True:
        await websocket.close(code=status.WS_1008_POLICY_VIOLATION, reason=availability['code'])

        return

    connection_checker = ConnectionChecker(manager.connections, room_id)
    if not await connection_checker.check_rooms_limit():
        await websocket.close(code=status.WS_1008_POLICY_VIOLATION, reason='GLOBAL_ROOM_LIMITS')

        return

    elif not manager.check_room_owner(room_id, user_id):
        await websocket.close(code=status.WS_1008_POLICY_VIOLATION, reason='CONNECT_IS_DENIED')

        return

    if not manager.check_connect_opportunity(room_id):
        await websocket.close(code=status.WS_1008_POLICY_VIOLATION, reason='ROOM_IS_BUSY')

        return

    await websocket.accept()
    manager.add(websocket, room_id, user_id)

    await manager.broadcast(room_id, {'type': 'peer-joined', 'user_id': user_id}, exclude_user_id=user_id)

    try:
        while True:
            raw = await websocket.receive_json()

            try:
                message = SignalMessage(**raw)
            except ValidationError as e:
                await websocket.send_json({'type': 'error', 'detail': e.errors()})
                continue

            delivered = await manager.send_to_peer(
                room_id,
                sender_id=user_id,
                message={
                    'type': message.type,
                    'from_user_id': user_id,
                    'payload': message.payload
                },
            )
            if not delivered:
                await websocket.send_json({'type': 'error', 'detail': 'Peer is not connected yet'})

    except WebSocketDisconnect:
        pass

    finally:
        manager.remove(room_id, user_id)
        await manager.broadcast(room_id, {'type': 'peer-left', 'user_id': user_id}, exclude_user_id=user_id)