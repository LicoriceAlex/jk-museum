import uuid
from typing import Annotated

from backend.app.api.dependencies.common import SessionDep
from backend.app.crud import exhibit as exhibit_crud
from backend.app.db.models.exhibit import Exhibit
from fastapi import Depends, HTTPException


async def get_exhibit_or_404(session: SessionDep, exhibit_id: uuid.UUID) -> Exhibit:
    exhibit = await exhibit_crud.get_exhibit(session=session, id=exhibit_id)
    if not exhibit:
        raise HTTPException(status_code=404, detail="Exhibit not found")
    return exhibit


ExhibitOr404 = Annotated[Exhibit, Depends(get_exhibit_or_404)]
