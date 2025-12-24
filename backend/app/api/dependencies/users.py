import uuid
from typing import Annotated

import jwt
from backend.app.api.dependencies.common import SessionDep, TokenDep
from backend.app.api.dependencies.organizations import OrganizationOr404
from backend.app.core import security
from backend.app.core.config import settings
from backend.app.crud import user as user_crud
from backend.app.crud import user_organization as user_organization_crud
from backend.app.db.models.user import (
    RoleEnum,
    User,
)
from backend.app.db.models.user_organization import (
    UserOrganization,
    UserOrganizationEnum,
)
from backend.app.db.schemas import TokenPayload
from backend.app.utils.logger import log_method_call
from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from jwt.exceptions import InvalidTokenError
from pydantic import ValidationError


@log_method_call
async def get_current_user(session: SessionDep, token: TokenDep) -> User:
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[security.ALGORITHM])
        token_data = TokenPayload(**payload)
    except (InvalidTokenError, ValidationError) as e:
        raise HTTPException(
            status_code=403,
            detail="Could not validate credentials",
        ) from e
    user = await session.get(User, token_data.sub)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@log_method_call
async def get_optional_user(
    session: SessionDep,
    token: str | None = Depends(OAuth2PasswordBearer(tokenUrl="login", auto_error=False)),
) -> User | None:
    if not token:
        return None
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[security.ALGORITHM])
        token_data = TokenPayload(**payload)
    except ValidationError:
        return None
    return await session.get(User, token_data.sub)


@log_method_call
async def get_user_or_404(session: SessionDep, user_id: uuid.UUID) -> User:
    user = await user_crud.get_user(session=session, id=user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


UserOr404 = Annotated[User, Depends(get_user_or_404)]
CurrentUser = Annotated[User, Depends(get_current_user)]
OptionalCurrentUser = Annotated[User | None, Depends(get_optional_user)]


@log_method_call
async def get_current_admin(current_user: CurrentUser) -> User:
    if not current_user.role == RoleEnum.admin:
        raise HTTPException(status_code=403, detail="The user doesn't have enough privileges")
    return current_user


@log_method_call
async def get_current_admin_or_moderator(current_user: CurrentUser) -> User:
    if not current_user.role == RoleEnum.admin or current_user.role == RoleEnum.moderator:
        raise HTTPException(status_code=403, detail="The user doesn't have enough privileges")
    return current_user


@log_method_call
async def verify_user_ownership(current_user: CurrentUser, user_id: uuid.UUID) -> None:
    """Проверяет, что текущий пользователь имеет доступ к ресурсу"""
    if current_user.id != user_id:
        raise HTTPException(status_code=403, detail="Not authorized to access this resource")


@log_method_call
async def verify_role_permission(current_user: CurrentUser, user: User) -> None:
    """Проверяет, что текущий пользователь имеет доступ к ресурсу"""
    if current_user.role < user.role:
        raise HTTPException(status_code=403, detail="Not authorized to access this resource")


@log_method_call
async def get_current_active_organization_member(
    session: SessionDep,
    organization: OrganizationOr404,
    current_user: CurrentUser,
) -> UserOrganization:
    user_org = await user_organization_crud.get_organization_user(
        session=session,
        user_id=current_user.id,
        organization_id=organization.id,
    )
    if not user_org or user_org.status != UserOrganizationEnum.active:
        raise HTTPException(
            status_code=403,
            detail="Only active organization members can add new members.",
        )
    return user_org


CurrentActiveOrganizationMember = Annotated[
    UserOrganization,
    Depends(get_current_active_organization_member),
]
