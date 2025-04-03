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
from backend.app.db.models.user import UserUpdate
from backend.app.db.schemas import (
    Message, UpdatePassword,
)


router = APIRouter()


@router.get("/", response_model=UsersPublic)
async def read_users(
    session: SessionDep,
    skip: int = Query(0, ge=0),
    limit: int = Query(default=settings.DEFAULT_QUERY_LIMIT, ge=1, le=100),
) -> Any:
    users = await user_crud.get_users(session=session, skip=skip, limit=limit)
    return users


@router.get("/me", response_model=UserPublic)
async def read_user_me(current_user: CurrentUser) -> Any:
    """
    Retrieve information about the current authenticated user.
    """
    return current_user


@router.put("/me", response_model=UserPublic)
async def update_user_me(
    session: SessionDep,
    user_in: UserUpdate,
    current_user: CurrentUser,
) -> Any:
    """
    Update the current authenticated user's information.
    """
    db_user = await user_crud.get_user(session=session, id=current_user.id)
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    if user_in.email and user_in.email != db_user.email:
        existing_user = await user_crud.get_user(session=session, email=user_in.email)
        if existing_user:
            raise HTTPException(status_code=400, detail="Email already registered")

    user = await user_crud.update_user(session=session, db_user=db_user, user_in=user_in)
    return user


@router.delete("/me", response_model=Message)
async def delete_user_me(session: SessionDep, current_user: CurrentUser) -> Any:
    """`
    Delete the current authenticated user.
    """
    await user_crud.delete_user(session=session, user_id=current_user.id)
    return Message(message="User deleted successfully")


@router.post("/signup", response_model=UserPublic)
async def register_user(session: SessionDep, user_in: UserRegister) -> Any:
    """
    Register a new user.
    """
    try:
        user_create = UserCreate.model_validate(user_in)
        user = await user_crud.create_user(session=session, user_create=user_create)
        return user
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/{user_id}", response_model=UserPublic)
async def read_user_by_id(session: SessionDep, user_id: uuid.UUID) -> Any:
    """
    Retrieve a user by their ID.
    """
    user = await user_crud.get_user(session=session, id=user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@router.put("/{user_id}", response_model=UserPublic)
async def update_user(
    session: SessionDep,
    user_id: uuid.UUID,
    user_in: UserUpdate,
    current_user: CurrentUser,
) -> Any:
    """
    Update a user's information.
    """
    if current_user.id != user_id:
        raise HTTPException(status_code=403, detail="Not authorized to update this user")
    
    db_user = await user_crud.get_user(session=session, id=user_id)
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    
    user = await user_crud.update_user(session=session, db_user=db_user, user_in=user_in)
    return user


@router.patch("/me/password", response_model=Message)
async def update_password_me(
    session: SessionDep, body: UpdatePassword, current_user: CurrentUser
) -> Any:
    """
    Update the password of the current authenticated user.
    """
    await user_crud.change_password(
        session=session,
        user=current_user,
        current_password=body.current_password,
        new_password=body.new_password,
    )
    return Message(message="Password updated successfully")

@router.delete("/{user_id}", response_model=Message)
async def delete_user(
    session: SessionDep,
    user_id: uuid.UUID,
    current_user: CurrentUser,
) -> Any:
    """
    Delete a user by their ID.
    """
    if current_user.id != user_id:
        raise HTTPException(status_code=403, detail="Not authorized to delete this user")
    
    await user_crud.delete_user(session=session, user_id=user_id)
    return Message(message="User deleted successfully")
