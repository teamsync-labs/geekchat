import uuid
from datetime import datetime, timezone
import pytest


ROOMS_URL = '/api/v1/rooms'

@pytest.mark.asyncio
async def test_create_room_returns_201_with_room_id_and_join_url(client, mock_room_service):
    new_room_id = uuid.uuid4()

    mock_room_service.create.return_value = {
        'room_id': str(new_room_id),
        'join_url': f'https://example.com/rooms/{new_room_id}'
    }

    response = await client.post(f'{ROOMS_URL}/', json={ 'ttl': '30' })

    assert response.status_code == 201
    body = response.json()
    assert body['room_id'] == str(new_room_id)
    assert 'join_url' in body
    assert body['join_url'].endswith(str(new_room_id))

    mock_room_service.create.assert_awaited_once()

@pytest.mark.asyncio
async def test_get_existing_room_returns_200(client, mock_room_service):
    room_id = uuid.uuid4()

    mock_room_service.get_room_by_id.return_value = {
        'room_id': str(room_id),
        'status': 'active',
        'created_at': datetime.now(timezone.utc)
    }

    mock_room_service.is_room_joinable.return_value = True

    response = await client.get(f"{ROOMS_URL}/{room_id}")

    assert response.status_code == 200
    body = response.json()
    assert body['room_id'] == str(room_id)

    mock_room_service.get_room_by_id.assert_awaited_once()
    mock_room_service.is_room_joinable.assert_awaited_once()

@pytest.mark.asyncio
async def test_get_unknown_room_returns_404(client, mock_room_service):
    unknown_id = uuid.uuid4()

    mock_room_service.get_room_by_id.return_value = None

    response = await client.get(f"{ROOMS_URL}/{unknown_id}")

    assert response.status_code == 404

    mock_room_service.get_room_by_id.assert_awaited_once()
    mock_room_service.is_room_joinable.assert_not_awaited()
