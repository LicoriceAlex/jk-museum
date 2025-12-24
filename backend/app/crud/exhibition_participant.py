from uuid import UUID
<<<<<<< HEAD
from sqlalchemy import delete, select
from sqlalchemy.ext.asyncio import AsyncSession

from backend.app.db.models import (
    ExhibitionParticipant,
)
from backend.app.utils.logger import log_method_call
=======

from backend.app.db.models.exhibition_participant import (
    ExhibitionParticipant,
)
from backend.app.utils.logger import log_method_call
from sqlalchemy import delete, select
from sqlalchemy.ext.asyncio import AsyncSession
>>>>>>> origin/main


@log_method_call
async def get_exhibition_participant(
    session: AsyncSession,
    **filters,
) -> ExhibitionParticipant | None:
    statement = select(ExhibitionParticipant).filter_by(**filters)
    result = await session.execute(statement)
    exhibition_participant = result.scalar_one_or_none()
    return exhibition_participant


@log_method_call
async def create_exhibition_participants(
    session: AsyncSession,
    exhibition_participant_names: list[str],
    exhibition_id: UUID,
) -> list[ExhibitionParticipant]:
    exhibition_participant_list = []
    for exhibition_participant_name in exhibition_participant_names:
        exhibition_participant = ExhibitionParticipant(
            name=exhibition_participant_name,
            exhibition_id=exhibition_id,
        )
        session.add(exhibition_participant)
        await session.commit()
        await session.refresh(exhibition_participant)
        exhibition_participant_list.append(exhibition_participant)
    return exhibition_participant_list


@log_method_call
async def update_exhibition_participants(
    session: AsyncSession,
    participants_in: list[str] | None,
    exhibition_id: UUID,
) -> list[ExhibitionParticipant] | None:
    if participants_in is None:
        return None
    await session.execute(
        delete(ExhibitionParticipant).where(ExhibitionParticipant.exhibition_id == exhibition_id),
    )
    await session.commit()
    return await create_exhibition_participants(session, participants_in, exhibition_id)


@log_method_call
async def get_exhibition_participants(
    session: AsyncSession,
    exhibition_id: UUID,
) -> list[ExhibitionParticipant] | None:
    statement = select(ExhibitionParticipant).filter_by(exhibition_id=exhibition_id)
    result = await session.execute(statement)
    exhibition_participants = result.scalars().all()
    return exhibition_participants
