# 'users.py' - эндпоинты пользователей.
from fastapi import APIRouter, HTTPException, status, Depends
from api.deps.auth import get_current_user
from schemas.auth import UserRegister, UserWithToken, UserLogin, UserResponse, TokenResponse
from api.deps.services import get_auth_service
from services.auth import AuthService
from core.security import JwtToken
from models.user import User
from log_system.logger_entities import user_logger as ul
from core.program_codes import UserState, LogLevel


router = APIRouter()

@router.post('/', response_model=UserWithToken, status_code=status.HTTP_201_CREATED)
async def register(data: UserRegister, service: AuthService = Depends(get_auth_service)):
    try:
        user = await service.register(data)

        if user is not None:
            ul.create_log_line(UserState.CODE_5100, LogLevel.INFO, f'user-id: {user.user_id}', status.HTTP_201_CREATED)

            access_token = JwtToken.create_access_token(user.user_id)
            # create refresh
            return {
                'user': user,
                'access_token': access_token,
                # refresh
                'token_type': 'bearer'
            }

        else:
            ul.create_log_line(UserState.CODE_5200, LogLevel.WARNING, f'user-id: {user.user_id}',
                               status.HTTP_400_BAD_REQUEST)

            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=UserState.CODE_5200)

    except Exception as e:
        ul.create_log_line(UserState.CODE_5207, LogLevel.CRITICAL, f'{e}', status.HTTP_500_INTERNAL_SERVER_ERROR)

        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

@router.post('/login', response_model=TokenResponse)
async def login(data: UserLogin, service: AuthService = Depends(get_auth_service)):
    try:
        access_token = await service.login_user(data)

        return {
            'access_token': access_token
            #"refresh_token": refresh_token,
        }

    except ValueError as e:
        ul.create_log_line(UserState.CODE_5208, LogLevel.ERROR, f'{e}', status.HTTP_401_UNAUTHORIZED)

        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=str(e))

    except Exception as e:
        ul.create_log_line(UserState.CODE_5208, LogLevel.CRITICAL, f'{e}', status.HTTP_500_INTERNAL_SERVER_ERROR)

        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

@router.get('/me', response_model=UserResponse)
async def get_me(current_user: User = Depends(get_current_user)):
    return current_user
