from fastapi import HTTPException
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from backend.app.core.config import settings
from backend.app.core.security import get_password_hash, verify_password
from backend.app.db.models.user import (
    User, UserCreate, UsersPublic
)


async def get_user(session: AsyncSession, **filters) -> User | None:
    statement = select(User).filter_by(**filters)
    return (await session.execute(statement)).scalar_one_or_none()


async def create_user(session: AsyncSession, user_create: UserCreate) -> User:
    if await get_user(session=session, email=user_create.email):
        raise HTTPException(
            status_code=409, detail="Пользователь с таким email уже существует")
    hashed_password = get_password_hash(user_create.password)
    user = User(**user_create.model_dump(), hashed_password=hashed_password)
    session.add(user)
    await session.commit()
    await session.refresh(user)
    return user


async def get_users(
    session: AsyncSession,
    skip: int = 0,
    limit: int = settings.DEFAULT_QUERY_LIMIT,
) -> tuple[list[User], int]:
    statement = select(User).offset(skip).limit(limit)
    users = (await session.execute(statement)).scalars().all()
    count = (await session.execute(select(func.count(User.id)))).scalar_one()
    return UsersPublic(data=users, count=count)


async def delete_user(session: AsyncSession, user_id: int) -> None:
    user = await get_user(session=session, id=user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    await session.delete(user)
    await session.commit()


async def authenticate(session: AsyncSession, email: str, password: str) -> User | None:
    db_user = await get_user(session=session, email=email)

    if not db_user:
        return None
    if not verify_password(password, db_user.hashed_password):
        return None
    return db_user


async def update_user(session: AsyncSession, db_user: User, user_in: User) -> User:
    user_data = user_in.model_dump(exclude_unset=True)

    for key, value in user_data.items():
        if key == "password":
            db_user.hashed_password = get_password_hash(value)
        else:
            setattr(db_user, key, value)

    db_user.updated_at = func.now()

    session.add(db_user)
    await session.commit()
    await session.refresh(db_user)
    return db_user


async def change_password(session: AsyncSession, user: User, current_password: str, new_password: str) -> User:
    """Изменение пароля с проверкой текущего пароля"""
    validate_password(
        current_password=current_password,
        new_password=new_password,
        hashed_password=user.hashed_password
    )

    user = await reset_password(session, user, new_password)
    return user


async def reset_password(session: AsyncSession, user: User, new_password: str) -> User:
    """Сброс пароля без проверки текущего"""
    user.hashed_password = get_password_hash(new_password)
    session.add(user)
    await session.commit()
    await session.refresh(user)

    return user


def validate_password(current_password: str, new_password: str, hashed_password: str) -> None:
    if not verify_password(current_password, hashed_password):
        raise HTTPException(
            status_code=400, detail="Incorrect current password")

    if current_password == new_password:
        raise HTTPException(
            status_code=400, detail="New password must differ from the current one")

    if len(new_password) < settings.MIN_PASSWORD_LENGTH:
        raise HTTPException(
            status_code=400,
            detail=f"Password must be at least {settings.MIN_PASSWORD_LENGTH} characters long"
        )
