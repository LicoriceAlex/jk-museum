from fastapi import APIRouter, Depends, HTTPException, Query

from backend.app.api.dependencies.common import SessionDep
from backend.app.api.dependencies.organizations import OrgnizationOr404
from backend.app.api.dependencies.pagination import PaginationDep
from backend.app.api.dependencies.users import CurrentUser
from backend.app.core.config import settings
from backend.app.crud import organization as organization_crud
from backend.app.db.models.organization import (
    Organization, OrganizationCreate, OrganizationPublic, OrganizationPublicShort, OrganizationsPublic
)

router = APIRouter()


@router.post(
    "/",
)
async def create_organization(
    organization_in: OrganizationCreate,
    session: SessionDep,
):
    """
    Create a new organization.
    """
    try:
        organization_create = OrganizationCreate.model_validate(organization_in)
        organization = await organization_crud.create_organization(
            session=session,
            organization_in=organization_create
        )
        return organization
    except ValueError as e:
        raise HTTPException(
            status_code=400,
            detail=str(e)
        )


@router.patch(
    "/{organization_id}/confirm",
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
    "/{organization_id}/profile",
)
async def get_organization_profile(
    current_user: CurrentUser,
    organization_id: str,
    session: SessionDep,
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
):
    """
    Get organization profile with published exhibitions (paginated).
    """
    org = await organization_crud.get_organization_profile_with_exhibitions(
        session=session,
        organization_id=organization_id,
        skip=skip,
        limit=limit,
        current_user_id=current_user.id
    )
    if not org:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Organization not found")
    return org


@router.put(
    "/{organization_id}/profile",
    response_model=OrganizationPublicShort,
    #dependencies=[Depends(CurrentUser.is_organization) or Depends(CurrentUser.is_admin_or_moderator)],
)
async def update_organization_profile(
    session: SessionDep,
    organization: OrgnizationOr404,
    organization_in: OrganizationCreate,
):
    """
    Update organization profile.
    """
    organization = await organization_crud.update_organization_profile(
        session=session,
        organization=organization,
        organization_in=organization_in
    )
    return organization
