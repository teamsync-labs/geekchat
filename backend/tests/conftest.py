import pytest
from httpx import AsyncClient, ASGITransport
from unittest.mock import AsyncMock
from starlette.testclient import TestClient
from main import app
from api.deps.services import get_room_service
from signaling.manager import manager as ws_manager


@pytest.fixture
def mock_room_service():
    service = AsyncMock()
    return service

@pytest.fixture
async def client(mock_room_service):
    app.dependency_overrides[get_room_service] = lambda: mock_room_service

    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url='http://test') as async_client:
        yield async_client

    app.dependency_overrides.clear()

@pytest.fixture
def ws_client():
    with TestClient(app) as test_client:
        yield test_client

@pytest.fixture(autouse=True)
def reset_ws_manager():
    if hasattr(ws_manager, 'connections'):
        ws_manager.connections.clear()
    yield
    if hasattr(ws_manager, 'connections'):
        ws_manager.connections.clear()