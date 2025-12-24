<<<<<<< HEAD
from datetime import datetime
import uuid

from sqlalchemy.ext.asyncio import AsyncSession

from backend.app.db.models import (
    Organization,
    OrganizationCreate,
    OrganizationMemberUpdate,
    OrganizationResponse,
    UserOrganizationCreate,
    UserOrganizationPublic,
    UserOrganizationEnum,
)
from backend.app.crud import organization as organization_crud
from backend.app.crud import user_organization as user_organization_crud
from backend.app.utils.logger import log_method_call
=======
import uuid
from datetime import datetime

from backend.app.crud import organization as organization_crud
from backend.app.crud import user_organization as user_organization_crud
from backend.app.db.models.organization import (
    Organization,
    OrganizationCreate,
    OrganizationResponse,
)
from backend.app.db.models.user_organization import (
    OrganizationMemberUpdate,
    UserOrganizationCreate,
    UserOrganizationEnum,
    UserOrganizationPublic,
)
from backend.app.utils.logger import log_method_call
from sqlalchemy.ext.asyncio import AsyncSession
>>>>>>> origin/main


@log_method_call
async def create_organization(
    organization_in: OrganizationCreate,
    session: AsyncSession,
    current_user_id: uuid.UUID,
) -> OrganizationResponse:
    organization = await organization_crud.create_organization(
        session=session,
<<<<<<< HEAD
        organization_in=organization_in
=======
        organization_in=organization_in,
>>>>>>> origin/main
    )

    user_organization_in = UserOrganizationCreate(
        user_id=current_user_id,
        organization_id=organization.id,
        position=organization_in.position,
<<<<<<< HEAD
        left_at=organization_in.left_at if hasattr(
            organization_in, 'left_at'
        ) else None,
    )
    organization_user = await user_organization_crud.create_organization_user(
        session=session,
        user_organization_in=user_organization_in
=======
        left_at=organization_in.left_at if hasattr(organization_in, "left_at") else None,
    )
    organization_user = await user_organization_crud.create_organization_user(
        session=session,
        user_organization_in=user_organization_in,
>>>>>>> origin/main
    )

    return OrganizationResponse(
        organization=organization,
        membership=organization_user,
    )


@log_method_call
async def add_organization_member(
    session: AsyncSession,
    organization: Organization,
    user_id: uuid.UUID,
    position: str | None,
) -> UserOrganizationPublic:
    current_organization_user = await user_organization_crud.get_organization_user(
        session=session,
        user_id=user_id,
        organization_id=organization.id,
    )
    if current_organization_user:
        raise ValueError("User is already a member of the organization.")
<<<<<<< HEAD
    
=======

>>>>>>> origin/main
    organization_user = await user_organization_crud.create_organization_user(
        session=session,
        user_organization_in=UserOrganizationCreate(
            user_id=user_id,
            organization_id=organization.id,
            position=position,
<<<<<<< HEAD
        )
    )
    return UserOrganizationPublic(
        **organization_user.model_dump()
    )
=======
        ),
    )
    return UserOrganizationPublic(**organization_user.model_dump())
>>>>>>> origin/main


@log_method_call
async def update_organization_member(
    session: AsyncSession,
    organization_id: uuid.UUID,
    user_id: uuid.UUID,
    member_in: OrganizationMemberUpdate,
) -> UserOrganizationPublic:
    organization_member = await user_organization_crud.get_organization_user(
        session=session,
        user_id=user_id,
        organization_id=organization_id,
    )
    if not organization_member:
        raise ValueError("User is not a member of the organization.")
<<<<<<< HEAD
    
    if (
        member_in.status == UserOrganizationEnum.left and (
            organization_member.status != UserOrganizationEnum.left
        )
=======

    if member_in.status == UserOrganizationEnum.left and (
        organization_member.status != UserOrganizationEnum.left
>>>>>>> origin/main
    ):
        organization_member.left_at = datetime.now()

    for key, value in member_in.model_dump(exclude_unset=True).items():
        setattr(organization_member, key, value)
<<<<<<< HEAD
    
    session.add(organization_member)
    await session.commit()
    await session.refresh(organization_member)
    return UserOrganizationPublic(
        **organization_member.model_dump()
    )
=======

    session.add(organization_member)
    await session.commit()
    await session.refresh(organization_member)
    return UserOrganizationPublic(**organization_member.model_dump())
>>>>>>> origin/main
