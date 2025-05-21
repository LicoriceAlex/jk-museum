from uuid import UUID
from sqlmodel import SQLModel, Field
from datetime import datetime


class UserExhibitionLike(SQLModel, table=True):
    __tablename__ = "user_exhibition_likes"

    exhibition_id: UUID = Field(foreign_key="exhibitions.id", primary_key=True, nullable=False)
    user_id: UUID = Field(foreign_key="users.id", primary_key=True, nullable=False)

    created_at: datetime = Field(default_factory=datetime.now)