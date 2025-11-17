import uuid
from fastapi import APIRouter, Depends, HTTPException, Query

from backend.app.api.dependencies.common import SessionDep
from backend.app.api.dependencies.organizations import (
    OrganizationOr404,
)
from backend.app.api.dependencies.pagination import PaginationDep
from backend.app.api.dependencies.users import (
    CurrentUser,
    CurrentActiveOrganizationMember,
)
from backend.app.crud import organization as organization_crud
from backend.app.crud import user_organization as user_organization_crud
from backend.app.services import organization as organization_service
from backend.app.db.models import (
    OrganizationCreate,
    OrganizationPublic,
    OrganizationPublicShort,
    OrganizationsPublic,
    OrganizationMembersPublic,
    OrganizationMemberPublic,
    UserOrganizationPublic,
    OrganizationMemberUpdate,
)

router = APIRouter()


@router.post(
    "/",
)
async def create_organization(
    organization_in: OrganizationCreate,
    current_user: CurrentUser,
    session: SessionDep,
):
    """
    Create a new organization.
    """
    try:
        organization_create = OrganizationCreate.model_validate(
            organization_in)
        organization_response = await organization_service.create_organization(
            session=session,
            organization_in=organization_create,
            current_user_id=current_user.id,
        )
        return organization_response
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
    organization: OrganizationOr404,
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
    organization: OrganizationOr404,
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
    "/my",
)
async def get_my_organization(
    session: SessionDep,
    current_user: CurrentUser,
):
    """
    Get my organization.
    """
    organizations = await organization_crud.get_my_organizations(
        session=session,
        user_id=current_user.id
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
    # dependencies=[Depends(CurrentUser.is_organization) or Depends(CurrentUser.is_admin_or_moderator)],
)
async def update_organization_profile(
    session: SessionDep,
    organization: OrganizationOr404,
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


@router.post(
    "/{organization_id}/members",
)
async def add_organization_member(
    session: SessionDep,
    organization: OrganizationOr404,
    current_active_member: CurrentActiveOrganizationMember,
    user_id: uuid.UUID,
    position: str | None = None,
):
    """
    Add a member to the organization.
    """
    try:
        organization_member = await organization_service.add_organization_member(
            session=session,
            organization=organization,
            user_id=user_id,
            position=position,
        )
    except ValueError as e:
        raise HTTPException(
            status_code=400,
            detail=str(e)
        )

    return organization_member


@router.get(
    "/{organization_id}/members",
)
async def get_organization_members(
    session: SessionDep,
    current_active_member: CurrentActiveOrganizationMember,
    organization: OrganizationOr404,
):
    """
    Get organization members.
    """
    members = await user_organization_crud.get_organization_members(
        session=session,
        organization_id=organization.id
    )
    return OrganizationMembersPublic(
        items=[
            OrganizationMemberPublic(
                user=user,
                membership=UserOrganizationPublic.model_validate(member)
            )
            for user, member in members
        ]
    )


@router.patch(
    "/{organization_id}/members/{user_id}",
)
async def update_organization_member(
    session: SessionDep,
    current_active_member: CurrentActiveOrganizationMember,
    organization: OrganizationOr404,
    member_in: OrganizationMemberUpdate,
    user_id: uuid.UUID,
):
    """
    Update organization member's position.
    """
    organization_member = await organization_service.update_organization_member(
        session=session,
        organization_id=organization.id,
        user_id=user_id,
        member_in=member_in,
    )
    return UserOrganizationPublic.model_validate(organization_member)
