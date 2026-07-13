from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from api.dependencies import get_db
from schemas.user import UserCreate, UserResponse
from services.user_service import UserService


router = APIRouter()

@router.post('/', response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register(data: UserCreate, db: AsyncSession = Depends(get_db)):
    user = await UserService.register(db, data)

    if user is not None:
        return user
    else:
        raise HTTPException(status_code=400, detail='User exists')
