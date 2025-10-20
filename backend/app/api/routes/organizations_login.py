from datetime import timedelta
from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm

from backend.app.api.dependencies.common import SessionDep
from backend.app.core import security
from backend.app.core.config import settings
from backend.app.crud import organization as organization_crud
from backend.app.db.schemas import Token

router = APIRouter()


@router.post("/access-token")
async def login_access_token(
    session: SessionDep,
    form_data: Annotated[
        OAuth2PasswordRequestForm, Depends()
    ]
) -> Token:
    organization = await organization_crud.authenticate(
        session=session,
        email=form_data.username,
        password=form_data.password
    )
    if not organization:
        raise HTTPException(
            status_code=400,
            detail="Incorrect email or password"
        )
    access_token_expires = timedelta(
        minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
    )
    return Token(
        access_token=security.create_access_token(
            organization.id, expires_delta=access_token_expires
        )
    )