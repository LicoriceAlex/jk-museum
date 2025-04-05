import pytest

from backend.app.crud import organization as organization_crud
from backend.app.db.models.organization import OrganizationCreate
from sqlalchemy.ext.asyncio import AsyncSession


@pytest.mark.asyncio
async def test_create_organization(db_session: AsyncSession):
    org_data = OrganizationCreate(
        name="Test Organization",
        email="test@gmail.com"
    )

    created_org = await organization_crud.create_organization(db_session, org_data)

    assert created_org is not None
    assert created_org.name == "Test Organization"
    assert created_org.email == "test@gmail.com"
    
@pytest.mark.asyncio
async def test_get_organization(db_session: AsyncSession):
    org_data = OrganizationCreate(
        name="Test Org for Get",
        email="test@gmail.com"
    )
    created_org = await organization_crud.create_organization(db_session, org_data)
    retrieved_org = await organization_crud.get_organization(db_session, id=created_org.id)
    assert retrieved_org is not None
    assert retrieved_org.id == created_org.id
    assert retrieved_org.name == "Test Org for Get"
    assert retrieved_org.email == "test@gmail.com"
    