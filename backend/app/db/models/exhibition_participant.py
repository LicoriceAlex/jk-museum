from sqlmodel import Field, Relationship, SQLModel
from uuid import UUID, uuid4
from datetime import datetime
from typing import TYPE_CHECKING, Optional, List


if TYPE_CHECKING:
    from backend.app.db.models.exhibition import Exhibition


class ExhibitionParticipantBase(SQLModel):
    name: str = Field(max_length=100, nullable=False)
    

class ExhibitionParticipant(ExhibitionParticipantBase, table=True):
    __tablename__ = "exhibition_participants"
    
    id: UUID = Field(primary_key=True, nullable=False, default_factory=uuid4)
    exhibition_id: UUID = Field(foreign_key="exhibitions.id", nullable=False, ondelete="CASCADE")
    
    created_at: datetime = Field(default_factory=datetime.now)
    
    exhibition: "Exhibition" = Relationship(back_populates="participants")
    

class ExhibitionParticipantCreate(ExhibitionParticipantBase):
    exhibition_id: UUID
