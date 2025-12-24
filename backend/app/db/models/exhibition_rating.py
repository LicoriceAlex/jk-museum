from datetime import datetime
from typing import TYPE_CHECKING
from uuid import UUID

from sqlmodel import Field, SQLModel

if TYPE_CHECKING:
    pass


class ExhibitionRatingBase(SQLModel):
    rating: int = Field(default=0, nullable=False)
    comment: str | None = Field(default=None, nullable=True)


class ExhibitionRating(ExhibitionRatingBase, table=True):
    __tablename__ = "exhibition_ratings"

    exhibition_id: UUID = Field(foreign_key="exhibitions.id", primary_key=True, nullable=False)
    user_id: UUID = Field(foreign_key="users.id", primary_key=True, nullable=False)

    rating: int = Field(default=0, nullable=False)
    comment: str | None = Field(default=None, nullable=True)
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(
        default_factory=datetime.now,
        sa_column_kwargs={"onupdate": datetime.now},
    )
