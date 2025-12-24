from backend.app.core.config import settings
from backend.app.db.models.exhibit import Exhibit, ExhibitCreate, ExhibitsPublic, ExhibitUpdate
from backend.app.utils.logger import log_method_call
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession


@log_method_call
async def get_exhibit(session: AsyncSession, **filters) -> Exhibit | None:
    statement = select(Exhibit).filter_by(**filters)
    result = await session.execute(statement)
    exhibit = result.scalar_one_or_none()
    return exhibit


@log_method_call
async def create_exhibit(session: AsyncSession, exhibit_in: ExhibitCreate) -> Exhibit:
    exhibit = Exhibit(**exhibit_in.model_dump())
    session.add(exhibit)
    await session.commit()
    await session.refresh(exhibit)
    return exhibit


@log_method_call
async def update_exhibit(
    session: AsyncSession,
    exhibit: Exhibit,
    exhibit_in: ExhibitUpdate,
) -> Exhibit:
    update_data = exhibit_in.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(exhibit, key, value)
    session.add(exhibit)
    await session.commit()
    await session.refresh(exhibit)
    return exhibit


@log_method_call
async def delete_exhibit(session: AsyncSession, exhibit: Exhibit) -> Exhibit:
    await session.delete(exhibit)
    await session.commit()
    return exhibit


@log_method_call
async def get_exhibits(
    session: AsyncSession,
    skip: int = 0,
    limit: int = settings.DEFAULT_QUERY_LIMIT,
) -> ExhibitsPublic:
    statement = select(Exhibit).offset(skip).limit(limit)
    exhibits = (await session.execute(statement)).scalars().all()
    count = (await session.execute(select(func.count(Exhibit.id)))).scalar_one()
    return ExhibitsPublic(data=exhibits, count=count)
