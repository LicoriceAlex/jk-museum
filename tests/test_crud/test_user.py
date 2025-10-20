import pytest
from sqlalchemy.ext.asyncio import AsyncSession
from backend.app.db.models import (
    UserCreate,
    User,
    StatusEnum,
    UserUpdate
)
from backend.app.crud import user as user_crud
from backend.app.core.security import verify_password
from backend.app.core.config import settings
from backend.app.db.schemas import UpdatePassword


TEST_USER_EMAIL = "user@gmail.com"
TEST_USER_PASSWORD = "password"
TEST_USER_NAME = "Test"
TEST_USER_SURNAME = "User"
TEST_USER_PATRONYMIC = "Testovich"
UPDATED_USER_NAME = "Updated"
UPDATED_USER_SURNAME = "Updated"
UPDATED_USER_PATRONYMIC = "Updatedovich"
UPDATED_USER_EMAIL = "updated@gmail.com"
UPDATED_USER_PASSWORD = "updated_password"

@pytest.fixture
async def test_user(db_session: AsyncSession) -> User:
    user_data = UserCreate(
        email=TEST_USER_EMAIL,
        password=TEST_USER_PASSWORD,
        name=TEST_USER_NAME,
        surname=TEST_USER_SURNAME,
        patronymic=TEST_USER_PATRONYMIC,
    )
    return await user_crud.create_user(db_session, user_data)


@pytest.mark.asyncio
async def test_create_user(db_session: AsyncSession):
    user_data = UserCreate(
        email=TEST_USER_EMAIL,
        password=TEST_USER_PASSWORD,
        name=TEST_USER_NAME,
        surname=TEST_USER_SURNAME,
        patronymic=TEST_USER_PATRONYMIC,
    )

    created_user = await user_crud.create_user(db_session, user_data)

    assert created_user is not None
    assert created_user.email == TEST_USER_EMAIL
    assert created_user.name == TEST_USER_NAME
    assert created_user.surname == TEST_USER_SURNAME
    assert created_user.patronymic == TEST_USER_PATRONYMIC
    assert created_user.status == StatusEnum.active
    assert verify_password(
        TEST_USER_PASSWORD, created_user.hashed_password
    )
    assert created_user.created_at is not None
    
    
@pytest.mark.asyncio
async def test_duplicate_user_email(db_session: AsyncSession, test_user):
    duplicate_user_data = UserCreate(
        email=TEST_USER_EMAIL,
        password=TEST_USER_PASSWORD,
        name=TEST_USER_NAME,
        surname=TEST_USER_SURNAME,
        patronymic=TEST_USER_PATRONYMIC,
    )

    with pytest.raises(Exception) as excinfo:
        await user_crud.create_user(db_session, duplicate_user_data)

    assert "409" in str(excinfo.value)
    
    
@pytest.mark.asyncio
async def test_get_user(db_session: AsyncSession, test_user):
    retrieved_user = await user_crud.get_user(db_session, id=test_user.id)

    assert retrieved_user is not None
    assert retrieved_user.id == test_user.id
    assert retrieved_user.email == TEST_USER_EMAIL
    assert retrieved_user.name == TEST_USER_NAME
    assert retrieved_user.surname == TEST_USER_SURNAME
    assert retrieved_user.patronymic == TEST_USER_PATRONYMIC
    assert retrieved_user.status == StatusEnum.active
    assert verify_password(
        TEST_USER_PASSWORD, retrieved_user.hashed_password
    )
    
    
@pytest.mark.asyncio
async def test_update_user(db_session: AsyncSession, test_user):
    updated_user_data = UserUpdate(
        name=UPDATED_USER_NAME,
        surname=UPDATED_USER_SURNAME,
        patronymic=UPDATED_USER_PATRONYMIC,
        email=UPDATED_USER_EMAIL,
    )
    
    updated_user = await user_crud.update_user(db_session, test_user, updated_user_data)
    
    assert updated_user is not None
    assert updated_user.id == test_user.id
    assert updated_user.email == UPDATED_USER_EMAIL
    assert updated_user.name == UPDATED_USER_NAME
    assert updated_user.surname == UPDATED_USER_SURNAME
    assert updated_user.patronymic == UPDATED_USER_PATRONYMIC
    assert updated_user.status == StatusEnum.active


@pytest.mark.asyncio
async def test_change_user_password(db_session: AsyncSession, test_user):
    updated_user = await user_crud.change_password(
        db_session, test_user,
        TEST_USER_PASSWORD,
        UPDATED_USER_PASSWORD
    )

    assert updated_user is not None
    assert updated_user.id == test_user.id
    assert verify_password(
        UPDATED_USER_PASSWORD, updated_user.hashed_password
    )
    
    
@pytest.mark.asyncio
async def test_ban_user(db_session: AsyncSession, test_user):
    banned_user = await user_crud.ban_user(db_session, test_user)

    assert banned_user is not None
    assert banned_user.id == test_user.id
    assert banned_user.status == StatusEnum.blocked
    

@pytest.mark.asyncio
async def test_unban_user(db_session: AsyncSession, test_user):
    banned_user = await user_crud.ban_user(db_session, test_user)
    unbanned_user = await user_crud.unban_user(db_session, banned_user)

    assert unbanned_user is not None
    assert unbanned_user.id == test_user.id
    assert unbanned_user.status == StatusEnum.active
