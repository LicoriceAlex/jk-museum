import uuid

from backend.app.db.models.exhibition_moderation_comment import ExhibitionModerationComment
from backend.app.utils.logger import log_method_call
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession


@log_method_call
async def create_exhibition_moderation_comment(
    session: AsyncSession,
    entity_id: uuid.UUID,
    author_id: uuid.UUID,
    text: str,
) -> ExhibitionModerationComment:
    comment = ExhibitionModerationComment(
        entity_id=entity_id,
        author_id=author_id,
        text=text,
    )
    session.add(comment)
    await session.commit()
    await session.refresh(comment)
    return comment


@log_method_call
async def get_comments_by_entity_id(
    session: AsyncSession,
    entity_id: uuid.UUID,
) -> list[ExhibitionModerationComment]:
    result = await session.execute(
        select(
            ExhibitionModerationComment,
        ).where(
            ExhibitionModerationComment.entity_id == entity_id,
        ),
    )
    comments = result.scalars().all()
    return comments
