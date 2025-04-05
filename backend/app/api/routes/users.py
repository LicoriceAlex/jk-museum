import uuid
from typing import Any
from fastapi import APIRouter, Depends, HTTPException, Query

from backend.app.api.dependencies.users import (
    UserOr404,
    CurrentUser,
    get_current_admin_or_moderator,
    verify_user_ownership,
    verify_role_permission,
)
from backend.app.crud import user as user_crud
from backend.app.api.dependencies.common import (
    SessionDep,
)
from backend.app.core.config import settings
from backend.app.db.models import (
    User, UserCreate, UserPublic,
    UserRegister, UsersPublic
)
from backend.app.db.models.user import UserUpdate
from backend.app.db.schemas import (
    Message, UpdatePassword,
)


router = APIRouter()


@router.get(
    "/",
    response_model=UsersPublic,
    dependencies=[Depends(get_current_admin_or_moderator)],
)
async def read_users(
    session: SessionDep,
    skip: int = Query(0, ge=0),
    limit: int = Query(
        default=settings.DEFAULT_QUERY_LIMIT,
        ge=1, le=100
    ),
) -> Any:
    users = await user_crud.get_users(
        session=session,
        skip=skip,
        limit=limit
    )
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
    if user_in.email and user_in.email != current_user.email:
        existing_user = await user_crud.get_user(
            session=session,
            email=user_in.email
        )
        if existing_user:
            raise HTTPException(
                status_code=400, detail="Email already registered")

    user = await user_crud.update_user(
        session=session,
        db_user=current_user,
        user_in=user_in
    )
    return user


@router.delete("/me", response_model=Message)
async def delete_user_me(
    session: SessionDep,
    current_user: CurrentUser
) -> Any:
    """`
    Delete the current authenticated user.
    """
    await user_crud.delete_user(
        session=session,
        user_in=current_user
    )
    return Message(message="User deleted successfully")


@router.post("/signup", response_model=UserPublic)
async def register_user(
    session: SessionDep,
    user_in: UserRegister
) -> Any:
    """
    Register a new user.
    """
    try:
        user_create = UserCreate.model_validate(user_in)
        user = await user_crud.create_user(
            session=session,
            user_create=user_create
        )
        return user
    except ValueError as e:
        raise HTTPException(
            status_code=400,
            detail=str(e)
        )


@router.get(
    "/{user_id}",
    response_model=UserPublic
)
async def read_user_by_id(
    user: UserOr404,
) -> Any:
    """
    Retrieve a user by their ID.
    """
    return user


@router.put(
    "/{user_id}",
    dependencies=[Depends(verify_user_ownership)],
    response_model=UserPublic
)
async def update_user(
    session: SessionDep,
    user_in: UserUpdate,
    db_user: UserOr404,
) -> Any:
    """
    Update a user's information.
    """

    user = await user_crud.update_user(
        session=session,
        db_user=db_user,
        user_in=user_in
    )
    return user


@router.patch("/me/password", response_model=Message)
async def update_password_me(
    session: SessionDep,
    body: UpdatePassword,
    current_user: CurrentUser
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


@router.delete(
    "/{user_id}",
    dependencies=[Depends(verify_user_ownership)],
    response_model=Message
)
async def delete_user(
    session: SessionDep,
    user_in: UserOr404,
) -> Any:
    """
    Delete a user by their ID.
    """

    await user_crud.delete_user(
        session=session,
        user_in=user_in
    )
    return Message(message="User deleted successfully")


@router.patch(
    "/{user_id}/ban",
    dependencies=[
        Depends(get_current_admin_or_moderator),
        Depends(verify_role_permission)
    ],
    response_model=Message
)
async def ban_user(
    session: SessionDep,
    db_user: UserOr404
) -> Any:
    """
    Ban a user by their ID.
    """

    await user_crud.ban_user(
        session=session,
        user=db_user
    )

    return Message(message="User banned successfully")


@router.patch(
    "/{user_id}/unban",
    dependencies=[
        Depends(get_current_admin_or_moderator),
        Depends(verify_role_permission)
    ],
    response_model=Message
)
async def unban_user(
    session: SessionDep,
    db_user: UserOr404
) -> Any:
    """
    Unban a user by their ID.
    """

    await user_crud.unban_user(
        session=session,
        user=db_user
    )

    return Message(message="User unbanned successfully")
