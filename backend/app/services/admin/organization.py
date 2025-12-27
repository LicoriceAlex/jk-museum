import uuid

from backend.app.api.dependencies.pagination import PaginationDep
from backend.app.crud.admin import organization as admin_organization_crud
from backend.app.db.models.organization import (
    Organization,
    OrganizationPublic,
    OrganizationsPublic,
    OrgStatusEnum,
)
from backend.app.db.models.user import User
from backend.app.services import admin_action as admin_action_service
from backend.app.services import (
    organization_moderation_comment as organization_moderation_comment_service,
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
async def update_organization_status(
    session: AsyncSession,
    organization: Organization,
    user: User,
    new_status: OrgStatusEnum,
    comment: str | None,
) -> OrganizationPublic:
    updated_organization = await admin_organization_crud.update_organization_status(
        session=session,
        organization_id=organization.id,
        user_id=user.id,
        comment=comment,
        new_status=new_status,
    )
    _ = await admin_action_service.create_admin_action(
        session=session,
        target_id=organization.id,
        author_id=user.id,
        comment=f"Organization status changed from {organization.status.value} to {new_status.value}",
    )
    _ = await organization_moderation_comment_service.create_organization_moderation_comment(
        session=session,
        organization_id=organization.id,
        author_id=user.id,
        comment=comment,
    )
    return OrganizationPublic.model_validate(
        updated_organization,
    )
