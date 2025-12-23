from datetime import datetime
from uuid import UUID, uuid4

from backend.app.api.dependencies.common import Variants
from backend.app.db.models.admin_action import AdminAction
from backend.app.db.models.exhibit import Exhibit
from backend.app.db.models.exhibition import ExhibitionsPublicWithPagination
from backend.app.db.models.user_organization import UserOrganization
from pydantic import EmailStr
from sqlmodel import Field, Relationship, SQLModel


class OrgStatusEnum(Variants):
    approved = "approved"
    draft = "draft"
    on_moderation = "on_moderation"
    needs_revision = "needs_revision"


class OrganizationBase(SQLModel):
    name: str = Field(unique=True, nullable=False, max_length=255)
    short_name: str = Field(default=None, nullable=True, max_length=100)
    email: EmailStr = Field(unique=True, nullable=False, max_length=255)
    region: str | None = Field(default=None, nullable=True)
    adress: str | None = Field(default=None, nullable=True)
    phone_number: str | None = Field(default=None, nullable=True)
    social_links: str | None = Field(default=None, nullable=True)
    charter_file: str | None = Field(default=None, nullable=True)
    contact_info: str | None = Field(default=None, nullable=True)
    description: str | None = Field(default=None, nullable=True)
    logo_key: str | None = Field(default=None, nullable=True)


class Organization(OrganizationBase, table=True):
    __tablename__ = "organizations"
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    status: OrgStatusEnum = Field(default=OrgStatusEnum.draft)

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
    region: str | None = None
    adress: str | None = None
    phone_number: str | None = None
    social_links: str | None = None
    charter_file: str | None = None
    contact_info: str | None = None


class OrganizationPublic(OrganizationBase):
    id: UUID
    status: OrgStatusEnum
    created_at: datetime
    exhibitions: ExhibitionsPublicWithPagination | None = None


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
