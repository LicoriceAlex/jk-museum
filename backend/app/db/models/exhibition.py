from datetime import datetime
from typing import TYPE_CHECKING
from uuid import UUID, uuid4

from backend.app.api.dependencies.common import Variants
from backend.app.db.models.exhibition_block import ExhibitionBlockPublic
from backend.app.db.models.exhibition_participant import ExhibitionParticipant
from sqlalchemy import Column
from sqlalchemy.dialects.postgresql import JSONB
from sqlmodel import Field, Relationship, SQLModel

from .exhibition_tag import ExhibitionTag
from .tag import TagPublic

if TYPE_CHECKING:
    from backend.app.db.models.exhibition_tag import ExhibitionTag
    from backend.app.db.models.tag import TagPublic


class ExhibitionStatusEnum(Variants):
    published = "published"
    draft = "draft"
    on_mo_review = "on_mo_review"
    on_mo_revision = "on_mo_revision"
    ready_for_platform = "ready_for_platform"
    awaiting_platform_review = "awaiting_platform_review"
    needs_revision_after_moderation = "needs_revision_after_moderation"
    published_changes_pending_review = "published_changes_pending_review"


class CoverTypeEnum(Variants):
    inside = "inside"
    outside = "outside"


class DateTemplate(Variants):
    year: str = "year"
    decade: str = "decade"
    century: str = "century"


class ExhibitionBase(SQLModel):
    title: str = Field(max_length=255, nullable=False)
    description: str | None = Field(default=None, nullable=True)
    cover_image_key: str = Field(max_length=255, nullable=False)
    cover_type: CoverTypeEnum | None = Field(default=CoverTypeEnum.outside)
    status: str = Field(default=ExhibitionStatusEnum.draft, nullable=False)
    rating: float = Field(default=0.0, nullable=False)
    settings: dict = Field(sa_column=Column(JSONB, nullable=False))


class Exhibition(ExhibitionBase, table=True):
    __tablename__ = "exhibitions"

    id: UUID = Field(primary_key=True, nullable=False, default_factory=uuid4)

    organization_id: UUID | None = Field(foreign_key="organizations.id", nullable=True)

    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(
        default_factory=datetime.now,
        sa_column_kwargs={"onupdate": datetime.now},
    )

    exhibition_tags: list["ExhibitionTag"] = Relationship(back_populates="exhibition")
    participants: list["ExhibitionParticipant"] = Relationship(back_populates="exhibition")


class ExhibitionCreate(ExhibitionBase):
    organization_id: UUID | None = None
    participants: list[str]
    tags: list[str]


class ExhibitionUpdate(ExhibitionBase):
    organization_id: UUID | None = None
    tags: list[str] | None = None
    participants: list[str] | None = None


class ExhibitionPublic(ExhibitionBase):
    id: UUID
    organization_id: UUID | None
    created_at: datetime
    updated_at: datetime
    participants: list["ExhibitionParticipant"]
    tags: list["TagPublic"]
    is_liked_by_current_user: bool | None = None
    likes_count: int | None = Field(default=0)
    blocks: list[ExhibitionBlockPublic] | None = None


class ExhibitionsPublic(SQLModel):
    data: list["ExhibitionPublic"]
    count: int


class ExhibitionsPublicWithPagination(SQLModel):
    data: list["ExhibitionPublic"]
    count: int
    skip: int
    limit: int


ExhibitionPublic.model_rebuild()
ExhibitionsPublic.model_rebuild()
ExhibitionsPublicWithPagination.model_rebuild()
