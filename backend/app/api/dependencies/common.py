from contextlib import asynccontextmanager
from enum import Enum
from typing import Annotated

from backend.app.core.config import settings
from backend.app.db.database import async_engine
from fastapi import Depends
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.ext.asyncio import AsyncSession

reusable_oauth2 = OAuth2PasswordBearer(tokenUrl=f"{settings.API_V1_STR}/login/access-token")


async def get_db():
    async with AsyncSession(async_engine) as session:
        yield session


@asynccontextmanager
async def get_db_session():
    session = AsyncSession(async_engine)
    try:
        yield session
    finally:
        await session.close()


class Variable(str, Enum): ...


class SortOrder(Variable):
    ASC = "asc"
    DESC = "desc"


SessionDep = Annotated[AsyncSession, Depends(get_db)]
TokenDep = Annotated[str, Depends(reusable_oauth2)]
