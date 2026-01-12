import uuid

from backend.app.crud import organization_moderation_comment as organization_moderation_comment_crud
from backend.app.db.models.organization_moderation_comment import (
    OrganizationModerationComment,
    OrganizationModerationCommentCreate,
)
from sqlalchemy.ext.asyncio import AsyncSession


async def create_organization_moderation_comment(
    session: AsyncSession,
    target_id: uuid.UUID,
    author_id: uuid.UUID,
    comment: str | None,
) -> OrganizationModerationComment:
    organization_moderation_comment = OrganizationModerationCommentCreate(
        entity_id=target_id,
        author_id=author_id,
        text=comment,
    )
    db_organization_moderation_comment = (
        await organization_moderation_comment_crud.create_organization_moderation_comment(
            session=session,
            organization_moderation_comment_in=organization_moderation_comment,
        )
    )
    return db_organization_moderation_comment
