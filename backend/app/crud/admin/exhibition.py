import uuid

from backend.app.db.models.exhibition import Exhibition, ExhibitionStatusEnum
from sqlalchemy.ext.asyncio import AsyncSession


async def update_exhibition_status(
    session: AsyncSession,
    exhibition_id: uuid.UUID,
    user_id: uuid.UUID,
    new_status: ExhibitionStatusEnum,
) -> Exhibition:
    exhibition = await session.get(Exhibition, exhibition_id)
    exhibition.status = new_status
    session.add(exhibition)
    await session.commit()
    await session.refresh(exhibition)
    return exhibition
