# 'rooms.py' - эндпоинты комнаты.
from uuid import UUID
from fastapi import APIRouter, Depends, status, HTTPException
from api.deps.services import get_room_service
from api.deps.auth import get_current_user
from schemas.room import RoomCreate, RoomPreviewResponse, RoomJoinLinkResponse
from services.room import RoomService
from models.user import User
from core.program_codes import RoomState as rs


router = APIRouter()

@router.post('/', response_model=RoomJoinLinkResponse, status_code=status.HTTP_201_CREATED)
async def create_room(data: RoomCreate, service: RoomService = Depends(get_room_service),
                      current_user: User = Depends(get_current_user)):

    return await service.create(data, current_user.user_id)

@router.get('/{room_id}', response_model=RoomPreviewResponse, status_code=status.HTTP_200_OK)
async def check_room_availability(room_id: UUID, service: RoomService = Depends(get_room_service)):
    room = await service.get_room_by_id(room_id)

    if room is None:
        raise HTTPException(status_code=404, detail=rs.CODE_9001)

    availability_status = await service.check_room_joinable(room)

    if availability_status is not True:
        raise HTTPException(status_code=410, detail=availability_status)

    return room
