from datetime import datetime
from enum import Enum
from typing import TYPE_CHECKING
from uuid import UUID, uuid4

<<<<<<< HEAD
from .tag import TagPublic
from .exhibition_tag import ExhibitionTag
=======
>>>>>>> origin/main
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


class ExhibitionStatusEnum(str, Enum):
    draft = "draft"
    published = "published"
    archived = "archived"


class CoverTypeEnum(str, Enum):
    inside = "inside"
    outside = "outside"


class DateTemplate(str, Enum):
    year: str = "year"
    decade: str = "decade"
    century: str = "century"


class ExhibitionBase(SQLModel):
    title: str = Field(max_length=255, nullable=False)
    description: str | None = Field(default=None, nullable=True)
    cover_image_key: str = Field(max_length=255, nullable=False)
<<<<<<< HEAD
    cover_type: Optional[CoverTypeEnum] = Field(default=CoverTypeEnum.outside)
    status: ExhibitionStatusEnum = Field(
        default=ExhibitionStatusEnum.draft, nullable=False
    )
    date_template: DateTemplate = Field(
        default=DateTemplate.year, nullable=True
    )
    start_year: Optional[int] = Field(default=None, nullable=True)
    end_year: Optional[int] = Field(default=None, nullable=True)
=======
    cover_type: CoverTypeEnum | None = Field(default=CoverTypeEnum.outside)
    status: ExhibitionStatusEnum = Field(default=ExhibitionStatusEnum.draft, nullable=False)
>>>>>>> origin/main
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
<<<<<<< HEAD
    is_liked_by_current_user: Optional[bool] = None
    likes_count: Optional[int] = Field(default=0)
    blocks: Optional[list[ExhibitionBlockPublic]] = None
=======
    is_liked_by_current_user: bool | None = None
    likes_count: int | None = Field(default=0)
    blocks: list[ExhibitionBlockPublic] | None = None
>>>>>>> origin/main


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
