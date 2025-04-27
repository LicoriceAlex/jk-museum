from typing import Annotated
import uuid

from fastapi import Depends, HTTPException
from backend.app.api.dependencies.common import SessionDep
from backend.app.db.models.exhibit import Exhibit
from backend.app.crud import exhibit as exhibit_crud


async def get_exhibit_or_404(
    session: SessionDep,
    organization_id: uuid.UUID
) -> Exhibit:
    exhibit = await exhibit_crud.get_exhibit(
        session=session,
        id=organization_id
    )
    if not exhibit:
        raise HTTPException(
            status_code=404,
            detail="Exhibit not found"
        )
    return exhibit


ExhibitOr404 = Annotated[Exhibit, Depends(get_exhibit_or_404)]
