from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from api.dependencies import get_db
from schemas.room import RoomResponse, RoomCreate
from services.room_service import RoomService


router = APIRouter()

@router.post("/", response_model=RoomResponse, status_code=status.HTTP_201_CREATED)
async def create_room(data: RoomCreate, db: AsyncSession = Depends(get_db)):
    return await RoomService.create(db, data, creator_id=1)    # test user id
    




# current_user: User = Depends(get_current_user)  JWT