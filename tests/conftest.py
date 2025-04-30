import pytest
import pytest_asyncio
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker
from sqlmodel import SQLModel
from backend.app.core.config import settings


@pytest_asyncio.fixture(scope="function")
async def test_engine():
    engine = create_async_engine(settings.test_db, echo=False)
    yield engine
    await engine.dispose()

@pytest.fixture(scope="function")
def session_factory(test_engine):
    return sessionmaker(
        autocommit=False,
        autoflush=False,
        bind=test_engine,
        class_=AsyncSession,
        expire_on_commit=False
    )

@pytest_asyncio.fixture(scope="function")
async def setup_db(test_engine):
    async with test_engine.begin() as conn:
        await conn.run_sync(SQLModel.metadata.create_all)
    yield


@pytest_asyncio.fixture(scope="function")
async def db_session(session_factory, setup_db):
    async with session_factory() as session:
        yield session
        await session.rollback()
        async with session.begin():
            for table in reversed(SQLModel.metadata.sorted_tables):
                await session.execute(table.delete())
