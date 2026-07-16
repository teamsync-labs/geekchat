from fastapi import APIRouter, HTTPException, status, Depends
from schemas.user import UserCreate, UserResponse
from api.deps.services import get_user_service
from services.user_service import UserService


router = APIRouter()

@router.post('/', response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register(data: UserCreate, service: UserService = Depends(get_user_service)):
    user = await service.register(data)

    if user is not None:
        return user
    else:
        raise HTTPException(status_code=400, detail='User exists')
