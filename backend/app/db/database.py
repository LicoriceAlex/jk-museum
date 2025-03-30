from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker
from sqlalchemy.ext.declarative import declarative_base
from backend.app.core.config import settings


async_engine = create_async_engine(settings.async_db)
Session = async_sessionmaker(async_engine)

Base = declarative_base()