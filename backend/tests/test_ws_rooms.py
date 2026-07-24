import uuid
import pytest
from unittest.mock import patch
from starlette.websockets import WebSocketDisconnect
from signaling.manager import manager


WS_PREFIX = '/ws'

def _ws_url(room_id: uuid.UUID, user_id: int):
    return f'{WS_PREFIX}/rooms/{room_id}/{user_id}'

def test_ws_rejects_when_room_busy(ws_client):
    room_id = uuid.uuid4()

    with patch.object(manager, 'check_connect_opportunity', return_value=False):
        with pytest.raises(WebSocketDisconnect):
            with ws_client.websocket_connect(_ws_url(room_id, user_id=1)) as ws:
                ws.receive_json()