# 'main.py' - инициализация приложения.
from contextlib import asynccontextmanager
from fastapi import FastAPI
from db.session import init_db, engine
from core.config import settings as s
from api.v1.router import api_router
from api.system.router import system_router
from signaling.ws_rooms import router as ws_router
from core.program_codes import SystemState, LogLevel
from log_system.logger_entities import system_logger as sl


@asynccontextmanager
async def lifespan(app: FastAPI):
    sl.create_log_line(SystemState.CODE_1001, LogLevel.INFO)
    await init_db()
    sl.create_log_line(SystemState.CODE_1003, LogLevel.INFO)

    yield

    sl.create_log_line(SystemState.CODE_1002, LogLevel.INFO)
    await engine.dispose()
    sl.create_log_line(SystemState.CODE_1004, LogLevel.INFO)


app = FastAPI(title=s.API_TITLE, version=s.API_VERSION, lifespan=lifespan)

app.include_router(system_router)
app.include_router(api_router, prefix='/api/v1')
app.include_router(ws_router, prefix='/ws', tags=['ws'])
