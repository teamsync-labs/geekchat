from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.schemas.user import UserCreate
from app.services.user_service import create_user
from app.dependencies import get_db
from fastapi.responses import JSONResponse


router = APIRouter(prefix="/users", tags=["users"])

@router.get('/')
async def read_users():
    return JSONResponse(content={'username': 'TestUser1'})

# Может нужно валидировать пароль по количеству и типу символов перед вычислением его хэша ?
@router.post('/', response_model=UserCreate)
#async def create_new_user(user: UserCreate, db: Session = Depends(get_db)):
    #return await create_user(db, user)

async def create_user(user: UserCreate):  # test POST
    return JSONResponse(content=[{ 'username': user.username }, {'password': user.password }])
