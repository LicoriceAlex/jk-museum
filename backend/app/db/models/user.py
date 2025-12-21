from datetime import datetime
from enum import Enum
from typing import TYPE_CHECKING
from uuid import UUID, uuid4

from pydantic import EmailStr
from sqlmodel import Field, Relationship, SQLModel

if TYPE_CHECKING:
    from backend.app.db.models.admin_action import AdminAction


class RoleEnum(str, Enum):
    user = "user"
    moderator = "moderator"
    admin = "admin"


class StatusEnum(str, Enum):
    active = "active"
    blocked = "blocked"


class UserBase(SQLModel):
    email: EmailStr = Field(max_length=255)
    name: str = Field(max_length=255)
    surname: str = Field(max_length=255)
    profile_image_key: str | None = Field(default=None, nullable=True)
    about_me: str | None = Field(default=None, nullable=True)
    status: StatusEnum = Field(default=StatusEnum.active)
    role: RoleEnum = Field(default=RoleEnum.user)
    patronymic: str = Field(max_length=255)


class User(UserBase, table=True):
    __tablename__ = "users"
    id: UUID | None = Field(primary_key=True, default_factory=uuid4)
    hashed_password: str | None = Field(default=None, nullable=True)
    created_at: datetime | None = Field(default_factory=datetime.now)

    admin_actions: list["AdminAction"] = Relationship(
        back_populates="admin",
        sa_relationship_kwargs={"foreign_keys": "AdminAction.admin_id"},
    )
    targeted_actions: list["AdminAction"] = Relationship(
        back_populates="target_user",
        sa_relationship_kwargs={"foreign_keys": "AdminAction.target_user_id"},
    )


class UserCreate(UserBase):
    password: str = Field(min_length=8, max_length=40)


class UserRegister(SQLModel):
    email: EmailStr
    password: str
    name: str
    surname: str
    patronymic: str
    role: RoleEnum | None = Field(default=RoleEnum.user)


class UserUpdate(SQLModel):
    name: str | None
    surname: str | None
    profile_image_key: str | None
    about_me: str | None


class UserUpdateMe(UserBase):
    email: EmailStr | None = Field(default=None, max_length=255)


class UserPublic(UserBase):
    id: UUID
    created_at: datetime | None = Field(default_factory=datetime.now)


class UsersPublic(SQLModel):
    data: list[UserPublic]
    count: int
