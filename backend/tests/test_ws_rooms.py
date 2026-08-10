# 'test_ws_rooms.py' - синхронные тесты для эндпоинта сигналинга.
import uuid
import pytest
from starlette.websockets import WebSocketDisconnect
from core.error_codes import CODE_9001, CODE_7001, CODE_7002, CODE_9004, CODE_9002, CODE_5002


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

# Тест на несуществующую комнату, до включения в менеджер.
def test_room_not_found_rejects_before_touching_manager(
        ws_client, mock_room_service, mock_user_service):

    room_id = uuid.uuid4()
    mock_room_service.get_room_by_id.return_value = None

    with pytest.raises(WebSocketDisconnect) as exc_info:
        with ws_client.websocket_connect(_ws_url(room_id, CREATOR_ID)) as ws:
            ws.receive_json()

    assert exc_info.value.code == 1008
    assert exc_info.value.reason == CODE_9001

    mock_room_service.get_room_by_id.assert_awaited_once()
    mock_room_service.check_room_joinable.assert_not_awaited()
    mock_user_service.get_count_users.assert_not_awaited()

# Тест на неактивную комнату до ее включения в менеджер.
def test_room_not_joinable_rejects_before_touching_manager(
        ws_client, mock_room_service, mock_user_service):

    room_id = uuid.uuid4()
    mock_room_service.get_room_by_id.return_value = {'room_id': str(room_id), 'status': 'ended'}
    mock_room_service.check_room_joinable.return_value = CODE_9002

    with pytest.raises(WebSocketDisconnect) as exc_info:
        with ws_client.websocket_connect(_ws_url(room_id, CREATOR_ID)) as ws:
            ws.receive_json()

    assert exc_info.value.code == 1008
    assert exc_info.value.reason == CODE_9002

    mock_room_service.check_room_joinable.assert_awaited_once()
    mock_user_service.get_count_users.assert_not_awaited()

# Тест на отклонения подключения третьего гостя.
def test_owner_and_guest_join_third_guest_gets_room_is_busy(
        ws_client, mock_room_service, mock_user_service):

    room_id = uuid.uuid4()
    _setup_joinable_room(mock_room_service, mock_user_service, room_id)

    with ws_client.websocket_connect(_ws_url(room_id, CREATOR_ID)) as ws_owner:
        with ws_client.websocket_connect(_ws_url(room_id, GUEST_ID)) as ws_guest_1:
            joined_event = ws_owner.receive_json()
            assert joined_event == {'type': 'peer-joined', 'user_id': GUEST_ID}

            with pytest.raises(WebSocketDisconnect) as exc_info:
                with ws_client.websocket_connect(_ws_url(room_id, GUEST_ID)) as ws_guest_2:
                    ws_guest_2.receive_json()

            assert exc_info.value.code == 1008
            assert exc_info.value.reason == CODE_9004

            ws_owner.send_json({'type': 'offer', 'payload': {'sdp': 'still-alive-check'}})
            still_alive = ws_guest_1.receive_json()
            assert still_alive['type'] == 'offer'
            assert still_alive['from_user_id'] == CREATOR_ID

# Тест на запрет подключения гостя без существования создателя комнаты.
def test_guest_alone_without_owner_is_rejected(ws_client, mock_room_service, mock_user_service):
    room_id = uuid.uuid4()
    _setup_joinable_room(mock_room_service, mock_user_service, room_id)

    with pytest.raises(WebSocketDisconnect) as exc_info:
        with ws_client.websocket_connect(_ws_url(room_id, GUEST_ID)) as ws:
            ws.receive_json()

    assert exc_info.value.code == 1008
    assert exc_info.value.reason == CODE_7002

# Тест на проверку действительного ID создателя комнаты.
def test_stranger_user_id_rejected_as_not_owner(ws_client, mock_room_service, mock_user_service):
    room_id = uuid.uuid4()
    _setup_joinable_room(mock_room_service, mock_user_service, room_id)

    stranger_id = 999
    with pytest.raises(WebSocketDisconnect) as exc_info:
        with ws_client.websocket_connect(_ws_url(room_id, stranger_id)) as ws:
            ws.receive_json()

    assert exc_info.value.code == 1008
    assert exc_info.value.reason == CODE_5002

# Тест на запрет создания сессии подключения, когда исчерпан лимит, равный количеству пользователей в системе.
def test_global_rooms_limit_reached_rejects_new_room(ws_client, mock_room_service, mock_user_service):
    room_id = uuid.uuid4()
    _setup_joinable_room(mock_room_service, mock_user_service, room_id, total_users=0)

    with pytest.raises(WebSocketDisconnect) as exc_info:
        with ws_client.websocket_connect(_ws_url(room_id, CREATOR_ID)) as ws:
            ws.receive_json()

    assert exc_info.value.code == 1008
    assert exc_info.value.reason == CODE_7001

# Тест на удаление старой сессии при переподключении создателя. Только два слота могут быть, для создателя и для гостя.
def test_owner_reconnect_evicts_old_session_and_frees_slot_for_guest(
        ws_client, mock_room_service, mock_user_service):

    room_id = uuid.uuid4()
    _setup_joinable_room(mock_room_service, mock_user_service, room_id)

    with ws_client.websocket_connect(_ws_url(room_id, CREATOR_ID)) as ws_owner_old:
        with ws_client.websocket_connect(_ws_url(room_id, CREATOR_ID)) as ws_owner_new:
            with pytest.raises(WebSocketDisconnect) as exc_info:
                ws_owner_old.receive_json()

            assert exc_info.value.code == 4009

            with ws_client.websocket_connect(_ws_url(room_id, GUEST_ID)) as ws_guest:
                joined_event = ws_owner_new.receive_json()
                assert joined_event == {'type': 'peer-joined', 'user_id': GUEST_ID}

                ws_owner_new.send_json({'type': 'offer', 'payload': {'sdp': 'reconnect-check'}})
                received = ws_guest.receive_json()
                assert received['type'] == 'offer'
                assert received['from_user_id'] == CREATOR_ID

# Тест на запрет вечного переподключения гостя.
def test_guest_does_not_evict_another_guest_with_same_user_id(
        ws_client, mock_room_service, mock_user_service):

    room_id = uuid.uuid4()
    _setup_joinable_room(mock_room_service, mock_user_service, room_id)

    with ws_client.websocket_connect(_ws_url(room_id, CREATOR_ID)) as ws_owner:
        with ws_client.websocket_connect(_ws_url(room_id, GUEST_ID)) as ws_guest_1:
            ws_owner.receive_json()

            with pytest.raises(WebSocketDisconnect) as exc_info:
                with ws_client.websocket_connect(_ws_url(room_id, GUEST_ID)) as ws_guest_2:
                    ws_guest_2.receive_json()

            assert exc_info.value.code == 1008
            assert exc_info.value.reason == CODE_9004

            ws_owner.send_json({'type': 'offer', 'payload': {'sdp': 'guest-still-alive'}})
            still_alive = ws_guest_1.receive_json()
            assert still_alive['type'] == 'offer'
