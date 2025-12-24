from enum import Enum

from fastapi import Form
from sqlmodel import Field, SQLModel


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
    object_key: str
    file_url: str


class LoginType(str, Enum):
    user = "user"
    organization = "organization"


class OAuth2PasswordRequestFormWithLoginType:
    def __init__(
        self,
        username: str = Form(...),
        password: str = Form(...),
        grant_type: str | None = Form(None),
        scope: str = Form(""),
        client_id: str | None = Form(None),
        client_secret: str | None = Form(None),
        login_type: LoginType = Form(default=LoginType.user),  # noqa: B008
    ):
        self.username = username
        self.password = password
        self.grant_type = grant_type
        self.scopes = scope.split()
        self.client_id = client_id
        self.client_secret = client_secret
        self.login_type = login_type
