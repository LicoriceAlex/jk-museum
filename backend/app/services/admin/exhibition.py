import uuid

from backend.app.crud import exhibition as exhibition_crud
from backend.app.crud.admin import exhibition as admin_exhibition_crud
from backend.app.db.models.exhibition import Exhibition, ExhibitionPublic, ExhibitionStatusEnum
from backend.app.db.models.user import User
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
) -> ExhibitionPublic:
    updated_exhibition = await admin_exhibition_crud.update_exhibition_status(
        session=session,
        exhibition_id=exhibition.id,
        user_id=user.id,
        new_status=new_status,
    )
    return ExhibitionPublic.model_validate(updated_exhibition)
