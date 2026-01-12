from backend.app.db.models.admin_action import AdminAction
from sqlalchemy.ext.asyncio import AsyncSession


async def create_admin_action(
    session: AsyncSession,
    admin_action_in: AdminAction,
) -> AdminAction:
    admin_action = AdminAction(
        **admin_action_in.model_dump(),
    )
    session.add(admin_action)
    await session.commit()
    await session.refresh(admin_action)
    return admin_action
