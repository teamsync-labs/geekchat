# 'main.py' - инициализация приложения.
from contextlib import asynccontextmanager
from fastapi import FastAPI
from db.session import init_db, engine
from core.config import settings as s
from api.v1.router import api_router
from api.system.router import system_router
from signaling.ws_rooms import router as ws_router
from log_system.system_logging_entity import SystemLoggingEntity
from core.program_codes import LogLevel as l


logger = SystemLoggingEntity()

@asynccontextmanager
async def lifespan(app: FastAPI):
    print('App starting ...')
    await logger.create_log_line('CODE_XXX', log_level=l.INFO, description='App Start')
    await init_db()
    print('Database initialized')

    yield

    print('App ending ...')
    await engine.dispose()
    print('Database connection closed')


app = FastAPI(title=s.API_TITLE, version=s.API_VERSION, lifespan=lifespan)

app.include_router(system_router)
app.include_router(api_router, prefix='/api/v1')
app.include_router(ws_router, prefix='/ws', tags=['ws'])
