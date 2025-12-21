from datetime import datetime
from enum import Enum
from typing import TYPE_CHECKING
from uuid import UUID, uuid4

from pydantic import EmailStr
from sqlmodel import Field, Relationship, SQLModel

if TYPE_CHECKING:
    from backend.app.db.models.admin_action import AdminAction
    from backend.app.db.models.exhibit import Exhibit
    from backend.app.db.models.exhibition import ExhibitionsPublicWithPagination
    from backend.app.db.models.user_organization import UserOrganization


class OrgStatusEnum(str, Enum):
    pending = "pending"
    approved = "approved"
    rejected = "rejected"


class OrganizationBase(SQLModel):
    name: str = Field(unique=True, nullable=False, max_length=255)
    email: EmailStr = Field(unique=True, nullable=False, max_length=255)
    contact_info: str | None = None
    description: str | None = Field(default=None, nullable=True)
    logo_key: str | None = Field(default=None, nullable=True)


class Organization(OrganizationBase, table=True):
    __tablename__ = "organizations"
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    status: OrgStatusEnum = Field(default=OrgStatusEnum.pending)

    created_at: datetime = Field(default_factory=datetime.now)

    admin_actions: list["AdminAction"] = Relationship(
        back_populates="target_org",
        sa_relationship_kwargs={"foreign_keys": "AdminAction.target_org_id"},
    )
    exhibits: list["Exhibit"] | None = Relationship(back_populates="organization")


class OrganizationCreate(OrganizationBase):
    position: str | None = None


class OrganizationUpdate(SQLModel):
    name: str | None = None
    contact_info: str | None = None
    description: str | None = None
    logo_key: str | None = None


class OrganizationPublic(OrganizationBase):
    id: UUID
    status: OrgStatusEnum
    created_at: datetime
    exhibitions: "ExhibitionsPublicWithPagination"


class OrganizationPublicShort(OrganizationBase):
    id: UUID
    status: OrgStatusEnum
    created_at: datetime
    logo_key: str | None = None


class OrganizationResponse(SQLModel):
    organization: OrganizationPublicShort
    membership: "UserOrganization"


class MyOrganization(SQLModel):
    items: list[OrganizationResponse]


class OrganizationsPublic(SQLModel):
    data: list["OrganizationPublicShort"]
    count: int


OrganizationPublicShort.model_rebuild()
OrganizationsPublic.model_rebuild()
