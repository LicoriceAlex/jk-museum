from typing import Optional
from sqlmodel import Field, SQLModel
from fastapi.security import OAuth2PasswordRequestForm
from fastapi import Form
from enum import Enum


class Message(SQLModel):
    message: str


class Token(SQLModel):
    access_token: str
    token_type: str = "bearer"


class TokenPayload(SQLModel):
    sub: str | None = None


class NewPassword(SQLModel):
    token: str
    new_password: str = Field(min_length=8, max_length=40)


class UpdatePassword(SQLModel):
    current_password: str = Field(min_length=8, max_length=40)
    new_password: str = Field(min_length=8, max_length=40)


class FilePath(SQLModel):
    file_path: str


class FileUploadResponse(SQLModel):
    image_key: str
    file_url: str


class LoginType(str, Enum):
    user = "user"
    organization = "organization"


class OAuth2PasswordRequestFormWithLoginType:
    def __init__(
        self,
        username: str = Form(...),
        password: str = Form(...),
        grant_type: Optional[str] = Form(None),
        scope: str = Form(""),
        client_id: Optional[str] = Form(None),
        client_secret: Optional[str] = Form(None),
        login_type: LoginType = Form(default=LoginType.user),
    ):
        self.username = username
        self.password = password
        self.grant_type = grant_type
        self.scopes = scope.split()
        self.client_id = client_id
        self.client_secret = client_secret
        self.login_type = login_type
