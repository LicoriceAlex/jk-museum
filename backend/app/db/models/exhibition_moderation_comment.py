import uuid

from sqlmodel import Field, SQLModel


class ExhibitionModerationCommentBase(SQLModel):
    text: str = Field(nullable=False, max_length=2000)


class ExhibitionModerationComment(ExhibitionModerationCommentBase, table=True):
    __tablename__ = "exhibition_moderation_comments"

    id: uuid.UUID = Field(primary_key=True, default_factory=uuid.uuid4)
    entity_id: uuid.UUID = Field(foreign_key="exhibitions.id", nullable=False)
    author_id: uuid.UUID = Field(foreign_key="users.id", nullable=False)



class ExhibitionModerationCommentCreate(ExhibitionModerationCommentBase):
    entity_id: uuid.UUID
    author_id: uuid.UUID


class ExhibitionModerationCommentUpdate(SQLModel):
    text: str | None = Field(default=None, max_length=2000)


class ExhibitionModerationCommentPublic(ExhibitionModerationCommentBase):
    id: uuid.UUID
    entity_id: uuid.UUID
    author_id: uuid.UUID
    created_at: str


class ExhibitionModerationCommentsPublic(SQLModel):
    data: list[ExhibitionModerationCommentPublic]
    total: int
