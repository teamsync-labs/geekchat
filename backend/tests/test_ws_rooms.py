import uuid
import pytest
from starlette.websockets import WebSocketDisconnect


WS_PREFIX = '/ws'
CREATOR_ID = 1
GUEST_ID = 0

def _ws_url(room_id: uuid.UUID, user_id: int):
    return f'{WS_PREFIX}/rooms/{room_id}/{user_id}'

def _setup_joinable_room(mock_room_service,
                         mock_user_service, room_id: uuid.UUID, total_users: int = 10):

    mock_room_service.get_room_by_id.return_value = {'room_id': str(room_id), 'status': 'active'}
    mock_room_service.check_room_joinable.return_value = True
    mock_room_service.get_creator_by_room_id.return_value = CREATOR_ID
    mock_user_service.get_count_users.return_value = total_users

def test_owner_and_guest_join_third_guest_gets_room_is_busy(ws_client, mock_room_service, mock_user_service):
    room_id = uuid.uuid4()
    _setup_joinable_room(mock_room_service, mock_user_service, room_id)

    with ws_client.websocket_connect(_ws_url(room_id, CREATOR_ID)) as ws_owner:
        with ws_client.websocket_connect(_ws_url(room_id, GUEST_ID)) as ws_guest_1:
            joined_event = ws_owner.receive_json()
            assert joined_event == {"type": "peer-joined", "user_id": GUEST_ID}

            with pytest.raises(WebSocketDisconnect) as exc_info:
                with ws_client.websocket_connect(_ws_url(room_id, GUEST_ID)) as ws_guest_2:
                    ws_guest_2.receive_json()

            ws_owner.send_json({"type": "offer", "payload": {"sdp": "still-alive-check"}})
            still_alive = ws_guest_1.receive_json()
            assert still_alive["type"] == "offer"
            assert still_alive["from_user_id"] == CREATOR_ID
