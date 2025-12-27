import uuid

from backend.app.crud import admin_action as admin_action_crud
from backend.app.db.models.admin_action import AdminAction, AdminActionCreate
from sqlalchemy.ext.asyncio import AsyncSession


async def create_admin_action(
    session: AsyncSession,
    target_id: uuid.UUID,
    author_id: uuid.UUID,
    comment: str | None,
) -> AdminAction:
    admin_action = AdminActionCreate(
        target_org_id=target_id,
        author_id=author_id,
        comment=comment,
    )
    db_admin_action = await admin_action_crud.create_admin_action(
        session=session,
        admin_action_in=admin_action,
    )
    return db_admin_action
