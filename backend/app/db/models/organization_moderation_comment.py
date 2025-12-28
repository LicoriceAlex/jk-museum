import uuid

from sqlmodel import Field, SQLModel


class OrganizationModerationCommentBase(SQLModel):
    text: str = Field(nullable=False, max_length=2000)


class OrganizationModerationComment(OrganizationModerationCommentBase, table=True):
    __tablename__ = "organization_moderation_comments"

    id: uuid.UUID = Field(primary_key=True, default_factory=uuid.uuid4)
    entity_id: uuid.UUID = Field(foreign_key="organizations.id", nullable=False)
    author_id: uuid.UUID = Field(foreign_key="users.id", nullable=False)


class OrganizationModerationCommentCreate(OrganizationModerationCommentBase):
    entity_id: uuid.UUID
    author_id: uuid.UUID


class OrganizationModerationCommentUpdate(SQLModel):
    text: str | None = Field(default=None, max_length=2000)


class OrganizationModerationCommentPublic(OrganizationModerationCommentBase):
    id: uuid.UUID
    entity_id: uuid.UUID
    author_id: uuid.UUID
    created_at: str


class OrganizationModerationCommentsPublic(SQLModel):
    data: list[OrganizationModerationCommentPublic]
    total: int
