import uuid

from backend.app.api.dependencies.common import SessionDep
from backend.app.api.dependencies.organizations import OrganizationOr404
from backend.app.api.dependencies.users import get_current_admin
from backend.app.api.routes.exhibitions import PaginationDep
from backend.app.db.models.organization import (
    OrganizationPublic,
    OrganizationsPublic,
    OrgStatusEnum,
)
from backend.app.services.admin import organization as admin_organization_service
from fastapi import APIRouter, Depends, HTTPException

router = APIRouter()


@router.get("/", response_model=OrganizationsPublic, dependencies=[Depends(get_current_admin)])
async def read_organizations(
    session: SessionDep,
    pagination: PaginationDep,
    status: OrgStatusEnum | None = None,
    search: str | None = None,
) -> OrganizationsPublic:
    return await admin_organization_service.read_organizations(session, pagination, status, search)


@router.get(
    "/{organization_id}",
    response_model=OrganizationPublic,
    dependencies=[Depends(get_current_admin)],
)
async def read_organization(
    organization_id: uuid.UUID,
    session: SessionDep,
) -> OrganizationPublic:
    if (
        organization := await admin_organization_service.read_organization(session, organization_id)
    ) is None:
        raise HTTPException(status_code=404, detail="Organization not found")
    return organization


@router.patch(
    "/{organization_id}/approve",
)
async def approve_organization(
    session: SessionDep,
    organization: OrganizationOr404,
):
    """
    Confirm an organization.
    """
    organization = await admin_organization_service.approve_organization(
        session=session,
        organization=organization,
    )
    return organization


@router.patch(
    "/{organization_id}/request-revision",
)
async def request_organization_revision(
    session: SessionDep,
    organization: OrganizationOr404,
):
    raise NotImplementedError("This endpoint is not implemented yet")
