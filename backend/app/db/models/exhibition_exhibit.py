from uuid import UUID
from sqlmodel import Field, SQLModel


class ExhibitionExhibit(SQLModel, table=True):
    __tablename__ = "exhibition_exhibits"

    exhibition_id: UUID = Field(foreign_key="exhibitions.id", primary_key=True, nullable=False, ondelete="CASCADE")
    exhibit_id: UUID = Field(foreign_key="exhibits.id", primary_key=True, nullable=False, ondelete="CASCADE")
    
    
class ExhibitionExhibitCreate(SQLModel):
    exhibition_id: UUID
    exhibit_id: UUID
