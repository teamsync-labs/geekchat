import pytest
from httpx import AsyncClient, ASGITransport
from unittest.mock import AsyncMock
from main import app
from api.deps.services import get_room_service


@pytest.fixture
def mock_room_service():
    service = AsyncMock()
    return service

@pytest.fixture
async def client(mock_room_service):
    app.dependency_overrides[get_room_service] = lambda: mock_room_service

    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as async_client:
        yield async_client

    app.dependency_overrides.clear()
