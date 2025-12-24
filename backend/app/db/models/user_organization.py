<<<<<<< HEAD
from datetime import datetime
from enum import Enum
from typing import TYPE_CHECKING
import uuid
from sqlmodel import Field, SQLModel

=======
import uuid
from datetime import datetime
from enum import Enum
from typing import TYPE_CHECKING

from sqlmodel import Field, SQLModel
>>>>>>> origin/main

if TYPE_CHECKING:
    from backend.app.db.models.user import UserPublic


class UserOrganizationEnum(str, Enum):
    active = "active"
    left = "left"


class UserOrganizationBase(SQLModel):
<<<<<<< HEAD
    status: UserOrganizationEnum = Field(
        nullable=False,
        default=UserOrganizationEnum.active
    )
=======
    status: UserOrganizationEnum = Field(nullable=False, default=UserOrganizationEnum.active)
>>>>>>> origin/main
    position: str | None = Field(default=None, nullable=True)


class UserOrganization(UserOrganizationBase, table=True):
    __tablename__ = "users_organizations"

    organization_id: uuid.UUID = Field(
        foreign_key="organizations.id",
        primary_key=True,
<<<<<<< HEAD
        nullable=False
    )
    user_id: uuid.UUID = Field(
        foreign_key="users.id",
        primary_key=True,
        nullable=False
    )
=======
        nullable=False,
    )
    user_id: uuid.UUID = Field(foreign_key="users.id", primary_key=True, nullable=False)
>>>>>>> origin/main

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
<<<<<<< HEAD
    user: 'UserPublic'
=======
    user: "UserPublic"
>>>>>>> origin/main
    membership: UserOrganizationPublic


class OrganizationMembersPublic(SQLModel):
    items: list[OrganizationMemberPublic]


class OrganizationMemberUpdate(SQLModel):
    status: UserOrganizationEnum | None = None
    position: str | None = None
