from fastapi import HTTPException
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from backend.app.core.config import settings
from backend.app.core.security import (
    get_password_hash, verify_password
)
from backend.app.crud.exhibition import get_exhibition
from backend.app.utils.logger import log_method_call
from backend.app.db.models import (
    StatusEnum,
    User,
    UserCreate,
    UsersPublic,
    ExhibitionPublic,
    UserExhibitionLike,
)

@log_method_call
async def get_user(
    session: AsyncSession, **filters
) -> User | None:
    statement = select(User).filter_by(**filters)
    result = await session.execute(statement)
    user = result.scalar_one_or_none()
    return user


@log_method_call
async def create_user(
    session: AsyncSession,
    user_create: UserCreate
) -> User:
    if await get_user(
        session=session,
        email=user_create.email
    ):
        raise HTTPException(
            status_code=409,
            detail="Пользователь с таким email уже существует"
        )
    hashed_password = get_password_hash(user_create.password)
    user = User(
        **user_create.model_dump(),
        hashed_password=hashed_password
    )
    session.add(user)
    await session.commit()
    await session.refresh(user)
    return user

@log_method_call
async def get_users(
    session: AsyncSession,
    skip: int = 0,
    limit: int = settings.DEFAULT_QUERY_LIMIT,
) -> UsersPublic:
    statement = select(User).offset(skip).limit(limit)
    users = (await session.execute(
        statement
    )).scalars().all()
    count = (await session.execute(
        select(func.count(User.id)))
    ).scalar_one()
    return UsersPublic(data=users, count=count)


@log_method_call
async def delete_user(
    session: AsyncSession,
    user_in: User
) -> None:
    await session.delete(user_in)
    await session.commit()


@log_method_call
async def authenticate(
    session: AsyncSession,
    email: str, password: str
) -> User | None:
    db_user = await get_user(session=session, email=email)

    if not db_user:
        return None
    if not verify_password(
        password, db_user.hashed_password
    ):
        return None
    return db_user


@log_method_call
async def update_user(
    session: AsyncSession,
    db_user: User,
    user_in: User
) -> User:
    user_data = user_in.model_dump(exclude_unset=True)

    for key, value in user_data.items():
        if key == "password":
            db_user.hashed_password = get_password_hash(value)
        else:
            setattr(db_user, key, value)

    session.add(db_user)
    await session.commit()
    await session.refresh(db_user)
    return db_user


@log_method_call
async def change_password(
    session: AsyncSession, user: User,
    current_password: str, new_password: str
) -> User:
    """Изменение пароля с проверкой текущего пароля"""
    validate_password(
        current_password=current_password,
        new_password=new_password,
        hashed_password=user.hashed_password
    )

    user = await reset_password(session, user, new_password)
    return user


@log_method_call
async def reset_password(
    session: AsyncSession,
    user: User,
    new_password: str
) -> User:
    """Сброс пароля без проверки текущего"""
    user.hashed_password = get_password_hash(new_password)
    session.add(user)
    await session.commit()
    await session.refresh(user)

    return user


@log_method_call
def validate_password(
    current_password: str,
    new_password: str,
    hashed_password: str
) -> None:
    if not verify_password(current_password, hashed_password):
        raise HTTPException(
            status_code=400, detail="Incorrect current password")

    if current_password == new_password:
        raise HTTPException(
            status_code=400,
            detail="New password must differ from the current one"
        )

    if len(new_password) < settings.MIN_PASSWORD_LENGTH:
        raise HTTPException(
            status_code=400,
            detail=f"Password must be at least {settings.MIN_PASSWORD_LENGTH} characters long"
        )


@log_method_call
async def ban_user(
    session: AsyncSession,
    user: User
) -> User:
    """Блокировка пользователя"""
    if user.status == StatusEnum.blocked:
        raise HTTPException(
            status_code=400,
            detail="User is already blocked"
        )
    user.status = StatusEnum.blocked
    session.add(user)
    await session.commit()
    await session.refresh(user)

    return user


@log_method_call
async def unban_user(
    session: AsyncSession,
    user: User
) -> User:
    """Разблокировка пользователя"""
    if user.status == StatusEnum.active:
        raise HTTPException(
            status_code=400,
            detail="User is already active"
        )
    user.status = StatusEnum.active
    session.add(user)
    await session.commit()
    await session.refresh(user)

    return user


@log_method_call
async def get_liked_exhibitions(
    session: AsyncSession,
    user_id: str,
    skip: int = 0,
    limit: int = settings.DEFAULT_QUERY_LIMIT
) -> list[User]:
    liked_exhibitions_ids = (await session.execute(
        select(UserExhibitionLike).where(
            UserExhibitionLike.user_id == user_id
        )
    )).scalars().all()
    exhibitions = []
    for exhibition in liked_exhibitions_ids:
        exhibition = await get_exhibition(
            session=session,
            id=exhibition.exhibition_id
        )
        exhibition.is_liked_by_current_user = True
        exhibitions.append(exhibition)
    return exhibitions


@log_method_call
async def like_exhibition(
    session: AsyncSession,
    exhibition_id: str,
    user_id: str
) -> ExhibitionPublic:
    exhibition = await get_exhibition(
        session=session,
        id=exhibition_id
    )
    if not exhibition:
        raise HTTPException(
            status_code=404,
            detail="Exhibition not found"
        )

    user_exhibition_like = UserExhibitionLike(
        exhibition_id=exhibition.id,
        user_id=user_id
    )
    session.add(user_exhibition_like)
    await session.commit()
    await session.refresh(user_exhibition_like)

    exhibition.is_liked_by_current_user = True
    return ExhibitionPublic.model_validate(exhibition)


@log_method_call
async def unlike_exhibition(
    session: AsyncSession,
    exhibition_id: str,
    user_id: str
) -> ExhibitionPublic:
    exhibition = await get_exhibition(
        session=session,
        id=exhibition_id
    )
    if not exhibition:
        raise HTTPException(
            status_code=404,
            detail="Exhibition not found"
        )

    user_exhibition_like = await session.execute(
        select(UserExhibitionLike).where(
            UserExhibitionLike.exhibition_id == exhibition.id,
            UserExhibitionLike.user_id == user_id
        )
    )
    user_exhibition_like = user_exhibition_like.scalar_one_or_none()
    if not user_exhibition_like:
        raise HTTPException(
            status_code=404,
            detail="Like not found"
        )

    await session.delete(user_exhibition_like)
    await session.commit()

    exhibition.is_liked_by_current_user = False
    return ExhibitionPublic.model_validate(exhibition)

