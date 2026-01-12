import uuid

from backend.app.crud import admin_action as admin_action_crud
from backend.app.crud import exhibition as exhibition_crud
from backend.app.crud import exhibition_moderation_comment as exhibition_moderation_comment_crud
from backend.app.crud.admin import exhibition as admin_exhibition_crud
from backend.app.db.models.admin_action import ActionTypeEnum, AdminActionCreate
from backend.app.db.models.exhibition import Exhibition, ExhibitionPublic, ExhibitionStatusEnum
from backend.app.db.models.user import User
from backend.app.utils.exhibitions import exhibition_statuses_map
from fastapi import HTTPException
from sqlalchemy.ext.asyncio import AsyncSession


async def read_exhibition(
    session: AsyncSession,
    exhibition_id: uuid.UUID,
    current_user_id: uuid.UUID,
) -> ExhibitionPublic:
    if (
        exhibition := await exhibition_crud.get_exhibition(session=session, id=exhibition_id)
    ) is None:
        raise HTTPException(status_code=404, detail="Exhibition not found")
    exhibition.is_liked_by_current_user = (
        await exhibition_crud.get_user_exhibition_likes(
            session,
            exhibition_id,
            current_user_id,
        )
    ) is not None or exhibition.is_liked_by_current_user

    return ExhibitionPublic(
        **exhibition.model_dump(),
    )


async def update_exhibition_status(
    session: AsyncSession,
    exhibition: Exhibition,
    user: User,
    new_status: ExhibitionStatusEnum,
    comment: str | None,
) -> ExhibitionPublic:
    if new_status not in exhibition_statuses_map.get(exhibition.status, []):
        raise HTTPException(
            status_code=400,
            detail=f"Невозможен переход из статуса {exhibition.status} в статус {new_status.value}",
        )
    # Явная загрузка user через session.get
    user_db = await session.get(User, user.id)
    user_db_id = user_db.id
    await admin_exhibition_crud.update_exhibition_status(
        session=session,
        exhibition_id=exhibition.id,
        user_id=user_db_id,
        new_status=new_status,
    )
    await exhibition_moderation_comment_crud.create_exhibition_moderation_comment(
        session=session,
        entity_id=exhibition.id,
        author_id=user_db_id,
        text=comment if comment is not None else "",
    )
    await admin_action_crud.create_admin_action(
        session=session,
        admin_action_in=AdminActionCreate(
            action_type=ActionTypeEnum.update_exhibition_status,
            admin_id=user_db_id,
            target_exhibition_id=exhibition.id,
        ),
    )
    exhibition_public = await exhibition_crud.get_exhibition(session=session, id=exhibition.id)
    # После обновления статуса возвращаем сериализованный ExhibitionPublic
    return exhibition_public
