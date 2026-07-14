import uuid
from fastapi import APIRouter, Depends, status, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from api.dependencies import get_db
from schemas.room import RoomResponse, RoomCreate
from services.room_service import RoomService
from crud.room import get_room


router = APIRouter()
# test user id=1 !!!!!
# current_user: User = Depends(get_current_user)  JWT
@router.post('/', response_model=RoomResponse, status_code=status.HTTP_201_CREATED)
async def create_room(data: RoomCreate, db: AsyncSession = Depends(get_db)):
    return await RoomService.create(db, data, creator_id=1)

@router.get('/{room_id}', status_code=status.HTTP_200_OK)
async def check_room_availability(room_id: str, db: AsyncSession = Depends(get_db)):
    try:
        room_uuid = uuid.UUID(room_id)
    except ValueError:
        raise HTTPException(status_code=400, detail='Unknown UUID format')

    room = await get_room(db, room_uuid)

    if room is None:
        raise HTTPException(status_code=404, detail='Room not found',)

    availability = await RoomService.is_room_joinable(room)

    if availability != True:
        raise HTTPException(status_code=410, detail=availability)
