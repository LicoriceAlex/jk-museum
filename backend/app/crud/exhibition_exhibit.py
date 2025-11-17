from uuid import UUID
from typing import Optional
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from backend.app.db.models import (
    Exhibit,
    ExhibitionExhibit,
    ExhibitionExhibitCreate,
    Exhibition
)
from backend.app.utils.logger import log_method_call


@log_method_call
async def get_exhibition_exhibit(
    session: AsyncSession,
    exhibition_id: UUID,
    exhibit_id: UUID
) -> Optional[ExhibitionExhibit]:
    stmt = select(ExhibitionExhibit).where(
        ExhibitionExhibit.exhibition_id == exhibition_id,
        ExhibitionExhibit.exhibit_id == exhibit_id
    )
    result = await session.execute(stmt)
    return result.scalar_one_or_none()


@log_method_call
async def validate_exhibition_exists(
    session: AsyncSession,
    exhibition_id: UUID
) -> None:
    exhibition = await session.get(Exhibition, exhibition_id)
    if not exhibition:
        raise ValueError(f"Exhibition {exhibition_id} not found")


@log_method_call
async def validate_exhibit_exists(
    session: AsyncSession,
    exhibit_id: UUID
) -> None:
    exhibit = await session.get(Exhibit, exhibit_id)
    if not exhibit:
        raise ValueError(f"Exhibit {exhibit_id} not found")


@log_method_call
async def create_exhibition_exhibit(
    session: AsyncSession,
    exhibition_exhibit_in: ExhibitionExhibitCreate,
) -> ExhibitionExhibit:
    await validate_exhibition_exists(session, exhibition_exhibit_in.exhibition_id)
    await validate_exhibit_exists(session, exhibition_exhibit_in.exhibit_id)

    existing = await get_exhibition_exhibit(
        session,
        exhibition_id=exhibition_exhibit_in.exhibition_id,
        exhibit_id=exhibition_exhibit_in.exhibit_id
    )
    if existing:
        return existing

    link = ExhibitionExhibit(**exhibition_exhibit_in.model_dump())
    session.add(link)
    await session.commit()
    await session.refresh(link)
    return link
