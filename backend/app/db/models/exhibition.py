from sqlmodel import Field, SQLModel
from uuid import UUID, uuid4
from enum import Enum
from datetime import datetime
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy import Column
from typing import TYPE_CHECKING, Optional

from backend.app.db.models.tag import TagPublic



if TYPE_CHECKING:
    from backend.app.db.models.exhibition_participant import ExhibitionParticipant
    from backend.app.db.models.exhibition_tag import ExhibitionTag
    from backend.app.db.models.tag import Tag


class ExhibitionStatusEnum(str, Enum):
    draft = "draft"
    published = "published"
    archived = "archived"
    
    
class CoverTypeEnum(str, Enum):
    inside = "inside"
    outside = "outside"


class ExhibitionBase(SQLModel):
    title: str = Field(max_length=255, nullable=False)
    cover_image_key: str = Field(max_length=255, nullable=False)
    cover_type: Optional[CoverTypeEnum] = Field(default=CoverTypeEnum.outside)
    status: ExhibitionStatusEnum = Field(default=ExhibitionStatusEnum.draft, nullable=False)
    rating: float = Field(default=0.0, nullable=False) # ?
    settings: dict = Field(sa_column=Column(JSONB, nullable=False))
    
    
class Exhibition(ExhibitionBase, table=True):
    __tablename__ = "exhibitions"
    
    id: UUID = Field(primary_key=True, nullable=False, default_factory=uuid4)
    
    organization_id: Optional[UUID] = Field(foreign_key="organizations.id", nullable=True)
    
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(
        default_factory=datetime.now,
        sa_column_kwargs={"onupdate": datetime.now}
    )
    

class ExhibitionCreate(ExhibitionBase):
    participants: list[str]
    tags: list[str]
    
    
class ExhibitionUpdate(ExhibitionBase):
    tags: Optional[list[str]] = None
    participants: Optional[list[str]] = None
    
    
class ExhibitionPublic(ExhibitionBase):
    id: UUID
    organization_id: Optional[UUID]
    created_at: datetime
    updated_at: datetime
    participants: list["ExhibitionParticipant"]
    tags: list["TagPublic"]
    
    
class ExhibitionsPublic(SQLModel):
    data: list["ExhibitionPublic"]
    count: int
    
    
class ExhibitionPublicResponse(SQLModel):
    id: UUID
    title: str
    cover_image_key: str
    cover_type: str
    organization_id: UUID
    status: str
    rating: float
    participants: list['ExhibitionParticipant']
    tags: list['Tag']
    settings: dict
    created_at: datetime
    updated_at: datetime

