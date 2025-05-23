from typing import Optional
from uuid import UUID
from sqlalchemy import delete, func, select
from sqlalchemy.ext.asyncio import AsyncSession

from backend.app.core.config import settings
from backend.app.db.models.exhibition_participant import (
    ExhibitionParticipant,
    ExhibitionParticipantCreate
)


async def get_exhibition_participant(
    session: AsyncSession,
    **filters
) -> Optional[ExhibitionParticipant]:
    statement = select(ExhibitionParticipant).filter_by(**filters)
    result = await session.execute(statement)
    exhibition_participant = result.scalar_one_or_none()
    return exhibition_participant


async def create_exhibition_participants(
    session: AsyncSession,
    exhibition_participant_names: list[str],
    exhibition_id: UUID
) -> list[ExhibitionParticipant]:
    exhibition_participant_list = []
    for exhibition_participant_name in exhibition_participant_names:
        exhibition_participant = ExhibitionParticipant(
            name=exhibition_participant_name,
            exhibition_id=exhibition_id
        )
        session.add(exhibition_participant)
        await session.commit()
        await session.refresh(exhibition_participant)
        exhibition_participant_list.append(exhibition_participant)
    return exhibition_participant_list


async def update_exhibition_participants(
    session: AsyncSession,
    participants_in: Optional[list[str]],
    exhibition_id: UUID
) -> Optional[list[ExhibitionParticipant]]:
    if participants_in is None:
        return None
    await session.execute(delete(ExhibitionParticipant).where(ExhibitionParticipant.exhibition_id == exhibition_id))
    await session.commit()
    return await create_exhibition_participants(session, participants_in, exhibition_id)
