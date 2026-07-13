from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from sqlalchemy.ext.declarative import declarative_base
from core.config import settings as s


Base = declarative_base()

engine = create_async_engine(s.DATABASE_URL, echo=True)
AsyncSessionLocal = async_sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

async def init_db():
    async with engine.begin() as connect:
        await connect.run_sync(Base.metadata.create_all)

    print('Database relations created and checks !')