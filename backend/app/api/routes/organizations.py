from fastapi import APIRouter, Depends, Query

from backend.app.api.dependencies.common import SessionDep
from backend.app.api.dependencies.organizations import OrgnizationOr404
from backend.app.api.dependencies.pagination import PaginationDep
from backend.app.core.config import settings
from backend.app.crud import organization as organization_crud
from backend.app.db.models.organization import (
    Organization, OrganizationCreate, OrganizationPublic, OrganizationsPublic
)

router = APIRouter()


@router.post(
    "/",
    response_model=OrganizationPublic,
)
async def create_organization(
    organization_in: OrganizationCreate,
    session: SessionDep,
):
    """
    Create a new organization.
    """
    organization = await organization_crud.create_organization(
        organization_in=organization_in,
        session=session
    )
    return organization


@router.patch(
    "/{organization_id}/confirm",
    response_model=OrganizationPublic,
)
async def confirm_organization(
    session: SessionDep,
    organization: OrgnizationOr404,
):
    """
    Confirm an organization.
    """
    organization = await organization_crud.confirm_organization(
        session=session,
        organization=organization
    )
    return organization


@router.patch(
    "/{organization_id}/reject",
    response_model=OrganizationPublic,
)
async def reject_organization(
    session: SessionDep,
    organization: OrgnizationOr404,
):
    """
    Reject an organization.
    """
    organization = await organization_crud.reject_organization(
        session=session,
        organization=organization
    )
    return organization


@router.get(
    "/",
    response_model=OrganizationsPublic,
)
async def get_organizations(
    session: SessionDep,
    pagination: PaginationDep
):
    """
    Get organizations.
    """
    organizations = await organization_crud.get_organizations(
        session=session,
        skip=pagination.skip,
        limit=pagination.limit
    )
    return organizations


@router.get(
    "/{organization_id}",
    response_model=OrganizationPublic,
)
async def get_organization(
    organization: OrgnizationOr404,
):
    """
    Get an organization.
    """
    return organization
