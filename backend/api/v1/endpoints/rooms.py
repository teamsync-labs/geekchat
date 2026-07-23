from uuid import UUID
from fastapi import APIRouter, Depends, status, HTTPException
from api.deps.services import get_room_service
from schemas.room import RoomCreate, RoomPreviewResponse, RoomJoinLinkResponse
from services.room import RoomService


router = APIRouter()
# test user id=1 !!!!!
# current_user: User = Depends(get_current_user)  JWT
@router.post('/', response_model=RoomJoinLinkResponse, status_code=status.HTTP_201_CREATED)
async def create_room(data: RoomCreate, service: RoomService = Depends(get_room_service)):
    return await service.create(data, creator_id=1)

@router.get('/{room_id}', response_model=RoomPreviewResponse, status_code=status.HTTP_200_OK)
async def check_room_availability(room_id: UUID, service: RoomService = Depends(get_room_service)):
    room = await service.get_room_by_id(room_id)

    if room is None:
        raise HTTPException(status_code=404, detail='ROOM_NOT_FOUND')

    availability = await service.check_room_joinable(room)

    if availability is not True:
        raise HTTPException(status_code=410, detail=availability)

    return room