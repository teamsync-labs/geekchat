# 'users.py' - эндпоинты пользователей.
from fastapi import APIRouter, HTTPException, status, Depends
from schemas.auth import UserRegister, UserResponse
from api.deps.services import get_auth_service
from services.auth import AuthService
from core.security import JwtToken
from core.program_codes import UserState as us


router = APIRouter()

@router.post('/', response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register(data: UserRegister, service: AuthService = Depends(get_auth_service)):
    try:
        user = await service.register(data)

        if user is not None:
            access_token = JwtToken.create_access_token(user.id)
            # create refresh

            return {
                "user": user,
                "access_token": access_token,
                # refresh
                "token_type": "bearer"
            }

        else:
            print(f'Create user error: {e}')  # logging !!

            raise HTTPException(status_code=400, detail=us.CODE_5001)

    except Exception as e:
    logger.error(f"Критическая ошибка при регистрации: {e}")
    raise HTTPException(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        detail="Ошибка при регистрации"
    )
