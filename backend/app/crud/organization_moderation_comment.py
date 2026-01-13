from backend.app.db.models.organization_moderation_comment import (
    OrganizationModerationComment,
    OrganizationModerationCommentCreate,
)
from backend.app.utils.logger import log_method_call
from sqlalchemy.ext.asyncio import AsyncSession


@log_method_call
async def create_organization_moderation_comment(
    session: AsyncSession,
    organization_moderation_comment_in: OrganizationModerationCommentCreate,
) -> OrganizationModerationComment:
    comment = OrganizationModerationComment(
        **organization_moderation_comment_in.model_dump(),
    )
    session.add(comment)
    await session.commit()
    await session.refresh(comment)
    return comment
