from typing import Tuple
import uuid
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from backend.app.db.models import (
    UserOrganization,
    UserOrganizationCreate,
    User
)
from backend.app.utils.logger import log_method_call


@log_method_call
async def create_organization_user(
    session: AsyncSession,
    user_organization_in: UserOrganizationCreate
) -> UserOrganization:
    user_organization = UserOrganization(**user_organization_in.dict())
    session.add(user_organization)
    await session.commit()
    await session.refresh(user_organization)

    return UserOrganization.model_validate(user_organization)


@log_method_call
async def get_organization_user(
    session: AsyncSession,
    user_id: uuid.UUID,
    organization_id: uuid.UUID,
) -> UserOrganization | None:
    statement = select(UserOrganization).filter_by(
        user_id=user_id,
        organization_id=organization_id,
    )
    result = await session.execute(statement)
    organization_user = result.scalar_one_or_none()
    return organization_user


@log_method_call
async def get_organization_members(
    session: AsyncSession,
    organization_id: uuid.UUID,
) -> Tuple[User, UserOrganization]:
    statement = select(
        User,
        UserOrganization
    ).join(
        UserOrganization,
        User.id == UserOrganization.user_id
    ).filter(
        UserOrganization.organization_id == organization_id
    )
    result = await session.execute(statement)
    organization_members = result.all()
    return organization_members
