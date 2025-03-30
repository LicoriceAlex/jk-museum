from typing import Any
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from backend.app.core.security import get_password_hash, verify_password
from backend.app.db.models import User, UserCreate


async def create_user(*, session: AsyncSession, user_create: UserCreate) -> User:
    db_obj = User.model_validate(
        user_create,
        update={
            "hashed_password": await get_password_hash(user_create.password),
        }
    )
    session.add(db_obj)
    await session.commit()
    await session.refresh(db_obj)
    return db_obj


async def get_user_by_email(session: AsyncSession, email: str) -> User | None:
    statement = select(User).where(User.email == email)
    session_user = (await session.execute(statement)).scalar_one_or_none()
    return session_user


async def authenticate(session: AsyncSession, email: str, password: str) -> User | None:
    db_user = await get_user_by_email(session=session, email=email)

    if not db_user:
        return None
    if not await verify_password(password, db_user.hashed_password):
        return None
    return db_user


async def update_user(session: AsyncSession, user_in: User, db_user: User) -> Any:
    user_data = user_in.model_dump(exclude_unset=True)
    extra_data = {
        "updated_at": user_in.updated_at.replace(tzinfo=None) if user_in.updated_at else None,
        "created_at": user_in.created_at.replace(tzinfo=None) if user_in.created_at else None,
    }

    if "password" in user_data:
        password = user_data["password"]
        hashed_password = await get_password_hash(password)
        extra_data["hashed_password"] = hashed_password

    db_user.sqlmodel_update(user_data, update=extra_data)
    session.add(db_user)
    await session.commit()
    await session.refresh(db_user)
    return db_user
