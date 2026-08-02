# 'users.py' - эндпоинты пользователей.
from fastapi import APIRouter, HTTPException, status, Depends
from schemas.auth import UserRegister, UserResponse
from api.deps.services import get_auth_service
from services.auth import AuthService
from core.error_codes import CODE_5001


router = APIRouter()

@router.post('/', response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register(data: UserRegister, service: AuthService = Depends(get_auth_service)):
    user = await service.register(data)

    if user is not None:
        return user
    else:
        raise HTTPException(status_code=400, detail=CODE_5001)
