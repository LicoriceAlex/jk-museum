from uuid import UUID

from backend.app.crud.tag import create_tag, get_tag
from backend.app.db.models.exhibition_tag import (
    ExhibitionTag,
    ExhibitionTagCreate,
)
from backend.app.db.models.tag import (
    Tag,
    TagCreate,
    TagPublic,
)
from backend.app.utils.logger import log_method_call
from sqlalchemy import delete, select
from sqlalchemy.ext.asyncio import AsyncSession


@log_method_call
async def get_exhibition_tag(session: AsyncSession, **filters) -> ExhibitionTag | None:
    statement = select(ExhibitionTag).filter_by(**filters)
    result = await session.execute(statement)
    exhibition_tag = result.scalar_one_or_none()
    return exhibition_tag


@log_method_call
async def get_exhibition_tags(session: AsyncSession, exhibition_id: UUID) -> list[Tag] | None:
    statement = select(ExhibitionTag).filter_by(exhibition_id=exhibition_id)
    result = await session.execute(statement)
    exhibition_tags = result.scalars().all()
    tags = []
    for exhibition_tag in exhibition_tags:
        tag = await session.execute(select(Tag).filter_by(id=exhibition_tag.tag_id))
        tag = tag.scalar_one_or_none()
        if tag is not None:
            tags.append(tag)
    return tags


@log_method_call
async def create_exhibition_tag(
    session: AsyncSession,
    exhibition_tag_in: ExhibitionTagCreate,
) -> ExhibitionTag:
    exhibition_tag = ExhibitionTag(**exhibition_tag_in.model_dump())
    session.add(exhibition_tag)
    await session.commit()
    await session.refresh(exhibition_tag)
    return exhibition_tag


@log_method_call
async def create_or_exist_exhibition_tags(
    session: AsyncSession,
    tags: list[str],
    exhibition_id: UUID,
) -> list[TagPublic]:
    tag_list = []
    for raw_tag_name in tags:
        tag_name = raw_tag_name.lower()
        tag = await get_tag(session=session, name=tag_name)
        if tag is None:
            tag = await create_tag(session=session, tag_in=TagCreate(name=tag_name))
        tag_list.append(TagPublic.model_validate(tag))
        await create_exhibition_tag(
            session=session,
            exhibition_tag_in=ExhibitionTagCreate(
                tag_id=tag.id,
                exhibition_id=exhibition_id,
            ),
        )
    return tag_list


@log_method_call
async def delete_exhibition_tags(
    session: AsyncSession,
    tags_in: list[str] | None,
    exhibition_id: UUID,
) -> list[Tag] | None:
    if tags_in is None:
        return None
    await session.execute(delete(ExhibitionTag).where(ExhibitionTag.exhibition_id == exhibition_id))
    await session.commit()
