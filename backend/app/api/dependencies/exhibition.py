from typing import Annotated
import uuid

from fastapi import Depends, HTTPException
from backend.app.api.dependencies.common import SessionDep
from backend.app.db.models.exhibition import Exhibition
from backend.app.crud import exhibition as exhibition_crud


async def get_exhibition_or_404(
    session: SessionDep,
    exhibition_id: uuid.UUID
) -> Exhibition:
    exhibition = await exhibition_crud.get_exhibition(
        session=session,
        id=exhibition_id
    )
    if not exhibition:
        raise HTTPException(
            status_code=404,
            detail="Exhibition not found"
        )
    return exhibition


ExhibitionOr404 = Annotated[Exhibition, Depends(get_exhibition_or_404)]
