from fastapi import FastAPI
from app.routers.users import router as users_router


app = FastAPI(title='GeekChat API')

@app.get('/health')
async def health_check():
    return {'status': 'OK'}

app.include_router(users_router)
