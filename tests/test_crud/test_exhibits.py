import datetime
import pytest
from uuid import uuid4

from backend.app.crud import exhibit as exhibit_crud
from backend.app.db.models.exhibit import Exhibit, ExhibitCreate, ExhibitType
from backend.app.db.models.organization import Organization, OrganizationCreate
from sqlalchemy.ext.asyncio import AsyncSession

TEST_EXHIBIT_TITLE = "Test Painting"
TEST_EXHIBIT_AUTHOR = "Test Artist"
TEST_EXHIBIT_DESCRIPTION = "Test Description"
TEST_EXHIBIT_IMAGE_URL = "http://example.com/image.jpg"
TEST_EXHIBIT_TYPE = ExhibitType.painting
UPDATED_EXHIBIT_TITLE = "Updated Painting"
UPDATED_EXHIBIT_AUTHOR = "Updated Artist"
TEST_2_EXHIBIT_TITLE = "Test Sculpture"
TEST_2_EXHIBIT_AUTHOR = "Test Artist 2"


@pytest.fixture
async def test_organization(db_session: AsyncSession) -> Organization:
    org_data = OrganizationCreate(
        name="Test Organization",
        email="test@gmail.com"
    )
    org = Organization(**org_data.model_dump())
    db_session.add(org)
    await db_session.commit()
    await db_session.refresh(org)
    return org


@pytest.fixture
async def test_exhibit(db_session: AsyncSession, test_organization) -> Exhibit:
    exhibit_data = ExhibitCreate(
        title=TEST_EXHIBIT_TITLE,
        author=TEST_EXHIBIT_AUTHOR,
        description=TEST_EXHIBIT_DESCRIPTION,
        image_key=TEST_EXHIBIT_IMAGE_URL,
        exhibit_type=TEST_EXHIBIT_TYPE,
        organization_id=test_organization.id
    )
    return await exhibit_crud.create_exhibit(db_session, exhibit_data)


@pytest.mark.asyncio
async def test_create_exhibit(db_session: AsyncSession, test_organization):
    exhibit_data = ExhibitCreate(
        title=TEST_EXHIBIT_TITLE,
        author=TEST_EXHIBIT_AUTHOR,
        description=TEST_EXHIBIT_DESCRIPTION,
        image_key=TEST_EXHIBIT_IMAGE_URL,
        exhibit_type=TEST_EXHIBIT_TYPE,
        organization_id=test_organization.id
    )

    created_exhibit = await exhibit_crud.create_exhibit(db_session, exhibit_data)

    assert created_exhibit is not None
    assert created_exhibit.title == TEST_EXHIBIT_TITLE
    assert created_exhibit.author == TEST_EXHIBIT_AUTHOR
    assert created_exhibit.description == TEST_EXHIBIT_DESCRIPTION
    assert created_exhibit.image_key == TEST_EXHIBIT_IMAGE_URL
    assert created_exhibit.exhibit_type == TEST_EXHIBIT_TYPE
    assert created_exhibit.organization_id == test_organization.id
    assert created_exhibit.created_at is not None


@pytest.mark.asyncio
async def test_get_exhibit(db_session: AsyncSession, test_exhibit):
    retrieved_exhibit = await exhibit_crud.get_exhibit(db_session, id=test_exhibit.id)

    assert retrieved_exhibit is not None
    assert retrieved_exhibit.id == test_exhibit.id
    assert retrieved_exhibit.title == TEST_EXHIBIT_TITLE
    assert retrieved_exhibit.author == TEST_EXHIBIT_AUTHOR
    assert retrieved_exhibit.description == TEST_EXHIBIT_DESCRIPTION
    assert retrieved_exhibit.image_key == TEST_EXHIBIT_IMAGE_URL
    assert retrieved_exhibit.exhibit_type == TEST_EXHIBIT_TYPE


@pytest.mark.asyncio
async def test_update_exhibit(db_session: AsyncSession, test_exhibit):
    update_data = ExhibitCreate(
        title=UPDATED_EXHIBIT_TITLE,
        author=UPDATED_EXHIBIT_AUTHOR,
        description=TEST_EXHIBIT_DESCRIPTION,
        image_key=TEST_EXHIBIT_IMAGE_URL,
        exhibit_type=ExhibitType.sculpture,
        organization_id=test_exhibit.organization_id
    )

    updated_exhibit = await exhibit_crud.update_exhibit(db_session, test_exhibit, update_data)

    assert updated_exhibit is not None
    assert updated_exhibit.id == test_exhibit.id
    assert updated_exhibit.title == UPDATED_EXHIBIT_TITLE
    assert updated_exhibit.author == UPDATED_EXHIBIT_AUTHOR
    assert updated_exhibit.exhibit_type == ExhibitType.sculpture


@pytest.mark.asyncio
async def test_delete_exhibit(db_session: AsyncSession, test_exhibit):
    deleted_exhibit = await exhibit_crud.delete_exhibit(db_session, test_exhibit)

    assert deleted_exhibit is not None
    assert deleted_exhibit.id == test_exhibit.id

    retrieved_exhibit = await exhibit_crud.get_exhibit(db_session, id=test_exhibit.id)
    assert retrieved_exhibit is None


@pytest.mark.asyncio
async def test_get_exhibits(db_session: AsyncSession, test_organization, test_exhibit):
    exhibit_data_2 = ExhibitCreate(
        title=TEST_2_EXHIBIT_TITLE,
        author=TEST_2_EXHIBIT_AUTHOR,
        description=TEST_EXHIBIT_DESCRIPTION,
        image_key=TEST_EXHIBIT_IMAGE_URL,
        exhibit_type=ExhibitType.sculpture,
        organization_id=test_organization.id
    )
    await exhibit_crud.create_exhibit(db_session, exhibit_data_2)

    exhibits = await exhibit_crud.get_exhibits(db_session, skip=0, limit=10)

    assert exhibits is not None
    assert len(exhibits.data) == 2
    assert exhibits.count == 2
    assert exhibits.data[0].title == TEST_EXHIBIT_TITLE
    assert exhibits.data[1].title == TEST_2_EXHIBIT_TITLE
    