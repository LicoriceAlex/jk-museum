import datetime
from enum import Enum
from typing import TYPE_CHECKING
from uuid import UUID, uuid4

from sqlmodel import Field, Relationship, SQLModel

if TYPE_CHECKING:
<<<<<<< HEAD
    from backend.app.db.models import Organization
    
    
=======
    from backend.app.db.models.organization import Organization


>>>>>>> origin/main
class ExhibitType(str, Enum):
    painting = "картина"
    sculpture = "скульптура"
    other = "другое"


class DateTemplate(str, Enum):
    year: str = "year"
    decade: str = "decade"
    century: str = "century"


class ExhibitBase(SQLModel):
    title: str = Field(max_length=255, nullable=False)
    author: str = Field(max_length=255, nullable=False)
    creation_date: datetime.date = Field(default_factory=datetime.date.today)
    description: str = Field(max_length=255)
    exhibit_type: ExhibitType = Field(default=ExhibitType.other, nullable=False)
    image_key: str = Field(max_length=255, nullable=False)
    date_template: DateTemplate | None = Field(default=DateTemplate.year, nullable=True)
    start_year: int | None = Field(default=None, nullable=True)
    end_year: int | None = Field(default=None, nullable=True)


class Exhibit(ExhibitBase, table=True):
    __tablename__ = "exhibits"

    id: UUID = Field(primary_key=True, nullable=False, default_factory=uuid4)
    organization_id: UUID = Field(foreign_key="organizations.id", nullable=False)

    created_at: datetime.datetime = Field(default_factory=datetime.datetime.now)
    updated_at: datetime.datetime = Field(
        default_factory=datetime.datetime.now,
        sa_column_kwargs={"onupdate": datetime.datetime.now},
    )

    organization: "Organization" = Relationship(back_populates="exhibits")


class ExhibitCreate(ExhibitBase):
    organization_id: UUID


class ExhibitUpdate(SQLModel):
    title: str | None = None
    author: str | None = None
    creation_date: datetime.date | None = None
    description: str | None = None
    exhibit_type: ExhibitType | None = None
    image_key: str | None = None
    date_template: DateTemplate | None = None
    start_year: int | None = None
    end_year: int | None = None


class ExhibitPublic(ExhibitBase):
    id: UUID
    organization_id: UUID
    created_at: datetime.datetime
    updated_at: datetime.datetime


class ExhibitsPublic(SQLModel):
    data: list[ExhibitPublic]
    count: int
