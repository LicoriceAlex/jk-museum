import uuid
from collections.abc import Sequence

from backend.app.api.dependencies.pagination import PaginationDep
from backend.app.db.models.organization import Organization, OrgStatusEnum
from backend.app.db.models.organization_moderation_comment import OrganizationModerationComment
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
                .where(
                    Organization.name.startswith(search) if search else True,
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
async def update_organization_status(
    session: AsyncSession,
    organization_id: uuid.UUID,
    author_id: uuid.UUID,
    new_status: OrgStatusEnum,
    comment: str | None,
):
    organization = await session.get(Organization, organization_id)
    organization.status = new_status
    session.add(organization)
    organization_moderation_comment = OrganizationModerationComment(
        entity_id=organization.id,
        author_id=author_id,
        text=comment,
    )
    session.add(organization_moderation_comment)
    await session.commit()
    await session.refresh(organization)
    return organization
