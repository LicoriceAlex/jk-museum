from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy import Column
from sqlmodel import Field, SQLModel
from uuid import UUID, uuid4
from datetime import datetime
from typing import TYPE_CHECKING, Optional


if TYPE_CHECKING:
    pass


class TemplateBase(SQLModel):
    name: str =  Field(max_length=100, nullable=False)
    description: Optional[str] = Field(nullable=True)
    preview_image_key: Optional[str] = Field(nullable=True)
    settings: dict = Field(sa_column=Column(JSONB, nullable=False))
    is_public: bool = Field(default=False, nullable=False)
    
    
class Template(TemplateBase, table=True):
    __tablename__ = "templates"
    
    id: UUID = Field(primary_key=True, nullable=False, default_factory=uuid4)
    
    organization_id: UUID = Field(foreign_key="organizations.id", nullable=True)
    
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(
        default_factory=datetime.now,
        sa_column_kwargs={"onupdate": datetime.now}
    )
    

class TemplateCreate(TemplateBase):
    pass


class TemplateUpdate(SQLModel):
    name: Optional[str] = None
    description: Optional[str] = None
    preview_image_key: Optional[str] = None
    settings: Optional[dict] = None
    is_public: Optional[bool] = None
    
    