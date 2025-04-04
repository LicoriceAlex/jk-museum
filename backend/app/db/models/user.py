from datetime import datetime
from enum import Enum
from typing import TYPE_CHECKING, List, Optional
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
    status: StatusEnum = Field(default=StatusEnum.active)
    role: RoleEnum = Field(default=RoleEnum.user)
    patronymic: str = Field(max_length=255)


class User(UserBase, table=True):
    __tablename__ = "users"
    id: Optional[UUID] = Field(primary_key=True, default_factory=uuid4)
    hashed_password: Optional[str] = Field(default=None, nullable=True)
    created_at: Optional[datetime] = Field(default_factory=datetime.now)

    admin_actions: List["AdminAction"] = Relationship(
        back_populates="admin",
        sa_relationship_kwargs={
            "foreign_keys": "AdminAction.admin_id"
        }
    )
    targeted_actions: List["AdminAction"] = Relationship(
        back_populates="target_user",
        sa_relationship_kwargs={
            "foreign_keys": "AdminAction.target_user_id"
        }
    )


class UserCreate(UserBase):
    password: str = Field(min_length=8, max_length=40)


class UserRegister(SQLModel):
    email: EmailStr
    password: str
    name: str
    surname: str
    patronymic: str
    role: Optional[RoleEnum] = Field(default=RoleEnum.user)


class UserUpdate(UserBase):
    email: Optional[EmailStr] = Field(default=None, max_length=255)


class UserUpdateMe(UserBase):
    email: Optional[EmailStr] = Field(default=None, max_length=255)


class UserPublic(UserBase):
    id: UUID
    created_at: Optional[datetime] = Field(default_factory=datetime.now)


class UsersPublic(SQLModel):
    data: List[UserPublic]
    count: int
    