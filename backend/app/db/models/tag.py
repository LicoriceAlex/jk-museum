from uuid import UUID, uuid4
from datetime import datetime
from sqlmodel import Field, Relationship, SQLModel
from typing import TYPE_CHECKING, List, Optional


if TYPE_CHECKING:
    pass


class TagBase(SQLModel):
    name: str = Field(max_length=100, nullable=False)
    
    
class Tag(TagBase, table=True):
    __tablename__ = "tags"
    
    id: UUID = Field(primary_key=True, nullable=False, default_factory=uuid4)
    created_at: datetime = Field(default_factory=datetime.now)
    
    
class TagCreate(TagBase):
    pass
