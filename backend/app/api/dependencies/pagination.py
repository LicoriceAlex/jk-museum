from typing import Annotated
from pydantic import BaseModel, Field
from fastapi import Depends, Query
from backend.app.core.config import settings

class PaginationParams(BaseModel):
    """Параметры пагинации."""
    skip: int = Field(
        default=0,
        ge=0,
        description="Number of records to skip"
    )
    limit: int = Field(
        default=settings.DEFAULT_QUERY_LIMIT,
        ge=1,
        le=100,
        description="Maximum number of records to return"
    )

async def get_pagination_params(
    skip: int = Query(0, ge=0, description="Number of records to skip"),
    limit: int = Query(
        default=settings.DEFAULT_QUERY_LIMIT,
        ge=1,
        le=100,
        description="Maximum number of records to return"
    )
) -> PaginationParams:
    """Зависимость для получения параметров пагинации."""
    return PaginationParams(skip=skip, limit=limit)

PaginationDep = Annotated[PaginationParams, Depends(get_pagination_params)]