import uuid
from typing import Annotated

<<<<<<< HEAD
from fastapi import Depends, HTTPException
from backend.app.api.dependencies.common import SessionDep
from backend.app.db.models import Organization
from backend.app.crud import organization as organization_crud
=======
from backend.app.api.dependencies.common import SessionDep
from backend.app.crud import organization as organization_crud
from backend.app.db.models.organization import Organization
from fastapi import Depends, HTTPException
>>>>>>> origin/main


async def get_organization_or_404(session: SessionDep, organization_id: uuid.UUID) -> Organization:
    organization = await organization_crud.get_organization(session=session, id=organization_id)
    if not organization:
<<<<<<< HEAD
        raise HTTPException(
            status_code=404,
            detail="Organization not found"
        )
    return organization

=======
        raise HTTPException(status_code=404, detail="Organization not found")
    return organization


>>>>>>> origin/main
OrganizationOr404 = Annotated[Organization, Depends(get_organization_or_404)]
