from datetime import datetime
from typing import TYPE_CHECKING
from uuid import UUID, uuid4

from sqlalchemy import Column
from sqlalchemy.dialects.postgresql import JSONB
from sqlmodel import Field, SQLModel

if TYPE_CHECKING:
    pass


class TemplateBase(SQLModel):
    name: str = Field(max_length=100, nullable=False)
    description: str | None = Field(nullable=True)
    preview_image_key: str | None = Field(nullable=True)
    settings: dict = Field(sa_column=Column(JSONB, nullable=False))
    is_public: bool = Field(default=False, nullable=False)


class Template(TemplateBase, table=True):
    __tablename__ = "templates"

    id: UUID = Field(primary_key=True, nullable=False, default_factory=uuid4)

    organization_id: UUID = Field(foreign_key="organizations.id", nullable=True)

    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(
        default_factory=datetime.now,
        sa_column_kwargs={"onupdate": datetime.now},
    )


class TemplateCreate(TemplateBase):
    pass


class TemplateUpdate(SQLModel):
    name: str | None = None
    description: str | None = None
    preview_image_key: str | None = None
    settings: dict | None = None
    is_public: bool | None = None
