from typing import Annotated
import uuid

from fastapi import Depends, HTTPException
from jwt import InvalidTokenError
import jwt
from pydantic import ValidationError
from backend.app.api.dependencies.common import SessionDep, TokenDep
from backend.app.core import security
from backend.app.core.config import settings
from backend.app.db.models.organization import Organization
from backend.app.crud import organization as organization_crud
from backend.app.db.schemas import TokenPayload


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

async def get_current_organization(
    session: SessionDep,
    token: TokenDep
) -> Organization:
    try:
        payload = jwt.decode(
            token,
            settings.SECRET_KEY,
            algorithms=[security.ALGORITHM]
        )
        token_data = TokenPayload(**payload)
    except (InvalidTokenError, ValidationError):
        raise HTTPException(
            status_code=403,
            detail="Could not validate credentials",
        )
    organization = await session.get(Organization, token_data.sub)
    if not organization:
        raise HTTPException(
            status_code=404,
            detail="Organization not found"
        )
    return organization


OrgnizationOr404 = Annotated[Organization, Depends(get_organization_or_404)]
CurrentOrganization = Annotated[Organization, Depends(get_current_organization)]
