from uuid import UUID

from backend.app.api.dependencies.exhibition.filters import FilterParams, SortParams
from backend.app.core.config import settings
from backend.app.crud.exhibition import get_exhibitions
from backend.app.db.models.exhibition import (
    Exhibition,
    ExhibitionPublic,
    ExhibitionsPublicWithPagination,
)
from backend.app.db.models.organization import (
    MyOrganization,
    Organization,
    OrganizationCreate,
    OrganizationPublic,
    OrganizationPublicShort,
    OrganizationResponse,
    OrganizationsPublic,
    OrgStatusEnum,
)
from backend.app.db.models.user_organization import UserOrganization
from backend.app.utils.logger import log_method_call
from fastapi import HTTPException
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession


@log_method_call
async def get_organization(session: AsyncSession, **filters) -> Organization | None:
    statement = select(Organization).filter_by(**filters)
    result = await session.execute(statement)
    organization = result.scalar_one_or_none()
    return organization


@log_method_call
async def create_organization(
    session: AsyncSession,
    organization_in: OrganizationCreate,
) -> OrganizationPublicShort:
    if await get_organization(session=session, email=organization_in.email):
        raise HTTPException(
            status_code=409,
            detail="An organization with this email already exists.",
        )
    if await get_organization(session=session, name=organization_in.name):
        raise HTTPException(
            status_code=409,
            detail="An organization with this name already exists.",
        )
    organization = Organization(
        **organization_in.model_dump(),
    )
    session.add(organization)
    await session.commit()
    await session.refresh(organization)
    return OrganizationPublicShort(**organization.model_dump())


@log_method_call
async def update_organization(
    session: AsyncSession,
    organization: Organization,
    organization_in: OrganizationCreate,
) -> Organization:
    for key, value in organization_in.model_dump().items():
        setattr(organization, key, value)
    session.add(organization)
    await session.commit()
    await session.refresh(organization)
    return organization


@log_method_call
async def update_organization_profile(
    session: AsyncSession,
    organization: Organization,
    organization_in: OrganizationCreate,
):
    for key, value in organization_in.model_dump().items():
        setattr(organization, key, value)
    session.add(organization)
    await session.commit()
    await session.refresh(organization)
    return organization


@log_method_call
async def delete_organization(session: AsyncSession, organization: Organization) -> Organization:
    await session.delete(organization)
    await session.commit()
    return organization


@log_method_call
async def get_organizations(
    session: AsyncSession,
    skip: int = 0,
    limit: int = settings.DEFAULT_QUERY_LIMIT,
) -> OrganizationsPublic:
    statement = select(Organization).offset(skip).limit(limit)
    organizations = (await session.execute(statement)).scalars().all()
    # Преобразуем к OrganizationPublicShort
    orgs_short = [OrganizationPublicShort(**org.model_dump()) for org in organizations]
    count = (await session.execute(select(func.count(Organization.id)))).scalar_one()
    return OrganizationsPublic(data=orgs_short, count=count)


@log_method_call
async def confirm_organization(session: AsyncSession, organization: Organization) -> Organization:
    organization.status = OrgStatusEnum.approved
    session.add(organization)
    await session.commit()
    await session.refresh(organization)
    return organization


@log_method_call
async def reject_organization(session: AsyncSession, organization: Organization) -> Organization:
    organization.status = OrgStatusEnum.rejected
    session.add(organization)
    await session.commit()
    await session.refresh(organization)
    return organization


@log_method_call
async def get_organization_profile_with_exhibitions(
    session: AsyncSession,
    organization_id: UUID,
    current_user_id: UUID,
    skip: int = 0,
    limit: int = 10,
) -> OrganizationPublic | None:
    org = await get_organization(session, id=organization_id)
    if not org:
        return None
    exhibition_objs = (
        await get_exhibitions(
            session=session,
            filters=FilterParams(organization_id=organization_id),
            sort=SortParams(sort_by="likes_count", sort_order="desc"),
            current_user_id=current_user_id,
        )
    ).data
    exhibitions = [
        ExhibitionPublic(
            **exh.model_dump(),
        )
        for exh in exhibition_objs
    ]
    count_stmt = select(func.count(Exhibition.id)).where(
        Exhibition.organization_id == organization_id,
        Exhibition.status == "published",
    )
    count = (await session.execute(count_stmt)).scalar_one()
    exhibitions_paginated = ExhibitionsPublicWithPagination(
        data=exhibitions,
        count=count,
        skip=skip,
        limit=limit,
    )
    return OrganizationPublic(**org.model_dump(), exhibitions=exhibitions_paginated)


@log_method_call
async def get_my_organizations(
    session: AsyncSession,
    user_id: UUID,
) -> list[MyOrganization]:
    statement = (
        select(
            Organization,
        )
        .add_columns(
            UserOrganization,
        )
        .where(
            UserOrganization.user_id == user_id,
            UserOrganization.organization_id == Organization.id,
        )
        .join(
            UserOrganization,
            Organization.id == UserOrganization.organization_id,
        )
    )
    result = await session.execute(statement)
    rows = result.all()
    items = [
        OrganizationResponse(organization=organization, membership=membership)
        for organization, membership in rows
    ]
    return MyOrganization(items=items)
