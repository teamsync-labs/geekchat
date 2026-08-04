# 'security.py' - сущности безопасности.
import bcrypt
from jwt import encode, decode, DecodeError, ExpiredSignatureError, InvalidTokenError
from datetime import datetime, timedelta, timezone
from core.config import settings as s
from typing import Optional


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
# Где функция print, там будет логирование.
    @staticmethod
    def create_access_token(user_id, expires_delta: Optional[timedelta] = None):
        if expires_delta:
            expire = datetime.now(timezone.utc) + expires_delta
        else:
            expire = datetime.now(timezone.utc) + timedelta(minutes=int(s.ACCESS_TOKEN_EXPIRE_MINUTES))

        print('Creating access token !!!')

        payload = {
            'user_id': user_id,
            'exp': expire,
            'type': 'access'
        }

        token = encode(payload, s.JWT_SECRET, algorithm=s.JWT_ALGORITHM)

        print(f'Access Token is created for {user_id}')

        return token

    @staticmethod
    def verify_token(token, token_type = 'access'):
        try:
            payload = decode(token, s.JWT_SECRET, algorithms=[s.JWT_ALGORITHM])

            if payload.get('type') != token_type:
                print(f'Invalid token type: reference {token_type}, current {payload.get('type')}')

                raise ValueError('Invalid token type')  # error codes ???

            user_id = payload.get('user_id')

            if not user_id:
                raise ValueError('Token is not contains user_id')

            return { 'user_id': user_id }

        except ExpiredSignatureError:
            print('Token has expired')

            raise ValueError('Token has expired')

        except InvalidTokenError as e:
            print(f'False token: {e}')

            raise ValueError('False token')
