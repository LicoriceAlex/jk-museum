from datetime import datetime
from enum import Enum
from typing import TYPE_CHECKING, List, Optional
from uuid import UUID, uuid4

from pydantic import EmailStr
from sqlmodel import Field, Relationship, SQLModel



if TYPE_CHECKING:
    from backend.app.db.models.admin_action import AdminAction
    from backend.app.db.models.exhibit import Exhibit
    
    
class OrgStatusEnum(str, Enum):
    pending = "pending"
    approved = "approved"
    rejected = "rejected"


class OrganizationBase(SQLModel):
    name: str = Field(unique=True, nullable=False, max_length=255)
    email: EmailStr = Field(unique=True, nullable=False, max_length=255)
    contact_info: Optional[str] = None


class Organization(OrganizationBase, table=True):
    __tablename__ = "organizations"
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    status: OrgStatusEnum = Field(default=OrgStatusEnum.pending)
    
    created_at: datetime = Field(default_factory=datetime.now)

    admin_actions: List["AdminAction"] = Relationship(
        back_populates="target_org",
        sa_relationship_kwargs={
            "foreign_keys": "AdminAction.target_org_id"
        }
    )
    exhibits: Optional[List["Exhibit"]] = Relationship(
        back_populates="organization"
    )


class OrganizationCreate(OrganizationBase):
    pass


class OrganizationUpdate(OrganizationBase):
    status: Optional[OrgStatusEnum] = None


class OrganizationPublic(OrganizationBase):
    id: UUID
    status: OrgStatusEnum
    created_at: datetime
    

class OrganizationsPublic(SQLModel):
    data: List[OrganizationPublic]
    count: int
    