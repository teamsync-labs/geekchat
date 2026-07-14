from contextlib import asynccontextmanager
from fastapi import FastAPI
from db.session import init_db, engine
from core.config import settings as s
from api.v1.router import api_router
from api.system.router import system_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    print('App starting ...')
    await init_db()
    print('Database initialized')

    yield

    print('App ending ...')
    await engine.dispose()
    print('Database connection closed')


app = FastAPI(title=s.API_TITLE, version=s.API_VERSION, lifespan=lifespan)
app.include_router(system_router)
app.include_router(api_router, prefix='/api/v1')
