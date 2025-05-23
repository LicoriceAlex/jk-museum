from fastapi import APIRouter, Depends, HTTPException, status, Path
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional
from uuid import UUID

from backend.app.api.dependencies.common import SessionDep
from backend.app.api.dependencies.exhibition.exhibition import ExhibitionOr404
from backend.app.db.models.exhibition_block import ExhibitionBlockCreate, ExhibitionBlockUpdate
from backend.app.db.models.exhibition_block_item import ExhibitionBlockItemCreate
from backend.app.crud import exhibition_block as exhibition_block_crud

router = APIRouter()

class ExhibitionBlockCreateRequest(ExhibitionBlockCreate):
    items: Optional[List[ExhibitionBlockItemCreate]] = None


@router.post(
    "/",
    status_code=status.HTTP_201_CREATED
)
async def add_exhibition_block(
    block_in: ExhibitionBlockCreateRequest,
    exhibition_id: UUID,
    session: SessionDep
):
    try:
        block = await exhibition_block_crud.create_exhibition_block(session=session, block_in=block_in, items=block_in.items)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    return block


@router.delete(
    "/{block_id}",
    status_code=status.HTTP_204_NO_CONTENT
)
async def delete_exhibition_block(
    exhibition: ExhibitionOr404,
    block_id: UUID,
    session: SessionDep
):
    try:
        await exhibition_block_crud.delete_exhibition_block(session=session, block_id=block_id)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    
    
@router.put(
    "/{block_id}"
)
async def update_exhibition_block(
    exhibition: ExhibitionOr404,
    block_id: UUID,
    block_in: ExhibitionBlockUpdate,
    session: SessionDep
):
    try:
        block = await exhibition_block_crud.update_exhibition_block(
            session=session,
            block_in=block_in,
            block_id=block_id,
        )
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    return block
