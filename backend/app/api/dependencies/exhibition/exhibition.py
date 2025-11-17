from typing import Annotated, List, Optional
from uuid import UUID

from fastapi import Depends, HTTPException
from pydantic import BaseModel, Field
from backend.app.api.dependencies.common import SessionDep
from backend.app.db.models import Exhibition
from backend.app.crud import exhibition as exhibition_crud


async def get_exhibition_or_404(
    session: SessionDep,
    exhibition_id: UUID
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


