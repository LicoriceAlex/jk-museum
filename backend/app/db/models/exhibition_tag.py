from sqlmodel import SQLModel, Field, Relationship
from uuid import UUID, uuid4
from sqlalchemy.orm import relationship
from typing import TYPE_CHECKING, Optional

if TYPE_CHECKING:
    from backend.app.db.models.exhibition import Exhibition
    from backend.app.db.models.tag import Tag


class ExhibitionTag(SQLModel, table=True):
    __tablename__ = "exhibition_tags"

    exhibition_id: UUID = Field(foreign_key="exhibitions.id", primary_key=True, nullable=False, ondelete="CASCADE")
    tag_id: UUID = Field(foreign_key="tags.id", primary_key=True, nullable=False, ondelete="CASCADE")
    
    exhibition: "Exhibition" = Relationship(back_populates="exhibition_tags")
    tag: "Tag" = Relationship(back_populates="exhibition_tags")
    

class ExhibitionTagCreate(SQLModel):
    exhibition_id: UUID
    tag_id: UUID
    