from sqlmodel import SQLModel, Field
from uuid import UUID, uuid4


class ExhibitionTag(SQLModel, table=True):
    __tablename__ = "exhibition_tags"

    exhibition_id: UUID = Field(foreign_key="exhibitions.id", primary_key=True, nullable=False)
    tag_id: UUID = Field(foreign_key="tags.id", primary_key=True, nullable=False)