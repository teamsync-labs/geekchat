# 'security.py' - сущности безопасности.
import bcrypt
from jwt import encode, decode, DecodeError, ExpiredSignatureError, InvalidTokenError
from datetime import datetime, timedelta, timezone
from core.config import settings as s
from typing import Optional
from log_system.logger_entities import user_logger as ul
from core.program_codes import UserState, LogLevel


class UserPassword:
    @staticmethod
    def hash_password(password):
        salt = bcrypt.gensalt(rounds=12)
        hashed = bcrypt.hashpw(password.encode('utf-8'), salt)

        return hashed.decode('utf-8')

    @staticmethod
    def verify_password(plain_password, hashed_password):
        return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))


class JwtToken:
    @staticmethod
    def create_access_token(user_id, expires_delta: Optional[timedelta] = None):
        if expires_delta:
            expire = datetime.now(timezone.utc) + expires_delta
        else:
            expire = datetime.now(timezone.utc) + timedelta(minutes=s.ACCESS_TOKEN_EXPIRE_MINUTES)

        token = encode(
            payload={'user_id': user_id, 'exp': expire, 'type': 'access'},
            key=s.JWT_SECRET,
            algorithm=s.JWT_ALGORITHM
        )

        ul.create_log_line(UserState.CODE_5010, LogLevel.INFO, f'user-id: {user_id}')

        return token

    @staticmethod
    def verify_token(token, token_type = 'access'):
        try:
            payload = decode(token, s.JWT_SECRET, algorithms=[s.JWT_ALGORITHM])

            if payload.get('type') != token_type:
                ul.create_log_line(UserState.CODE_5020, LogLevel.ERROR,
                                   f'reference {token_type}, current {payload.get('type')}')

                raise ValueError

            user_id = payload.get('user_id')

            if not user_id:
                ul.create_log_line(UserState.CODE_5021, LogLevel.ERROR)

                raise ValueError

            return { 'user_id': user_id }

        except ExpiredSignatureError:
            ul.create_log_line(UserState.CODE_5022, LogLevel.ERROR)

            raise ValueError

        except InvalidTokenError as e:
            ul.create_log_line(UserState.CODE_5023, LogLevel.ERROR, f'{e}')

            raise ValueError
