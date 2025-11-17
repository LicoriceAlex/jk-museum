from typing import Optional
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from backend.app.core.config import settings
from backend.app.db.models import (
    Tag,
    TagCreate
)
from backend.app.utils.logger import log_method_call


@log_method_call
async def get_tag(
    session: AsyncSession,
    **filters
) -> Optional[Tag]:
    statement = select(Tag).filter_by(**filters)
    result = await session.execute(statement)
    tag = result.scalar_one_or_none()
    return tag


@log_method_call
async def create_or_exist_tags(
    session: AsyncSession,
    tags: list[str]
) -> list[Tag]:
    tag_list = []
    for tag_name in tags:
        tag_name = tag_name.lower()
        tag = await get_tag(session=session, name=tag_name)
        if not tag:
            tag = await create_tag(session=session, tag_in=TagCreate(name=tag_name))
        tag_list.append(tag)
    return tag_list


@log_method_call
async def create_tag(
    session: AsyncSession,
    tag_in: TagCreate
) -> Tag:
    tag = Tag(**tag_in.model_dump())
    session.add(tag)
    await session.commit()
    await session.refresh(tag)
    return tag
