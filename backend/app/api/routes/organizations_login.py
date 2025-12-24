from datetime import timedelta
from typing import Annotated
<<<<<<< HEAD
from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
=======
>>>>>>> origin/main

from backend.app.api.dependencies.common import SessionDep
from backend.app.core import security
from backend.app.core.config import settings
from backend.app.crud import organization as organization_crud
from backend.app.db.schemas import Token
from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm

router = APIRouter()


@router.post("/access-token")
async def login_access_token(
    session: SessionDep,
<<<<<<< HEAD
    form_data: Annotated[
        OAuth2PasswordRequestForm, Depends()
    ]
=======
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
>>>>>>> origin/main
) -> Token:
    organization = await organization_crud.authenticate(
        session=session,
        email=form_data.username,
<<<<<<< HEAD
        password=form_data.password
=======
        password=form_data.password,
>>>>>>> origin/main
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
            organization.id,
            expires_delta=access_token_expires,
        ),
    )
