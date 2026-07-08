from fastapi import FastAPI


app = FastAPI(title='GeekChat API')

@app.get('/health')
async def health_check():
    return {'status': 'OK'}
