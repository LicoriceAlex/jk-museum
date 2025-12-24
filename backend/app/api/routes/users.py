import uuid
from typing import Any

from backend.app.api.dependencies.common import (
    SessionDep,
)
<<<<<<< HEAD
from backend.app.db.models import (
    UserCreate,
    UserPublic,
    UserRegister,
    UsersPublic,
    UserUpdate,
    ExhibitionsPublic
)
from backend.app.db.schemas import (
    Message, UpdatePassword,
=======
from backend.app.api.dependencies.pagination import PaginationDep
from backend.app.api.dependencies.users import (
    CurrentUser,
    UserOr404,
    get_current_admin_or_moderator,
    verify_role_permission,
    verify_user_ownership,
)
from backend.app.crud import user as user_crud
from backend.app.db.models.exhibition import ExhibitionsPublic
from backend.app.db.models.user import (
    UserCreate,
    UserPublic,
    UserRegister,
    UsersPublic,
    UserUpdate,
>>>>>>> origin/main
)
from backend.app.db.schemas import (
    Message,
    UpdatePassword,
)
from fastapi import APIRouter, Depends, HTTPException

router = APIRouter()


@router.get(
    "/",
    response_model=UsersPublic,
    dependencies=[Depends(get_current_admin_or_moderator)],
)
async def read_users(
    session: SessionDep,
    pagination: PaginationDep,
) -> Any:
    users = await user_crud.get_users(session=session, skip=pagination.skip, limit=pagination.limit)
    return users


@router.get("/me/profile", response_model=UserPublic)
async def read_user_me(current_user: CurrentUser) -> Any:
    """
    Retrieve information about the current authenticated user.
    """
    return current_user


@router.put("/me/profile", response_model=UserPublic)
async def update_user_me(
    session: SessionDep,
    user_in: UserUpdate,
    current_user: CurrentUser,
) -> Any:
    """
    Update the current authenticated user's information.
    """

    user = await user_crud.update_user(session=session, db_user=current_user, user_in=user_in)
    return user


@router.delete("/me", response_model=Message)
async def delete_user_me(session: SessionDep, current_user: CurrentUser) -> Any:
    """`
    Delete the current authenticated user.
    """
    await user_crud.delete_user(session=session, user_in=current_user)
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
        raise HTTPException(status_code=400, detail=str(e)) from e


@router.get("/{user_id}", response_model=UserPublic)
async def read_user_by_id(
    user: UserOr404,
) -> Any:
    """
    Retrieve a user by their ID.
    """
    return user


@router.put("/{user_id}", dependencies=[Depends(verify_user_ownership)], response_model=UserPublic)
async def update_user(
    session: SessionDep,
    user_in: UserUpdate,
    db_user: UserOr404,
) -> Any:
    """
    Update a user's information.
    """

    user = await user_crud.update_user(session=session, db_user=db_user, user_in=user_in)
    return user


@router.get(
    "/me/liked-exhibitions",
)
async def get_liked_exhibitions(
    session: SessionDep,
    current_user: CurrentUser,
    pagination: PaginationDep,
) -> Any:
    """
    Retrieve a list of exhibitions liked by the current authenticated user.
    """
    liked_exhibitions = await user_crud.get_liked_exhibitions(
        session=session,
        user_id=current_user.id,
        skip=pagination.skip,
        limit=pagination.limit,
    )
    return ExhibitionsPublic(data=liked_exhibitions, count=len(liked_exhibitions))


@router.post(
    "/me/liked-exhibitions/{exhibition_id}",
)
async def like_exhibition(
    session: SessionDep,
    current_user: CurrentUser,
    exhibition_id: uuid.UUID,
) -> Any:
    """
    Like an exhibition for the current authenticated user.
    """
    await user_crud.like_exhibition(
        session=session,
        user_id=current_user.id,
        exhibition_id=exhibition_id,
    )
    return Message(message="Exhibition liked successfully")


@router.delete(
    "/me/liked-exhibitions/{exhibition_id}",
)
async def unlike_exhibition(
    session: SessionDep,
    current_user: CurrentUser,
    exhibition_id: uuid.UUID,
) -> Any:
    """
    Unlike an exhibition for the current authenticated user.
    """
    await user_crud.unlike_exhibition(
        session=session,
        user_id=current_user.id,
        exhibition_id=exhibition_id,
    )
    return Message(message="Exhibition unliked successfully")


@router.patch("/me/account/password", response_model=Message)
async def update_password_me(
    session: SessionDep,
    body: UpdatePassword,
    current_user: CurrentUser,
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


@router.delete("/{user_id}", dependencies=[Depends(verify_user_ownership)], response_model=Message)
async def delete_user(
    session: SessionDep,
    user_in: UserOr404,
) -> Any:
    """
    Delete a user by their ID.
    """

    await user_crud.delete_user(session=session, user_in=user_in)
    return Message(message="User deleted successfully")


@router.patch(
    "/{user_id}/ban",
    dependencies=[Depends(get_current_admin_or_moderator), Depends(verify_role_permission)],
    response_model=Message,
)
async def ban_user(session: SessionDep, db_user: UserOr404) -> Any:
    """
    Ban a user by their ID.
    """

    await user_crud.ban_user(session=session, user=db_user)

    return Message(message="User banned successfully")


@router.patch(
    "/{user_id}/unban",
    dependencies=[Depends(get_current_admin_or_moderator), Depends(verify_role_permission)],
    response_model=Message,
)
async def unban_user(session: SessionDep, db_user: UserOr404) -> Any:
    """
    Unban a user by their ID.
    """

    await user_crud.unban_user(session=session, user=db_user)

    return Message(message="User unbanned successfully")
