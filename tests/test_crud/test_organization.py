import pytest
from backend.app.crud import organization as organization_crud
from backend.app.db.models.organization import OrgStatusEnum, Organization, OrganizationCreate
from sqlalchemy.ext.asyncio import AsyncSession

TEST_ORG_NAME = "Test Organization"
TEST_ORG_EMAIL = "test@gmail.com"
UPDATED_ORG_NAME = "Updated Org"
UPDATED_ORG_EMAIL = "updated@gmail.com"
TEST_2_ORG_NAME = "Test Organization 2"
TEST_2_ORG_EMAIL = "test2@gmail.com"


@pytest.fixture
async def test_organization(db_session: AsyncSession) -> Organization:
    org_data = OrganizationCreate(
        name=TEST_ORG_NAME,
        email=TEST_ORG_EMAIL
    )
    return await organization_crud.create_organization(db_session, org_data)


@pytest.mark.asyncio
async def test_create_organization(db_session: AsyncSession):
    org_data = OrganizationCreate(
        name=TEST_ORG_NAME,
        email=TEST_ORG_EMAIL
    )

    created_org = await organization_crud.create_organization(db_session, org_data)

    assert created_org is not None
    assert created_org.name == TEST_ORG_NAME
    assert created_org.email == TEST_ORG_EMAIL
    assert created_org.status == OrgStatusEnum.pending
    assert created_org.created_at is not None
    
    
@pytest.mark.asyncio
async def test_duplicate_organization_email(db_session: AsyncSession, test_organization):
    duplicate_org_data = OrganizationCreate(
        name="Duplicate Org",
        email=TEST_ORG_EMAIL
    )

    with pytest.raises(Exception) as excinfo:
        await organization_crud.create_organization(db_session, duplicate_org_data)

    assert "duplicate key value violates unique constraint" in str(excinfo.value)


@pytest.mark.asyncio
async def test_get_organization(db_session: AsyncSession, test_organization):
    retrieved_org = await organization_crud.get_organization(db_session, id=test_organization.id)

    assert retrieved_org is not None
    assert retrieved_org.id == test_organization.id
    assert retrieved_org.name == TEST_ORG_NAME
    assert retrieved_org.email == TEST_ORG_EMAIL
    assert retrieved_org.status == OrgStatusEnum.pending


@pytest.mark.asyncio
async def test_update_organization(db_session: AsyncSession, test_organization):
    update_data = OrganizationCreate(
        name=UPDATED_ORG_NAME,
        email=UPDATED_ORG_EMAIL
    )

    updated_org = await organization_crud.update_organization(db_session, test_organization, update_data)

    assert updated_org is not None
    assert updated_org.id == test_organization.id
    assert updated_org.name == UPDATED_ORG_NAME
    assert updated_org.email == UPDATED_ORG_EMAIL


@pytest.mark.asyncio
async def test_delete_organization(db_session: AsyncSession, test_organization):
    deleted_org = await organization_crud.delete_organization(db_session, test_organization)

    assert deleted_org is not None
    assert deleted_org.id == test_organization.id

    retrieved_org = await organization_crud.get_organization(db_session, id=test_organization.id)
    assert retrieved_org is None
    
    
@pytest.mark.asyncio
async def test_confirm_organization(db_session: AsyncSession, test_organization):
    confirmed_org = await organization_crud.confirm_organization(db_session, test_organization)

    assert confirmed_org is not None
    assert confirmed_org.id == test_organization.id
    assert confirmed_org.status == OrgStatusEnum.approved
    
    
@pytest.mark.asyncio
async def test_reject_organization(db_session: AsyncSession, test_organization):
    rejected_org = await organization_crud.reject_organization(db_session, test_organization)

    assert rejected_org is not None
    assert rejected_org.id == test_organization.id
    assert rejected_org.status == OrgStatusEnum.rejected
    
    
@pytest.mark.asyncio
async def test_get_organizations(db_session: AsyncSession, test_organization):
    org_data_2 = OrganizationCreate(
        name=TEST_2_ORG_NAME,
        email=TEST_2_ORG_EMAIL
    )
    await organization_crud.create_organization(db_session, org_data_2)

    organizations = await organization_crud.get_organizations(db_session, skip=0, limit=10)

    assert organizations is not None
    assert len(organizations.data) == 2
    assert organizations.count == 2
    assert organizations.data[0].name == TEST_ORG_NAME
    assert organizations.data[1].name == TEST_2_ORG_NAME
