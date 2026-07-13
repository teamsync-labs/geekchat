from fastapi import APIRouter
from core.config import settings as s


system_router = APIRouter()

@system_router.get('/', tags=['system'])
async def read_root():
    return {'message': f'Hello, this is {s.API_TITLE} v{s.API_VERSION} !'}

@system_router.get('/health', tags=['system'])
async def health_check():
    return {'status': 'OK'}
