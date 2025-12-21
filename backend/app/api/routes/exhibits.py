from typing import Any

from backend.app.api.dependencies.common import SessionDep
from backend.app.api.dependencies.exhibits import ExhibitOr404
from backend.app.api.dependencies.pagination import PaginationDep
from backend.app.crud import exhibit as exhibit_crud
from backend.app.db.models.exhibit import (
    ExhibitCreate,
    ExhibitPublic,
    ExhibitsPublic,
    ExhibitUpdate,
)
from backend.app.db.schemas import Message
from fastapi import APIRouter

router = APIRouter()


@router.get(
    "/",
    response_model=ExhibitsPublic,
)
async def read_exhibits(session: SessionDep, pagination: PaginationDep) -> Any:
    """
    Retrieve a list of exhibits with pagination.
    """
    exhibits = await exhibit_crud.get_exhibits(
        session=session,
        skip=pagination.skip,
        limit=pagination.limit,
    )
    return exhibits


@router.get("/{exhibit_id}", response_model=ExhibitPublic)
async def read_exhibit_by_id(
    exhibit: ExhibitOr404,
) -> Any:
    """
    Retrieve an exhibit by its ID.
    """
    return exhibit


@router.post(
    "/",
    response_model=ExhibitPublic,
)
async def create_exhibit(session: SessionDep, exhibit_in: ExhibitCreate) -> Any:
    """
    Create a new exhibit.
    """
    exhibit = await exhibit_crud.create_exhibit(session=session, exhibit_in=exhibit_in)
    return exhibit


@router.put(
    "/{exhibit_id}",
    response_model=ExhibitPublic,
)
async def update_exhibit(
    session: SessionDep,
    exhibit_in: ExhibitUpdate,
    db_exhibit: ExhibitOr404,
) -> Any:
    """
    Update an exhibit's information.
    """
    exhibit = await exhibit_crud.update_exhibit(
        session=session,
        exhibit=db_exhibit,
        exhibit_in=exhibit_in,
    )
    return exhibit


@router.delete(
    "/{exhibit_id}",
    response_model=Message,
)
async def delete_exhibit(
    session: SessionDep,
    exhibit_in: ExhibitOr404,
) -> Any:
    """
    Delete an exhibit by its ID.
    """
    await exhibit_crud.delete_exhibit(session=session, exhibit=exhibit_in)
    return Message(message="Exhibit deleted successfully")
