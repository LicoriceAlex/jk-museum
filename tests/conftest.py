import pytest
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker
from sqlmodel import SQLModel
from backend.app.core.config import settings
from backend.app.db.models import Organization, User, AdminAction


@pytest.fixture(scope="function")  # Делаем движок уникальным для каждого теста
async def test_engine():
    engine = create_async_engine(settings.test_db, echo=True)
    yield engine
    await engine.dispose()  # Асинхронно очищаем движок

@pytest.fixture(scope="function")
def session_factory(test_engine):
    return sessionmaker(
        autocommit=False,
        autoflush=False,
        bind=test_engine,
        class_=AsyncSession,
        expire_on_commit=False
    )

@pytest.fixture(scope="function")
async def db_session(session_factory, test_engine):
    async with test_engine.begin() as conn:
        await conn.run_sync(SQLModel.metadata.drop_all)  # Очищаем перед тестом
        await conn.run_sync(SQLModel.metadata.create_all)  # Создаем таблицы
    async with session_factory() as session:
        yield session
        await session.rollback()