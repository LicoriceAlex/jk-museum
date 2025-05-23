import uuid
from typing import Any
from fastapi import APIRouter, Depends, HTTPException, Query

from backend.app.api.dependencies.common import SessionDep
from backend.app.api.dependencies.exhibition import ExhibitionOr404
from backend.app.api.dependencies.exhibits import ExhibitOr404
from backend.app.api.dependencies.users import get_current_admin_or_moderator
from backend.app.core.config import settings
from backend.app.crud import exhibition as exhibition_crud
from backend.app.crud import exhibition_exhibit as exhibition_exhibit_crud
from backend.app.db.models.exhibition import (
    Exhibition, ExhibitionCreate, ExhibitionPublic, ExhibitionsPublic, ExhibitionUpdate
)
from backend.app.db.models.exhibition_exhibit import ExhibitionExhibitCreate
from backend.app.db.schemas import Message
from fastapi import Body, status
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

router = APIRouter()


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
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Exhibit not found")
    
    exhibition = await exhibition_crud.get_exhibition(session=session, id=exhibition_id)
    if not exhibition:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Exhibition not found")

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
    await exhibition_crud.delete_exhibition(
        session=session,
        exhibition=exhibition
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
