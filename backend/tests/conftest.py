# 'conftest.py' - конфигурация тестов.
import os
os.environ.setdefault('DATABASE_URL', 'postgresql+asyncpg://unit-tests-do-not-connect/placeholder')
os.environ.setdefault('JWT_SECRET', 'test-secret-key-not-for-production')
os.environ.setdefault('JWT_ALGORITHM', 'HS256')
os.environ.setdefault('ACCESS_TOKEN_EXPIRE_MINUTES', '30')
os.environ.setdefault('DEBUG', 'True')
import pytest
from httpx import AsyncClient, ASGITransport
from unittest.mock import AsyncMock
from starlette.testclient import TestClient
from main import app
from api.deps.services import get_room_service, get_auth_service
from signaling.manager import manager as ws_manager


@pytest.fixture
def mock_room_service():
    return AsyncMock()

@pytest.fixture
def mock_auth_service():
    return AsyncMock()

@pytest.fixture
async def client(mock_room_service):
    app.dependency_overrides[get_room_service] = lambda: mock_room_service

    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url='http://test') as async_client:
        yield async_client

    app.dependency_overrides.clear()

@pytest.fixture
def ws_client(mock_room_service, mock_auth_service):
    app.dependency_overrides[get_room_service] = lambda: mock_room_service
    app.dependency_overrides[get_auth_service] = lambda: mock_auth_service

    test_client = TestClient(app)
    yield test_client

    app.dependency_overrides.clear()

@pytest.fixture(autouse=True)
def reset_ws_manager():
    ws_manager.connections.clear()
    yield
    ws_manager.connections.clear()
