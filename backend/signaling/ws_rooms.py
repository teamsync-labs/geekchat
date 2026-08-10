# 'ws_rooms.py' - эндпоинт вебсокет соединения.
from uuid import UUID
from fastapi import APIRouter, WebSocket, WebSocketDisconnect, status, Depends, HTTPException
from pydantic import ValidationError
from api.deps.services import get_room_service, get_auth_service
from services.room import RoomService
from services.auth import AuthService
from signaling.manager import manager
from signaling.schema import SignalMessage
from core.program_codes import RoomState as rs, WebsocketState as ws


router = APIRouter()

@router.websocket('/rooms/{room_id}/{user_id}')
async def ws_room(websocket: WebSocket, room_id: UUID, user_id: int,
                  room_service: RoomService = Depends(get_room_service),
                  user_service: AuthService = Depends(get_auth_service)):

    await websocket.accept()

    room = await room_service.get_room_by_id(room_id)
    if room is None:
        await websocket.close(code=status.WS_1008_POLICY_VIOLATION, reason=rs.CODE_9001)

        return

    availability_status = await room_service.check_room_joinable(room)
    if availability_status is not True:
        await websocket.close(code=status.WS_1008_POLICY_VIOLATION, reason=availability_status)

        return

    creator_id = await room_service.get_creator_by_room_id(room_id)
    total_users = await user_service.get_count_users()

    join_status, error_code, session_id = await manager.try_join(room_id, user_id, websocket,
                                                                 creator_id=creator_id, total_users=total_users)

    if not join_status:
        await websocket.close(code=status.WS_1008_POLICY_VIOLATION, reason=error_code)

        return

    await manager.broadcast(room_id, {'type': 'peer-joined', 'user_id': user_id}, exclude_session_id=session_id)

    try:
        while True:
            raw_data = await websocket.receive_json()

            try:
                message = SignalMessage(**raw_data)
            except ValidationError as e:
                await websocket.send_json({'type': 'error', 'detail': e.errors()})

                continue

            delivered = await manager.send_to_peer(
                room_id, sender_session_id=session_id,
                message={
                    'type': message.type,
                    'from_user_id': user_id,
                    'payload': message.payload
                },
            )
            if not delivered:
                await websocket.send_json({'type': 'error', 'detail': ws.CODE_7003})

    except WebSocketDisconnect:
        pass

    finally:
        await manager.remove(room_id, session_id)

        await manager.broadcast(room_id, {'type': 'peer-left', 'user_id': user_id}, exclude_session_id=session_id)
