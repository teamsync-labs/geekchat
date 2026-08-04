from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi import Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from api.deps.db import get_db
from core.security import JwtToken
from services.auth import AuthService


security = HTTPBearer()

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security),
                           db: AsyncSession = Depends(get_db)):

    token = credentials.credentials

    try:
        payload = JwtToken.verify_token(token, token_type='access')

        user_id = payload.get('user_id')
    except ValueError as e:
        print(f'Check token error: {e}')

        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(e),
            headers={'WWW-Authenticate': 'Bearer'}
        )

    auth_service = AuthService(db)
    try:
        user = await auth_service.get_current_user(token)
    except ValueError as e:
        print(f'Get user error: {e}')

        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(e),
            headers={'WWW-Authenticate': 'Bearer'}
        )

    return user
