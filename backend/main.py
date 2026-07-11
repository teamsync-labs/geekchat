from contextlib import asynccontextmanager
from fastapi import FastAPI
from db.session import init_db, engine
from routers.users import router as users_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    print('App starting ...')
    await init_db()
    print('Database initialized')

    yield

    print('App ending ...')
    await engine.dispose()
    print('Database connection closed')

app = FastAPI(title='GeekChat API', version='1.0.0', lifespan=lifespan)
app.include_router(users_router)

@app.get('/')
async def read_root():
    return {'message': 'Hello, this is Geek Chat API'}

@app.get('/health')
async def health_check():
    return {'status': 'OK'}
