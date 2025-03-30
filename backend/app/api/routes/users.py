import datetime
import json
import uuid
from typing import Any, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import desc, or_, update
from sqlmodel import col, delete, func, select

from backend.app.crud import user as user_crud
from backend.app.api.deps import (
    CurrentUser,
    SessionDep,
    get_current_admin,
    get_current_user,
)
from backend.app.core.config import settings
from backend.app.core.security import get_password_hash, verify_password
from backend.app.db.models import (
    User, UserCreate, UserPublic,
    UserRegister, UsersPublic
)
from backend.app.db.schemas import (
    Message, UpdatePassword,
)


router = APIRouter()


@router.get(
    "/",
    response_model=UsersPublic,
)
async def read_users(
    session: SessionDep,
    skip: int = 0,
    limit: int = 100,
) -> Any:
    """
    Retrieve users
    """
    count_statement = select(func.count()).select_from(User)
    statement = select(User).offset(skip).limit(limit)

    count = (await session.execute(count_statement)).scalar_one_or_none()
    users = (await session.execute(statement)).scalars().all()

    return UsersPublic(data=users, count=count)


@router.get("/me", response_model=UserPublic)
def read_user_me(current_user: CurrentUser) -> Any:
    """
    Get current user.
    """
    return current_user

@router.delete("/me", response_model=Message)
async def delete_user_me(session: SessionDep, current_user: CurrentUser) -> Any:
    """
    Delete own user.
    """
    await session.delete(current_user)
    await session.commit()
    return Message(message="User deleted successfully")


@router.post("/signup", response_model=UserPublic)
async def register_user(session: SessionDep, user_in: UserRegister) -> Any:
    """
    Create new user without the need to be logged in.
    """
    user = await user_crud.get_user_by_email(session=session, email=user_in.email)
    if user:
        raise HTTPException(
            status_code=400,
            detail="The user with this email already exists in the system",
        )

    user_create = UserCreate.model_validate(user_in)
    user = await user_crud.create_user(session=session, user_create=user_create)
    return user


@router.get(
    "/{user_id}",
    response_model=UserPublic,
)
async def read_user_by_id(
    session: SessionDep,
    user_id: uuid.UUID,
) -> Any:
    """
    Retrieve user by id.
    """
    user = await session.get(User, user_id)

    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user



@router.patch("/me/password", response_model=Message)
async def update_password_me(
    *, session: SessionDep, body: UpdatePassword, current_user: CurrentUser
) -> Any:
    """
    Update own password.
    """
    if not await verify_password(body.current_password, current_user.hashed_password):
        raise HTTPException(status_code=400, detail="Incorrect password")
    if body.current_password == body.new_password:
        raise HTTPException(
            status_code=400, detail="New password cannot be the same as the current one"
        )
    hashed_password = await get_password_hash(body.new_password)
    current_user.hashed_password = hashed_password
    session.add(current_user)
    await session.commit()
    return Message(message="Password updated successfully")
