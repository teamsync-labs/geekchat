from uuid import UUID
from fastapi import APIRouter, WebSocket, WebSocketDisconnect, status
from pydantic import ValidationError
from signaling.manager import manager
from signaling.schema import SignalMessage


router = APIRouter()

@router.websocket('/rooms/{room_id}/{user_id}')
async def ws_room(websocket: WebSocket, room_id: UUID, user_id: int):  # user Auth !!
    if not manager.check_connect_opportunity(room_id):
        await websocket.close(code=status.WS_1008_POLICY_VIOLATION, reason='ROOM_IS_BUSY')

        return

    elif not manager.check_room_owner(room_id, user_id):
        await websocket.close(code=status.WS_1008_POLICY_VIOLATION, reason='CONNECT_IS_DENIED')

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
                    'payload': message.payload,
                },
            )
            if not delivered:
                await websocket.send_json({'type': 'error', 'detail': 'Peer is not connected yet'})

    except WebSocketDisconnect:
        pass

    finally:
        manager.remove(room_id, user_id)
        await manager.broadcast(room_id, {'type': 'peer-left', 'user_id': user_id}, exclude_user_id=user_id)