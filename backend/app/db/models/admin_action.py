from datetime import datetime
from typing import TYPE_CHECKING, Optional
from uuid import UUID, uuid4

from backend.app.api.dependencies.common import Variants
from sqlmodel import Field, Relationship, SQLModel

if TYPE_CHECKING:
    from backend.app.db.models.organization import Organization
    from backend.app.db.models.user import User


class ActionTypeEnum(Variants):
    approve_org = "approve_org"
    block_user = "block_user"
    unblock_user = "unblock_user"
    reset_password = "reset_password"


class AdminActionBase(SQLModel):
    action_type: ActionTypeEnum


class AdminAction(AdminActionBase, table=True):
    __tablename__ = "admin_actions"
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    admin_id: UUID = Field(foreign_key="users.id", nullable=False)
    target_user_id: UUID | None = Field(foreign_key="users.id")
    target_org_id: UUID | None = Field(foreign_key="organizations.id")
    created_at: datetime = Field(default_factory=datetime.now)

    admin: "User" = Relationship(
        back_populates="admin_actions",
        sa_relationship_kwargs={"foreign_keys": "AdminAction.admin_id"},
    )
    target_user: Optional["User"] = Relationship(
        back_populates="targeted_actions",
        sa_relationship_kwargs={"foreign_keys": "AdminAction.target_user_id"},
    )
    target_org: Optional["Organization"] = Relationship(
        back_populates="admin_actions",
        sa_relationship_kwargs={"foreign_keys": "AdminAction.target_org_id"},
    )


class AdminActionCreate(AdminActionBase):
    admin_id: UUID
    target_user_id: UUID | None = None
    target_org_id: UUID | None = None


class AdminActionPublic(AdminActionBase):
    id: UUID
    admin_id: UUID
    target_user_id: UUID | None
    target_org_id: UUID | None
    created_at: datetime
