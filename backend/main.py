# 'main.py' - инициализация приложения.
from contextlib import asynccontextmanager
from fastapi import FastAPI
from db.session import init_db, engine
from core.config import settings as s
from api.v1.router import api_router
from api.system.router import system_router
from signaling.ws_rooms import router as ws_router
from core.program_codes import SystemState, LogLevel
from log_system.log_entities import SystemLoggingEntity

logger = SystemLoggingEntity()

@asynccontextmanager
async def lifespan(app: FastAPI):
    await logger.create_log_line('CODE_1001', LogLevel.INFO, SystemState.CODE_1001)
    await init_db()
    await logger.create_log_line('CODE_1003', LogLevel.INFO, SystemState.CODE_1003)

    yield

    await logger.create_log_line('CODE_1002', LogLevel.INFO, SystemState.CODE_1002)
    await engine.dispose()
    await logger.create_log_line('CODE_1004', LogLevel.INFO, SystemState.CODE_1004)


app = FastAPI(title=s.API_TITLE, version=s.API_VERSION, lifespan=lifespan)

app.include_router(system_router)
app.include_router(api_router, prefix='/api/v1')
app.include_router(ws_router, prefix='/ws', tags=['ws'])
