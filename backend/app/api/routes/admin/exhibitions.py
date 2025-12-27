import uuid

from backend.app.api.dependencies.common import SessionDep
from backend.app.api.dependencies.exhibition.filters import FilterDep, SortDep
from backend.app.api.dependencies.pagination import PaginationDep
from backend.app.api.dependencies.users import CurrentAdmin, get_current_admin
from backend.app.api.routes.exhibitions import ExhibitionOr404
from backend.app.crud import exhibition as exhibition_crud
from backend.app.db.models.exhibition import ExhibitionPublic, ExhibitionStatusEnum, ExhibitionsPublic
from backend.app.services.admin import exhibition as admin_exhibition_service
from fastapi import APIRouter, Depends

router = APIRouter()


@router.get("/", response_model=ExhibitionsPublic, dependencies=[Depends(get_current_admin)])
async def read_exhibitions(
    session: SessionDep,
    pagination: PaginationDep,
    filters: FilterDep,
    sort: SortDep,
    current_user: CurrentAdmin,
) -> ExhibitionsPublic:
    exhibitions = await exhibition_crud.get_exhibitions(
        session=session,
        skip=pagination.skip,
        limit=pagination.limit,
        filters=filters,
        sort=sort,
        current_user_id=current_user.id if current_user else None,
    )
    return exhibitions


@router.get(
    "/{exhibition_id}",
    response_model=ExhibitionPublic,
    dependencies=[Depends(get_current_admin)],
)
async def read_exhibition_by_id(
    exhibition_id: uuid.UUID,
    session: SessionDep,
    current_user: CurrentAdmin,
) -> ExhibitionPublic:
    return await admin_exhibition_service.read_exhibition(session, exhibition_id, current_user.id)


@router.get('/{exhibition_id}/approve', response_model=ExhibitionPublic, dependencies=[Depends(get_current_admin)])
async def approve_exhibition(
    exhibition: ExhibitionOr404,
    session: SessionDep,
    current_user: CurrentAdmin,
) -> ExhibitionPublic:
    return await admin_exhibition_service.update_exhibition_status(
        session=session,
        exhibition=exhibition,
        user=current_user,
        new_status=ExhibitionStatusEnum.approved,
    )
