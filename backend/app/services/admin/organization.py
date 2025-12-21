import uuid

from backend.app.api.dependencies.pagination import PaginationDep
from backend.app.crud.admin import organization as admin_organization_crud
from backend.app.db.models.organization import (
    Organization,
    OrganizationPublic,
    OrganizationsPublic,
    OrgStatusEnum,
)
from backend.app.utils.logger import log_method_call
from sqlalchemy.ext.asyncio import AsyncSession


@log_method_call
async def read_organizations(
    session: AsyncSession,
    pagination: PaginationDep,
    status: OrgStatusEnum | None = None,
    search: str | None = None,
) -> OrganizationsPublic:
    return OrganizationsPublic(
        data=(
            organizations := await admin_organization_crud.read_organizations(
                session=session,
                pagination=pagination,
                status=status,
                search=search,
            )
        ),
        count=len(organizations),
    )


@log_method_call
async def read_organization(
    session: AsyncSession,
    organization_id: uuid.UUID,
) -> OrganizationPublic | None:
    return OrganizationPublic.model_validate(
        await admin_organization_crud.read_organization(
            session=session,
            organization_id=organization_id,
        ),
    )


@log_method_call
async def approve_organization(
    session: AsyncSession,
    organization: Organization,
) -> OrganizationPublic:
    return OrganizationPublic.model_validate(
        await admin_organization_crud.approve_organization(
            session=session,
            organization_id=organization.id,
        ),
    )
