from datetime import datetime
from enum import Enum
from typing import TYPE_CHECKING
import uuid
from sqlmodel import Field, SQLModel


if TYPE_CHECKING:
    from backend.app.db.models.user import UserPublic


class UserOrganizationEnum(str, Enum):
    active = "active"
    left = "left"


class UserOrganizationBase(SQLModel):
    status: UserOrganizationEnum = Field(
        nullable=False,
        default=UserOrganizationEnum.active
    )
    position: str | None = Field(default=None, nullable=True)


class UserOrganization(UserOrganizationBase, table=True):
    __tablename__ = "users_organizations"

    organization_id: uuid.UUID = Field(
        foreign_key="organizations.id",
        primary_key=True,
        nullable=False
    )
    user_id: uuid.UUID = Field(
        foreign_key="users.id",
        primary_key=True,
        nullable=False
    )

    left_at: datetime | None = Field(default=None, nullable=True)
    joined_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)


class UserOrganizationCreate(UserOrganizationBase):
    organization_id: uuid.UUID
    user_id: uuid.UUID
    left_at: datetime | None = None


class UserOrganizationPublic(UserOrganizationBase):
    organization_id: uuid.UUID
    user_id: uuid.UUID
    left_at: datetime | None
    joined_at: datetime


class OrganizationMemberPublic(SQLModel):
    user: 'UserPublic'
    membership: UserOrganizationPublic


class OrganizationMembersPublic(SQLModel):
    items: list[OrganizationMemberPublic]


class OrganizationMemberUpdate(SQLModel):
    status: UserOrganizationEnum | None = None
    position: str | None = None
