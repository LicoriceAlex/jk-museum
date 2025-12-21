import uuid
from collections.abc import Sequence

from backend.app.api.dependencies.pagination import PaginationDep
from backend.app.db.models.organization import Organization, OrgStatusEnum
from backend.app.utils.logger import log_method_call
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession


@log_method_call
async def read_organizations(
    session: AsyncSession,
    pagination: PaginationDep,
    status: OrgStatusEnum | None = None,
    search: str | None = None,
) -> Sequence[Organization]:
    return (
        (
            await session.execute(
                select(
                    Organization,
                )
                .where(
                    Organization.status == status if status else True,
                )
                .offset(pagination.skip)
                .limit(pagination.limit),
            )
        )
        .scalars()
        .all()
    )


@log_method_call
async def read_organization(
    session: AsyncSession,
    organization_id: uuid.UUID,
) -> Organization | None:
    return await session.get(Organization, organization_id)


@log_method_call
async def approve_organization(
    session: AsyncSession,
    organization_id: uuid.UUID,
) -> Organization:
    organization = await session.get(Organization, organization_id)
    organization.status = OrgStatusEnum.approved
    session.add(organization)
    await session.commit()
    await session.refresh(organization)
    return organization
