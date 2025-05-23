from typing import Optional
from uuid import UUID
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from backend.app.core.config import settings
from backend.app.crud.exhibition_participant import create_exhibition_participants, update_exhibition_participants
from backend.app.crud.exhibition_tag import create_or_exist_exhibition_tags, delete_exhibition_tags
from backend.app.crud.tag import create_or_exist_tags
from backend.app.db.models.exhibition import (
    Exhibition,
    ExhibitionCreate,
    ExhibitionUpdate,
    ExhibitionsPublic,
    ExhibitionPublic,
)


async def get_exhibition(
    session: AsyncSession,
    **filters
) -> Optional[Exhibition]:
    statement = select(Exhibition).filter_by(**filters)
    result = await session.execute(statement)
    exhibition = result.scalar_one_or_none()
    return exhibition


async def create_exhibition(
    session: AsyncSession,
    exhibition_in: ExhibitionCreate
) -> ExhibitionPublic:
    exhibition = await _create_base_exhibition(session, exhibition_in)
    exhibition_id = exhibition.id
    exhibition = exhibition.model_dump()
    participants = await _add_exhibition_participants(
        session, exhibition_in.participants, exhibition_id
    )
    tags = await _add_exhibition_tags(
        session, exhibition_in.tags, exhibition_id
    )
    return ExhibitionPublic(
        **exhibition,
        participants=participants,
        tags=tags,
    )


async def _create_base_exhibition(
    session: AsyncSession, exhibition_in: ExhibitionCreate
) -> Exhibition:
    await create_or_exist_tags(session, exhibition_in.tags)
    exhibition = Exhibition(**exhibition_in.model_dump())
    session.add(exhibition)
    await session.commit()
    await session.refresh(exhibition)
    return exhibition


async def _add_exhibition_participants(
    session: AsyncSession, participant_names: list[str], exhibition_id: UUID
) -> list[dict]:
    participants = await create_exhibition_participants(
        session=session,
        exhibition_participant_names=participant_names,
        exhibition_id=exhibition_id
    )
    return [p.model_dump() for p in participants]


async def _add_exhibition_tags(
    session: AsyncSession, tags: list[str], exhibition_id: UUID
) -> list[dict]:
    tags = await create_or_exist_exhibition_tags(
        session=session,
        tags=tags,
        exhibition_id=exhibition_id
    )
    return [t.model_dump() for t in tags]



async def update_exhibition(
    session: AsyncSession,
    exhibition_id: UUID,
    exhibition_in: ExhibitionUpdate
) -> ExhibitionPublic:
    exhibition = await session.get(Exhibition, exhibition_id)
    if not exhibition:
        raise ValueError(f"Exhibition {exhibition_id} not found")

    base_data = exhibition_in.model_dump(exclude={"participants", "tags"}, exclude_unset=True)
    exhibition.sqlmodel_update(base_data)

    participants = await update_exhibition_participants(session, exhibition_in.participants, exhibition_id)

    if exhibition_in.tags is not None:
        await delete_exhibition_tags(session, exhibition_in.tags, exhibition_id)
        tags = await create_or_exist_exhibition_tags(
            session=session,
            tags=exhibition_in.tags,
            exhibition_id=exhibition_id
        )

    session.add(exhibition)
    await session.commit()
    await session.refresh(exhibition)

    return ExhibitionPublic(
        **exhibition.model_dump(),
        participants=participants,
        tags=tags,
    )


async def delete_exhibition(
    session: AsyncSession,
    exhibition: Exhibition
) -> Exhibition:
    await session.delete(exhibition)
    await session.commit()
    return exhibition


async def get_exhibitions(
    session: AsyncSession,
    skip: int = 0,
    limit: int = settings.DEFAULT_QUERY_LIMIT,
) -> ExhibitionsPublic:
    statement = select(Exhibition).offset(skip).limit(limit)
    exhibitions = (await session.execute(statement)).scalars().all()
    count = (await session.execute(
        select(func.count(Exhibition.id))
    )).scalar_one()
    return ExhibitionsPublic(data=exhibitions, count=count)