import uuid
from typing import Any
from fastapi import APIRouter, Depends, HTTPException, Query

from backend.app.api.dependencies.common import SessionDep
from backend.app.api.dependencies.exhibition.exhibition import ExhibitionOr404
from backend.app.api.dependencies.exhibition.filters import FilterDep, SortDep
from backend.app.api.dependencies.exhibits import ExhibitOr404
from backend.app.api.dependencies.pagination import PaginationDep
from backend.app.api.dependencies.users import CurrentUser, OptionalCurrentUser, get_current_admin_or_moderator
from backend.app.core.config import settings
from backend.app.crud import exhibition as exhibition_crud
from backend.app.crud import exhibition_exhibit as exhibition_exhibit_crud
from backend.app.crud.exhibition_participant import get_exhibition_participants
from backend.app.crud.exhibition_tag import get_exhibition_tags
from backend.app.db.models.exhibition import (
    Exhibition, ExhibitionCreate, ExhibitionPublic, ExhibitionsPublic, ExhibitionUpdate
)
from backend.app.db.models.exhibition_exhibit import ExhibitionExhibitCreate
from backend.app.db.schemas import Message
from fastapi import Body, status
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from sqlalchemy import select, func
from backend.app.db.models.user_exhibition_like import UserExhibitionLike

router = APIRouter()


@router.get(
    "/"
)
async def read_exhibitions(
    session: SessionDep,
    pagination: PaginationDep,
    filters: FilterDep,
    sort: SortDep,
    current_user: OptionalCurrentUser
) -> Any:
    """
    Retrieve a list of exhibitions with pagination.
    """
    exhibitions = await exhibition_crud.get_exhibitions(
        session=session,
        skip=pagination.skip,
        limit=pagination.limit,
        filters=filters,
        sort=sort,
        current_user_id=current_user.id if current_user else None
    )
    return exhibitions


@router.post(
    "/",
    response_model=ExhibitionPublic,
    status_code=status.HTTP_201_CREATED,
    dependencies=[Depends(get_current_admin_or_moderator)],
)
async def create_exhibition(
    exhibition_in: ExhibitionCreate,
    session: SessionDep,
):
    exhibition = await exhibition_crud.create_exhibition(
        session=session,
        exhibition_in=exhibition_in
    )
    return exhibition


@router.post(
    "/{exhibition_id}/exhibits",
)
async def add_exhibit(
    session: SessionDep,
    exhibit: ExhibitOr404,
    exhibition_id: uuid.UUID,
):
    """
    Add an exhibit to an exhibition.
    """
    if not exhibit:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Exhibit not found")

    exhibition = await exhibition_crud.get_exhibition(session=session, id=exhibition_id)
    if not exhibition:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Exhibition not found")

    exhibition_exhibit = await exhibition_exhibit_crud.create_exhibition_exhibit(
        session=session,
        exhibition_exhibit_in=ExhibitionExhibitCreate(
            exhibition_id=exhibition_id,
            exhibit_id=exhibit.id
        )
    )

    return exhibition_exhibit


@router.delete(
    "/{exhibition_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    dependencies=[Depends(get_current_admin_or_moderator)],
)
async def delete_exhibition(
    exhibition: ExhibitionOr404,
    session: SessionDep,
):
    """
    Delete an exhibition.
    """
    exhibition_to_delete = await session.get(Exhibition, exhibition.id)
    await exhibition_crud.delete_exhibition(
        session=session,
        exhibition=exhibition_to_delete
    )
    return Message(message="Exhibition deleted successfully")


@router.put(
    "/{exhibition_id}",
    response_model=ExhibitionPublic,
    status_code=status.HTTP_200_OK,
    dependencies=[Depends(get_current_admin_or_moderator)],
)
async def update_exhibition(
    exhibition: ExhibitionOr404,
    exhibition_in: ExhibitionUpdate,
    session: SessionDep,
):
    """
    Update an exhibition.
    """
    updated_exhibition = await exhibition_crud.update_exhibition(
        session=session,
        exhibition_id=exhibition.id,
        exhibition_in=exhibition_in
    )
    return updated_exhibition


@router.get(
    "/{exhibition_id}",
    response_model=ExhibitionPublic,
)
async def read_exhibition_by_id(
    exhibition_id: uuid.UUID,
    session: SessionDep,
    current_user: CurrentUser
) -> Any:
    """
    Retrieve full details of a specific exhibition, including likes_count and is_liked_by_current_user.
    """
    exhibition = await exhibition_crud.get_exhibition(session=session, id=exhibition_id)
    exhibition = ExhibitionPublic(**exhibition.model_dump())
    if not exhibition:
        raise HTTPException(status_code=404, detail="Exhibition not found")
    
    tags = await get_exhibition_tags(
        session=session,
        exhibition_id=exhibition_id
    )
    
    participants = await get_exhibition_participants(
        session=session,
        exhibition_id=exhibition_id
    )

    # Получаем likes_count
    likes_count = await session.execute(
        select(func.count(UserExhibitionLike.user_id)).where(
            UserExhibitionLike.exhibition_id == exhibition_id)
    )
    likes_count = likes_count.scalar_one()

    # Проверяем лайк текущего пользователя
    is_liked = None
    if current_user:
        like = await session.execute(
            select(UserExhibitionLike).where(
                UserExhibitionLike.exhibition_id == exhibition_id,
                UserExhibitionLike.user_id == current_user.id
            )
        )
        is_liked = like.scalar_one_or_none() is not None

    # Собираем структуру ответа
    data = {
        **exhibition.model_dump(),
        "is_liked_by_current_user": is_liked,
    }
    return ExhibitionPublic(**data)
