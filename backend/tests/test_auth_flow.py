# 'test_auth_flow.py' - тесты аутентификации пользователя.
from datetime import datetime, timezone, timedelta
import pytest
from unittest.mock import AsyncMock, patch
from main import app
from api.deps.services import get_auth_service
from core.security import JwtToken
from models.user import User


PREFIX = '/api/v1/users'
REGISTER_URL = f'{PREFIX}/'
LOGIN_URL = f'{PREFIX}/login'
ME_URL = f'{PREFIX}/me'

def _make_full_user(user_id: int = 42) -> User:
    now = datetime.now(timezone.utc)
    return User(
        user_id=user_id,
        user_name='tester',
        email='tester@example.com',
        is_active=True,
        is_verified=True,
        created_at=now,
        updated_at=now,
        last_login=None,
    )

@pytest.fixture
def mock_auth_service():
    service = AsyncMock()
    app.dependency_overrides[get_auth_service] = lambda: service
    yield service
    app.dependency_overrides.pop(get_auth_service, None)

# Тест регистрации нового пользователя с возвратом токена.
@pytest.mark.asyncio
async def test_register_creates_user_and_returns_real_token(client, mock_auth_service):
    fake_user = _make_full_user(user_id=42)
    mock_auth_service.register.return_value = fake_user

    response = await client.post(
        REGISTER_URL,
        json={'username': 'tester', 'email': 'tester@example.com', 'password': 'StrongPass1'},
    )

    assert response.status_code == 201
    body = response.json()
    assert 'access_token' in body
    assert body['token_type'] == 'bearer'
    assert body['user']['user_name'] == 'tester'

    payload = JwtToken.verify_token(body['access_token'], token_type='access')
    assert payload['user_id'] == 42

# Тест аутентификации с валидным и невалидным токеном.
@pytest.mark.asyncio
async def test_login_then_me_with_valid_and_invalid_token(client, mock_auth_service):
    fake_user = _make_full_user(user_id=42)

    async def fake_login_user(data):
        return JwtToken.create_access_token(fake_user.user_id)

    mock_auth_service.login_user.side_effect = fake_login_user

    login_response = await client.post(
        LOGIN_URL,
        json={'email': 'tester@example.com', 'password': 'StrongPass1'},
    )
    assert login_response.status_code == 200
    access_token = login_response.json()['access_token']

    with patch('api.deps.auth.AuthService.get_current_user', new_callable=AsyncMock) as mocked_get_user:
        mocked_get_user.return_value = fake_user

        me_response = await client.get(ME_URL, headers={'Authorization': f'Bearer {access_token}'})

    assert me_response.status_code == 200
    assert me_response.json()['user_name'] == 'tester'

    me_invalid_response = await client.get(
        ME_URL, headers={'Authorization': 'Bearer this.is.not.a.valid.jwt'}
    )
    assert me_invalid_response.status_code == 401

# Тест на истекший токен.
@pytest.mark.asyncio
async def test_me_with_expired_token_returns_401(client):
    expired_token = JwtToken.create_access_token(42, expires_delta=timedelta(minutes=-5))

    response = await client.get(ME_URL, headers={'Authorization': f'Bearer {expired_token}'})

    assert response.status_code == 401
