from datetime import datetime
from typing import TYPE_CHECKING
from uuid import UUID, uuid4

from sqlmodel import Field, SQLModel

if TYPE_CHECKING:
    pass


class ExhibitionBlockItemBase(SQLModel):
    image_key: str = Field(default=None, nullable=False)
    text: str | None = Field(default=None, nullable=True)
    position: int = Field(default=None, nullable=True)


class ExhibitionBlockItem(ExhibitionBlockItemBase, table=True):
    __tablename__ = "exhibition_block_items"

    id: UUID = Field(primary_key=True, nullable=False, default_factory=uuid4)
    block_id: UUID = Field(foreign_key="exhibition_blocks.id", nullable=False, ondelete="CASCADE")

    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(
        default_factory=datetime.now,
        sa_column_kwargs={"onupdate": datetime.now},
    )


class ExhibitionBlockItemCreate(ExhibitionBlockItemBase):
    pass
