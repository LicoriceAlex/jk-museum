import datetime
from enum import Enum
from typing import TYPE_CHECKING, Optional
from uuid import UUID, uuid4

from sqlmodel import Field, Relationship, SQLModel


if TYPE_CHECKING:
    from backend.app.db.models import Organization
    
    
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
    date_template: DateTemplate = Field(
        default=DateTemplate.year, nullable=True
    )
    start_year: Optional[int] = Field(default=None, nullable=True)
    end_year: Optional[int] = Field(default=None, nullable=True)
    

class Exhibit(ExhibitBase, table=True):
    __tablename__ = "exhibits"
    
    id: UUID = Field(primary_key=True, nullable=False, default_factory=uuid4)
    organization_id: UUID = Field(foreign_key="organizations.id", nullable=False)
    
    created_at: datetime.datetime = Field(default_factory=datetime.datetime.now)
    updated_at: datetime.datetime = Field(
        default_factory=datetime.datetime.now,
        sa_column_kwargs={"onupdate": datetime.datetime.now}
    )
    
    organization: "Organization" = Relationship(back_populates="exhibits")
    
    
class ExhibitCreate(ExhibitBase):
    organization_id: UUID
    
    
class ExhibitUpdate(SQLModel):
    title: Optional[str] = None
    author: Optional[str] = None
    creation_date: Optional[datetime.date] = None
    description: Optional[str] = None
    exhibit_type: Optional[ExhibitType] = None
    image_key: Optional[str] = None
    date_template: Optional[DateTemplate] = None
    start_year: Optional[int] = None
    end_year: Optional[int] = None


class ExhibitPublic(ExhibitBase):
    id: UUID
    organization_id: UUID
    created_at: datetime.datetime
    updated_at: datetime.datetime
    
    
class ExhibitsPublic(SQLModel):
    data: list[ExhibitPublic]
    count: int
    