from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from dependencies import get_db
from schemas.user import UserCreate, UserResponse
from fastapi.responses import JSONResponse
from services.user_service import create_user


router = APIRouter(prefix="/users", tags=["users"])
'''
@router.get('/')
async def read_users():
    return JSONResponse(content={'username': 'TestUser1'})'''

@router.post('/register', response_model=UserResponse)      # status code ??
async def register_user(user: UserCreate, db: AsyncSession = Depends(get_db)):
    return await create_user(db, user)
