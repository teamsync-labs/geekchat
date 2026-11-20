# 'test_rooms.py' - тесты для эндпоинтов комнаты.
import uuid
from datetime import datetime, timezone
import pytest
from types import SimpleNamespace
from unittest.mock import AsyncMock, patch
from core.security import JwtToken


ROOMS_URL = '/api/v1/rooms'

# Тест для создания комнаты с валидным пользователем по токену, с возвратом кода 201, ID комнаты и ссылки входа для гостя.
async def test_create_room_with_jwt_uses_user_id_from_token_as_creator(client, mock_room_service):
    user_id_from_token = 42
    token = JwtToken.create_access_token(user_id_from_token)

    fake_room = SimpleNamespace(room_id=uuid.uuid4())
    mock_room_service.create.return_value = fake_room

    fake_current_user = SimpleNamespace(user_id=user_id_from_token)

    with patch('services.auth.AuthService.get_current_user', new_callable=AsyncMock) as mocked_get_user:
        mocked_get_user.return_value = fake_current_user

        response = await client.post(
            ROOMS_URL + '/',
            json={'ttl': 1800},
            headers={'Authorization': f'Bearer {token}'},
        )

    assert response.status_code == 201
    body = response.json()
    assert body['room_id'] == str(fake_room.room_id)
    assert body['join_url'].endswith(str(fake_room.room_id))

    mock_room_service.create.assert_awaited_once()
    passed_data, passed_creator_id = mock_room_service.create.await_args.args
    assert passed_creator_id == user_id_from_token
    assert passed_data.ttl == 1800

# Тест создания комнаты без токена и ошибка 401.
@pytest.mark.asyncio
async def test_create_room_without_token_returns_401(client, mock_room_service):
    response = await client.post(ROOMS_URL + '/', json={'ttl': 1800})

    assert response.status_code in (401, 403)
    mock_room_service.create.assert_not_awaited()

# Тест для запроса получения действительной комнаты с возвратом кода 200 и дополнительной информации.
@pytest.mark.asyncio
async def test_get_existing_room_returns_200(client, mock_room_service):
    room_id = uuid.uuid4()

    mock_room_service.get_room_by_id.return_value = {
        'room_id': str(room_id),
        'status': 'active',
        'created_at': datetime.now(timezone.utc)
    }

    mock_room_service.check_room_joinable.return_value = True

    response = await client.get(f"{ROOMS_URL}/{room_id}")

    assert response.status_code == 200
    body = response.json()
    assert body['room_id'] == str(room_id)

    mock_room_service.get_room_by_id.assert_awaited_once()
    mock_room_service.check_room_joinable.assert_awaited_once()

# Тест возврата кода 404 недействительной комнаты
@pytest.mark.asyncio
async def test_get_unknown_room_returns_404(client, mock_room_service):
    unknown_id = uuid.uuid4()

    mock_room_service.get_room_by_id.return_value = None

    response = await client.get(f"{ROOMS_URL}/{unknown_id}")

    assert response.status_code == 404

    mock_room_service.get_room_by_id.assert_awaited_once()
    mock_room_service.check_room_joinable.assert_not_awaited()
