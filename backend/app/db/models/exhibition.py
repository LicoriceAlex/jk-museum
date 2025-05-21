from sqlmodel import Field, SQLModel
from uuid import UUID, uuid4
from enum import Enum
from datetime import datetime
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy import Column
from typing import TYPE_CHECKING, Optional


if TYPE_CHECKING:
    pass


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
    
    organization_id: UUID = Field(foreign_key="organizations.id", nullable=False)
    
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(
        default_factory=datetime.now,
        sa_column_kwargs={"onupdate": datetime.now}
    )