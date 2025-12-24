from typing import Annotated
from uuid import UUID

from backend.app.api.dependencies.common import SessionDep
from backend.app.crud import exhibition as exhibition_crud
from backend.app.db.models.exhibition import Exhibition
from fastapi import Depends, HTTPException


async def get_exhibition_or_404(session: SessionDep, exhibition_id: UUID) -> Exhibition:
    exhibition = await exhibition_crud.get_exhibition(session=session, id=exhibition_id)
    if not exhibition:
        raise HTTPException(status_code=404, detail="Exhibition not found")
    return exhibition


ExhibitionOr404 = Annotated[Exhibition, Depends(get_exhibition_or_404)]
