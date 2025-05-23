from typing import Optional
from uuid import UUID
from sqlalchemy import delete, func, select
from sqlalchemy.ext.asyncio import AsyncSession

from backend.app.core.config import settings
from backend.app.crud.tag import create_tag, get_tag
from backend.app.db.models.exhibition_tag import (
    ExhibitionTag, ExhibitionTagCreate
)
from backend.app.db.models.tag import Tag, TagCreate, TagPublic


async def get_exhibition_tag(
    session: AsyncSession,
    **filters
) -> Optional[ExhibitionTag]:
    statement = select(ExhibitionTag).filter_by(**filters)
    result = await session.execute(statement)
    exhibition_tag = result.scalar_one_or_none()
    return exhibition_tag


async def get_exhibition_tags(
    session: AsyncSession,
    exhibition_id: UUID
) -> Optional[list[Tag]]:
    statement = select(ExhibitionTag).filter_by(exhibition_id=exhibition_id)
    result = await session.execute(statement)
    exhibition_tags = result.scalars().all()
    tags = []
    for exhibition_tag in exhibition_tags:
        tag = await session.execute(
            select(Tag).filter_by(id=exhibition_tag.tag_id)
        )
        tag = tag.scalar_one_or_none()
        if tag is not None:
            tags.append(tag)
    return tags


async def create_exhibition_tag(
    session: AsyncSession,
    exhibition_tag_in: ExhibitionTagCreate
) -> ExhibitionTag:
    exhibition_tag = ExhibitionTag(**exhibition_tag_in.model_dump())
    session.add(exhibition_tag)
    await session.commit()
    await session.refresh(exhibition_tag)
    return exhibition_tag


async def create_or_exist_exhibition_tags(
    session: AsyncSession,
    tags: list[str],
    exhibition_id: UUID
) -> list[TagPublic]:
    tag_list = []
    for tag_name in tags:
        tag_name = tag_name.lower()
        tag = await get_tag(session=session, name=tag_name)
        if tag is None:
            tag = await create_tag(session=session, tag_in=TagCreate(name=tag_name))
        tag_list.append(TagPublic.model_validate(tag))
        await create_exhibition_tag(
            session=session,
            exhibition_tag_in=ExhibitionTagCreate(
                tag_id=tag.id,
                exhibition_id=exhibition_id,
            )
        )
    return tag_list


async def delete_exhibition_tags(
    session: AsyncSession,
    tags_in: Optional[list[str]],
    exhibition_id: UUID
) -> Optional[list[Tag]]:
    if tags_in is None:
        return None
    await session.execute(delete(ExhibitionTag).where(ExhibitionTag.exhibition_id == exhibition_id))
    await session.commit()
