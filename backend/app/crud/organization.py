from typing import Optional
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from backend.app.core.config import settings
from backend.app.db.models.organization import (
    OrgStatusEnum, Organization, OrganizationCreate,
    OrganizationsPublic
)


async def get_organization(
    session: AsyncSession,
    **filters
) -> Optional[Organization]:
    statement = select(Organization).filter_by(**filters)
    result = await session.execute(statement)
    organization = result.scalar_one_or_none()
    return organization


async def create_organization(
    session: AsyncSession,
    organization_in: OrganizationCreate
) -> Organization:
    organization = Organization(
        **organization_in.model_dump()
    )
    session.add(organization)
    await session.commit()
    await session.refresh(organization)
    return organization


async def update_organization(
    session: AsyncSession,
    organization: Organization,
    organization_in: OrganizationCreate
) -> Organization:
    for key, value in organization_in.model_dump().items():
        setattr(organization, key, value)
    session.add(organization)
    await session.commit()
    await session.refresh(organization)
    return organization


async def delete_organization(
    session: AsyncSession,
    organization: Organization
) -> None:
    await session.delete(organization)
    await session.commit()


async def get_organizations(
    session: AsyncSession,
    skip: int = 0,
    limit: int = settings.DEFAULT_QUERY_LIMIT,
) -> OrganizationsPublic:
    statement = select(Organization).offset(skip).limit(limit)
    organizations = (await session.execute(
        statement
    )).scalars().all()
    count = (await session.execute(
        select(func.count(Organization.id)))
    ).scalar_one()
    return OrganizationsPublic(data=organizations, count=count)

async def confirm_organization(
    session: AsyncSession,
    organization: Organization
) -> Organization:
    organization.status = OrgStatusEnum.approved
    session.add(organization)
    await session.commit()
    await session.refresh(organization)
    return organization


async def reject_organization(
    session: AsyncSession,
    organization: Organization
) -> Organization:
    organization.status = OrgStatusEnum.rejected
    session.add(organization)
    await session.commit()
    await session.refresh(organization)
    return organization
