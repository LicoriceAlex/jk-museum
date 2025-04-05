from datetime import timedelta
from typing import Annotated, Any
from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from pydantic import EmailStr
from sqlalchemy import select

from backend.app.api.dependencies.common import SessionDep
from backend.app.core import security
from backend.app.core.config import settings
from backend.app.utils.emails import generate_reset_password_email, send_email
from backend.app.utils.security import generate_password_reset_token, verify_password_reset_token
import backend.app.crud.user as user_crud
from backend.app.db.models.user import User
from backend.app.db.schemas import Token, Message, NewPassword


router = APIRouter(tags=["login"])


@router.post("/access-token")
async def login_access_token(
    session: SessionDep, form_data: Annotated[OAuth2PasswordRequestForm, Depends()]
) -> Token:
    """
    OAuth2 compatible token login, get an access token for future requests
    """
    user = await user_crud.authenticate(
        session=session, email=form_data.username, password=form_data.password
    )
    if not user:
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    return Token(
        access_token=security.create_access_token(
            user.id, expires_delta=access_token_expires
        )
    )


@router.post("/password-recovery/{email}")
async def recover_password(email: EmailStr, session: SessionDep) -> Message:
    """
    Password Recovery
    """
    user = await user_crud.get_user(session=session, email=email)

    if not user:
        raise HTTPException(
            status_code=404,
            detail="The user with this email does not exist in the system.",
        )
    password_reset_token = await generate_password_reset_token(email=email)
    email_data = await generate_reset_password_email(
        email_to=user.email, email=email, token=password_reset_token
    )
    await send_email(
        email_to=user.email,
        subject=email_data.subject,
        html_content=email_data.html_content,
    )
    return Message(message="Ссылка на восстановление пароля была отправлена вам на почту! Не забудьте проверить папку спам :)")


@router.post("/reset-password/")
async def reset_password(session: SessionDep, body: NewPassword) -> Message:
    """
    Reset password
    """
    user_email = await verify_password_reset_token(token=body.token)

    if not user_email:
        raise HTTPException(status_code=400, detail="Invalid token")

    statement = select(User).where(User.email == user_email)
    user = (
        await session.execute(statement)
    ).scalar_one_or_none()

    if not user:
        raise HTTPException(
            status_code=404,
            detail="The user with this email does not exist in the system.",
        )

    hashed_password = security.get_password_hash(password=body.new_password)
    user.hashed_password = hashed_password

    session.add(user)
    await session.commit()

    return Message(message="Password updated successfully")


@router.post(
    "/check-reset-password-token/{token}",
)
async def check_reset_password_token(
    token: str
) -> Any:
    """
    Check token
    """
    user_email = await verify_password_reset_token(token=token)
    flag = False
    if user_email:
        flag = True
    return {"valid": flag}