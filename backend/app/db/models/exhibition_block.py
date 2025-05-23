from enum import Enum
from sqlmodel import Field, SQLModel
from uuid import UUID, uuid4
from datetime import datetime
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy import Column
from typing import TYPE_CHECKING, Optional

from backend.app.db.models.exhibition_block_item import ExhibitionBlockItemCreate


if TYPE_CHECKING:
    pass


class ExhibitionBlockTypeEnum(str, Enum):
    HEADER = "HEADER"
    TEXT = "TEXT"
    QUOTE = "QUOTE"
    IMAGE_TEXT_RIGHT = "IMAGE_TEXT_RIGHT"
    IMAGE_TEXT_LEFT = "IMAGE_TEXT_LEFT"
    LAYOUT_IMG_TEXT_IMG = "LAYOUT_IMG_TEXT_IMG"
    LAYOUT_TEXT_IMG_TEXT = "LAYOUT_TEXT_IMG_TEXT"
    IMAGES_2 = "IMAGES_2"
    IMAGES_3 = "IMAGES_3"
    IMAGES_4 = "IMAGES_4"
    CAROUSEL = "CAROUSEL"
    
    
class ExhibitionBlockBase(SQLModel):
    type: ExhibitionBlockTypeEnum = Field(nullable=False)
    content: Optional[str] = Field(nullable=True)
    settings: dict = Field(sa_column=Column(JSONB, nullable=False))
    position: Optional[int] = Field(nullable=False)


class ExhibitionBlock(ExhibitionBlockBase, table=True):
    __tablename__ = "exhibition_blocks"

    id: UUID = Field(primary_key=True, nullable=False, default_factory=uuid4)

    exhibition_id: UUID = Field(foreign_key="exhibitions.id", nullable=False, index=True, ondelete="CASCADE")

    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(
        default_factory=datetime.now,
        sa_column_kwargs={"onupdate": datetime.now}
    )
    
    
class ExhibitionBlockCreate(ExhibitionBlockBase):
    exhibition_id: UUID
    
    
class ExhibitionBlockUpdateBase(ExhibitionBlockBase):
    pass


class ExhibitionBlockUpdate(ExhibitionBlockUpdateBase):
    items: Optional[list[ExhibitionBlockItemCreate]]
