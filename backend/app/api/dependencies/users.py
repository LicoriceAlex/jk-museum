from typing import Annotated
import uuid
from fastapi import Depends, HTTPException
from jwt.exceptions import InvalidTokenError
import jwt
from pydantic import ValidationError

from backend.app.api.deps.common import SessionDep, TokenDep
from backend.app.core import security
from backend.app.core.config import settings
from backend.app.crud import user as user_crud
from backend.app.db.models.user import RoleEnum, User
from backend.app.db.schemas import TokenPayload


async def get_current_user(
    session: SessionDep,
    token: TokenDep
) -> User:
    try:
        payload = jwt.decode(
            token,
            settings.SECRET_KEY,
            algorithms=[security.ALGORITHM]
        )
        token_data = TokenPayload(**payload)
    except (InvalidTokenError, ValidationError):
        raise HTTPException(
            status_code=403,
            detail="Could not validate credentials",
        )
    user = await session.get(User, token_data.sub)
    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )
    return user


async def get_user_or_404(
    session: SessionDep,
    user_id: uuid.UUID
) -> User:
    user = await user_crud.get_user(
        session=session,
        id=user_id
    )
    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )
    return user


CurrentUser = Annotated[User, Depends(get_current_user)]
UserOr404 = Annotated[User, Depends(get_user_or_404)]


async def get_current_admin(
    current_user: CurrentUser
) -> User:
    if not current_user.role == RoleEnum.admin:
        raise HTTPException(
            status_code=403,
            detail="The user doesn't have enough privileges"
        )
    return current_user


async def get_current_admin_or_moderator(
    current_user: CurrentUser
) -> User:
    if not current_user.role == RoleEnum.admin or current_user.role == RoleEnum.moderator:
        raise HTTPException(
            status_code=403,
            detail="The user doesn't have enough privileges"
        )
    return current_user


async def verify_user_ownership(
    current_user: CurrentUser,
    user_id: uuid.UUID
) -> None:
    """Проверяет, что текущий пользователь имеет доступ к ресурсу"""
    if current_user.id != user_id:
        raise HTTPException(
            status_code=403,
            detail="Not authorized to access this resource"
        )
        
async def verify_role_permission(
    current_user: CurrentUser,
    user: User
) -> None:
    """Проверяет, что текущий пользователь имеет доступ к ресурсу"""
    if current_user.role < user.role:
        raise HTTPException(
            status_code=403,
            detail="Not authorized to access this resource"
        )