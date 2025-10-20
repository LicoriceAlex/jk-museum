from typing import Annotated
import uuid

from fastapi import Depends, HTTPException
from backend.app.api.dependencies.common import SessionDep
from backend.app.db.models import Organization
from backend.app.crud import organization as organization_crud


async def get_organization_or_404(
    session: SessionDep,
    organization_id: uuid.UUID
) -> Organization:
    organization = await organization_crud.get_organization(
        session=session,
        id=organization_id
    )
    if not organization:
        raise HTTPException(
            status_code=404,
            detail="Organization not found"
        )
    return organization

OrganizationOr404 = Annotated[Organization, Depends(get_organization_or_404)]
