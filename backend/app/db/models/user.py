import datetime
from typing import List, Optional
import uuid
from pydantic import EmailStr
from sqlmodel import Field, SQLModel


class UserBase(SQLModel):
    name: str = Field(max_length=255, nullable=True)
    surname: str = Field(max_length=255, nullable=True)
    email: EmailStr = Field(max_length=255, nullable=True)
    patronymic: str = Field(max_length=255, nullable=True)
    updated_at: Optional[datetime.datetime] = Field(
        default_factory=datetime.datetime.now, nullable=True)
    created_at: Optional[datetime.datetime] = Field(
        default_factory=datetime.datetime.now, nullable=True)


class UserCreate(UserBase):
    password: str = Field(min_length=8, max_length=40)


class UserRegister(SQLModel):
    email: EmailStr
    password: str
    name: str
    surname: str
    patronymic: str


class UserUpdate(UserBase):
    email: Optional[EmailStr] = Field(default=None, max_length=255)


class UserUpdateMe(UserBase):
    email: Optional[EmailStr] = Field(default=None, max_length=255)
    updated_at: datetime.datetime = Field(
        default_factory=datetime.datetime.now)


class UserPublic(UserBase):
    id: uuid.UUID


class User(UserBase, table=True):
    __tablename__ = 'users'
    id: Optional[uuid.UUID] = Field(
        primary_key=True, default_factory=uuid.uuid4)
    hashed_password: Optional[str] = Field(default=None, nullable=True)


class UsersPublic(SQLModel):
    data: List[UserPublic]
    count: int
