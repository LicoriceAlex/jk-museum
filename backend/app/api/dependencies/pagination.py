from typing import Annotated

from backend.app.core.config import settings
from fastapi import Depends
from pydantic import BaseModel, Field


class PaginationParams(BaseModel):
    """Параметры пагинации."""

    skip: int = Field(default=0, ge=0, description="Number of records to skip")
    limit: int = Field(
        default=settings.DEFAULT_QUERY_LIMIT,
        ge=1,
        le=100,
        description="Maximum number of records to return",
    )


PaginationDep = Annotated[PaginationParams, Depends(PaginationParams)]
