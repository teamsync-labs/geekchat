from fastapi import APIRouter
from api.v1.endpoints import users, rooms


api_router = APIRouter()

api_router.include_router(users.router, prefix='/users', tags=['users'])
api_router.include_router(rooms.router, prefix='/rooms', tags=['rooms'])
