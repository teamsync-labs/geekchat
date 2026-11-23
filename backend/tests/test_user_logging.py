# 'test_user_logging.py' - покрытие тестами логирования скоупа пользователя.
import logging
from datetime import datetime, timedelta, timezone
from types import SimpleNamespace
from unittest.mock import AsyncMock, MagicMock
import jwt
import pytest
from core.config import settings
from core.program_codes import UserState
from core.security import JwtToken, UserPassword
from models.user import User
from services.auth import AuthService


PREFIX = '/api/v1/users'
REGISTER_URL = f'{PREFIX}/'
LOGIN_URL = f'{PREFIX}/login'

PASSWORD = 'StrongPass1'
LOGIN_DATA = SimpleNamespace(email='tester@example.com', password=PASSWORD)

# ---------------------------------------------------------------- helpers

@pytest.fixture
def mock_db_session():
    session = AsyncMock()
    session.execute.return_value = MagicMock()
    session.execute.return_value.scalars.return_value.first.return_value = None
    session.add = MagicMock()
    return session

@pytest.fixture
def logged(caplog):
    caplog.set_level(logging.INFO)

    def find(code):
        prefix = f'{code} - '
        return [r for r in caplog.records if r.getMessage().startswith(prefix)]

    return find

def assert_logged(logged, code, level):
    records = logged(code)
    assert records, f'in logfile is not log with code: {code}'
    assert records[0].levelno == level, (
        f'code {code}: level {records[0].levelname}, expected {logging.getLevelName(level)}'
    )

def assert_logged_with_web_code(caplog, web_code, level):
    suffix = f'web_code: {web_code}'
    records = [r for r in caplog.records if r.getMessage().endswith(suffix)]
    assert records, f'in logfile is not log with {suffix!r}'
    assert records[0].levelno == level, (
        f'{suffix}: level {records[0].levelname}, expected {logging.getLevelName(level)}'
    )

def _user(**overrides):
    fields = dict(user_id=42, user_name='tester', is_active=True,
                  password_hash='hash', last_login=None)
    fields.update(overrides)
    return SimpleNamespace(**fields)

def _db_returns(session, user):
    session.execute.return_value.scalars.return_value.first.return_value = user

def _token(**overrides):
    payload = {
        'user_id': 42,
        'exp': datetime.now(timezone.utc) + timedelta(minutes=5),
        'type': 'access'
    }

    payload.update(overrides)
    return jwt.encode(payload, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM)

def _no_password_check(monkeypatch, result: bool):
    monkeypatch.setattr(UserPassword, 'verify_password', staticmethod(lambda p, h: result))

# ------------------------------------------------- 1. JwtToken (без БД)

def test_create_access_token_logs_info_with_user_id(logged):
    JwtToken.create_access_token(42)

    records = logged(UserState.CODE_5010)
    assert len(records) == 1
    assert records[0].levelno == logging.INFO
    assert 'user-id: 42' in records[0].getMessage()

def test_verify_valid_token_logs_no_errors(caplog):
    caplog.set_level(logging.INFO)

    assert JwtToken.verify_token(_token()) == {'user_id': 42}
    assert not [r for r in caplog.records if r.levelno >= logging.ERROR]

@pytest.mark.parametrize(
    'make_token, code',
    [
        pytest.param(lambda: _token(exp=datetime.now(timezone.utc) - timedelta(minutes=5)),
                     UserState.CODE_5022, id='expired'),
        pytest.param(lambda: _token(type='refresh'),
                     UserState.CODE_5020, id='wrong-type'),
        pytest.param(lambda: _token(user_id=None),
                     UserState.CODE_5021, id='no-user-id'),
        pytest.param(lambda: 'not.a.jwt',
                     UserState.CODE_5023, id='garbage'),
        pytest.param(lambda: jwt.encode({'user_id': 42, 'type': 'access'}, 'x' * 32,
                                        algorithm=settings.JWT_ALGORITHM),
                     UserState.CODE_5023, id='foreign-signature')
    ],
)
def test_verify_token_failure_logs_matching_error_code(logged, make_token, code):
    with pytest.raises(ValueError):
        JwtToken.verify_token(make_token())

    assert_logged(logged, code, logging.ERROR)

# --------------------------------------------- 2. AuthService (мок БД)

async def test_login_unknown_email_logs_5204(mock_db_session, logged):
    _db_returns(mock_db_session, None)

    with pytest.raises(ValueError):
        await AuthService(mock_db_session).login_user(LOGIN_DATA)

    assert_logged(logged, UserState.CODE_5204, logging.ERROR)

async def test_login_inactive_user_logs_5205(mock_db_session, logged):
    _db_returns(mock_db_session, _user(is_active=False))

    with pytest.raises(ValueError):
        await AuthService(mock_db_session).login_user(LOGIN_DATA)

    assert_logged(logged, UserState.CODE_5205, logging.ERROR)

async def test_login_wrong_password_logs_5206_and_never_logs_the_password(
    mock_db_session, logged, caplog, monkeypatch
):
    _db_returns(mock_db_session, _user())
    _no_password_check(monkeypatch, False)

    with pytest.raises(ValueError):
        await AuthService(mock_db_session).login_user(LOGIN_DATA)

    assert_logged(logged, UserState.CODE_5206, logging.ERROR)
    assert PASSWORD not in caplog.text
    mock_db_session.commit.assert_not_awaited()

async def test_login_success_logs_5101_and_returns_valid_token(mock_db_session, logged, monkeypatch):
    user = _user()
    _db_returns(mock_db_session, user)
    _no_password_check(monkeypatch, True)

    token = await AuthService(mock_db_session).login_user(LOGIN_DATA)

    assert JwtToken.verify_token(token)['user_id'] == 42
    assert user.last_login is not None and user.last_login.tzinfo is not None
    mock_db_session.commit.assert_awaited_once()
    assert_logged(logged, UserState.CODE_5101, logging.INFO)

async def test_get_current_user_with_bad_token_logs_5023_and_5024(mock_db_session, logged):
    with pytest.raises(ValueError):
        await AuthService(mock_db_session).get_current_user('garbage')

    assert_logged(logged, UserState.CODE_5023, logging.ERROR)
    assert_logged(logged, UserState.CODE_5024, logging.ERROR)

async def test_get_current_user_missing_in_db_logs_5202(mock_db_session, logged):
    _db_returns(mock_db_session, None)

    with pytest.raises(ValueError):
        await AuthService(mock_db_session).get_current_user(_token())

    assert_logged(logged, UserState.CODE_5202, logging.ERROR)

async def test_get_current_user_inactive_logs_5203(mock_db_session, logged):
    _db_returns(mock_db_session, _user(is_active=False))

    with pytest.raises(ValueError):
        await AuthService(mock_db_session).get_current_user(_token())

    assert_logged(logged, UserState.CODE_5203, logging.ERROR)

async def test_get_current_user_success_returns_user_without_error_logs(mock_db_session, caplog):
    caplog.set_level(logging.INFO)
    user = _user()
    _db_returns(mock_db_session, user)

    assert await AuthService(mock_db_session).get_current_user(_token()) is user
    assert not [r for r in caplog.records if r.levelno >= logging.ERROR]

async def test_register_existing_email_returns_none_and_adds_nothing(mock_db_session):
    mock_db_session.add = MagicMock()
    _db_returns(mock_db_session, _user())

    result = await AuthService(mock_db_session).register(
        SimpleNamespace(username='tester', email='tester@example.com', password=PASSWORD)
    )

    assert result is None
    mock_db_session.add.assert_not_called()

async def test_register_new_user_stores_hash_not_plain_password(mock_db_session):
    mock_db_session.add = MagicMock()
    _db_returns(mock_db_session, None)

    await AuthService(mock_db_session).register(
        SimpleNamespace(username='tester', email='tester@example.com', password=PASSWORD)
    )

    added = mock_db_session.add.call_args.args[0]
    assert isinstance(added, User)
    assert added.password_hash != PASSWORD
    assert UserPassword.verify_password(PASSWORD, added.password_hash)
    mock_db_session.commit.assert_awaited_once()

# ------------------------------------------ 3. Эндпоинты (мок БД, реальный сервис)

async def test_register_duplicate_email_returns_400_and_logs_5200(client, mock_db_session, logged):
    mock_db_session.add = MagicMock()
    _db_returns(mock_db_session, _user())

    response = await client.post(
        REGISTER_URL,
        json={'username': 'tester', 'email': 'tester@example.com', 'password': PASSWORD}
    )

    assert response.status_code == 400
    assert_logged(logged, UserState.CODE_5200, logging.WARNING)
    assert not logged(UserState.CODE_5207), 'email duplicate — is not a critical incident'

async def test_register_unexpected_error_returns_500_and_logs_5207_critical(
    client, mock_db_session, logged):

    mock_db_session.execute.side_effect = RuntimeError('database is down')

    response = await client.post(
        REGISTER_URL,
        json={'username': 'tester', 'email': 'tester@example.com', 'password': PASSWORD}
    )

    assert response.status_code == 500
    assert_logged(logged, UserState.CODE_5207, logging.CRITICAL)

async def test_login_unknown_user_returns_401_and_logs_error_with_web_code_401(
    client, mock_db_session, logged, caplog):

    _db_returns(mock_db_session, None)

    response = await client.post(LOGIN_URL, json={'email': 'tester@example.com', 'password': PASSWORD})

    assert response.status_code == 401
    assert_logged(logged, UserState.CODE_5204, logging.ERROR)
    assert_logged_with_web_code(caplog, 401, logging.ERROR)

async def test_login_unexpected_error_returns_500_and_logs_critical_with_web_code_500(
    client, mock_db_session, caplog, logged):

    mock_db_session.execute.side_effect = RuntimeError('database is down')

    response = await client.post(LOGIN_URL, json={'email': 'tester@example.com', 'password': PASSWORD})

    assert response.status_code == 500
    assert_logged_with_web_code(caplog, 500, logging.CRITICAL)
