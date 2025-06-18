from typing import Optional
from uuid import UUID
from fastapi import HTTPException
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from backend.app.api.dependencies.exhibition.filters import FilterParams, SortParams
from backend.app.core.config import settings
from backend.app.core.security import get_password_hash, verify_password
from backend.app.crud.exhibition import get_exhibitions
from backend.app.db.models.organization import (
    OrgStatusEnum, Organization, OrganizationCreate,
    OrganizationsPublic, OrganizationPublic, OrganizationPublicShort
)
from backend.app.db.models.exhibition import Exhibition, ExhibitionsPublicWithPagination
from sqlalchemy import select
from backend.app.db.models.tag import TagPublic
from backend.app.db.models.exhibition_participant import ExhibitionParticipant
from backend.app.db.models.exhibition import ExhibitionPublic


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
    if await get_organization(
        session=session,
        email=organization_in.email
    ):
        raise HTTPException(
            status_code=409,
            detail="An organization with this email already exists."
        )
    if await get_organization(
        session=session,
        name=organization_in.name
    ):
        raise HTTPException(
            status_code=409,
            detail="An organization with this name already exists."
        )
    
    hashed_password = get_password_hash(organization_in.password)
    organization = Organization(
        **organization_in.model_dump(),
        hashed_password=hashed_password,
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


async def update_organization_profile(
    session: AsyncSession,
    organization: Organization,
    organization_in: OrganizationCreate
):
    for key, value in organization_in.model_dump().items():
        setattr(organization, key, value)
    session.add(organization)
    await session.commit()
    await session.refresh(organization)
    return organization


async def delete_organization(
    session: AsyncSession,
    organization: Organization
) -> Organization:
    await session.delete(organization)
    await session.commit()
    return organization


async def get_organizations(
    session: AsyncSession,
    skip: int = 0,
    limit: int = settings.DEFAULT_QUERY_LIMIT,
) -> OrganizationsPublic:
    statement = select(Organization).offset(skip).limit(limit)
    organizations = (await session.execute(
        statement
    )).scalars().all()
    # Преобразуем к OrganizationPublicShort
    orgs_short = [OrganizationPublicShort(
        **org.model_dump()) for org in organizations]
    count = (await session.execute(
        select(func.count(Organization.id)))
    ).scalar_one()
    return OrganizationsPublic(data=orgs_short, count=count)


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


async def get_organization_profile_with_exhibitions(
    session: AsyncSession,
    organization_id: UUID,
    current_user_id: UUID,
    skip: int = 0,
    limit: int = 10,
) -> Optional[OrganizationPublic]:
    org = await get_organization(session, id=organization_id)
    if not org:
        return None
    exhibition_objs = (await get_exhibitions(
        session=session,
        filters=FilterParams(organization_id=organization_id),
        sort=SortParams(
            sort_by='likes_count',
            sort_order='desc'
        ),
        current_user_id=current_user_id,)).data
    print(exhibition_objs)
    exhibitions = [
        ExhibitionPublic(
            **exh.model_dump(),
        )
        for exh in exhibition_objs
    ]
    count_stmt = select(func.count(Exhibition.id)).where(
        Exhibition.organization_id == organization_id,
        Exhibition.status == 'published'
    )
    count = (await session.execute(count_stmt)).scalar_one()
    exhibitions_paginated = ExhibitionsPublicWithPagination(
        data=exhibitions,
        count=count,
        skip=skip,
        limit=limit
    )
    return OrganizationPublic(
        **org.model_dump(),
        exhibitions=exhibitions_paginated
    )
    
async def authenticate(
    session: AsyncSession,
    email: str, password: str
) -> Organization | None:
    db_organization = await get_organization(session=session, email=email)

    if not db_organization:
        return None
    if not verify_password(
        password, db_organization.hashed_password
    ):
        return None
    return db_organization
