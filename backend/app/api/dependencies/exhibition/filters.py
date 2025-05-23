from typing import Annotated, List, Optional
from uuid import UUID
from fastapi import Depends, Query
from pydantic import BaseModel, Field


class FilterParams(BaseModel):
    """Параметры фильтрации выставок."""
    organization_id: Optional[UUID] = Field(
        default=None,
        description="Filter exhibitions by organization ID.",
        example="123e4567-e89b-12d3-a456-426614174000"
    )
    tag_names: Optional[List[str]] = Field(
        default=None,
        description="Filter exhibitions by tags.",
        example=["art", "science"]
    )
    tag_ids: Optional[List[UUID]] = Field(
        default=None,
        description="Filter exhibitions by tag IDs.",
        example=["123e4567-e89b-12d3-a456-426614174000"]
    )
    q: Optional[str] = Field(
        default=None,
        description="Search exhibitions by title or description.",
        example="art exhibition"
    )

class SortParams(BaseModel):
    """Параметры сортировки выставок."""
    sortBy: Optional[str] = Field(
        default=None,
        description="Sort the exhibitions by a specific field.",
        example="created_at",
        pattern="^(created_at|likes_count|rating|title)$"
    )
    sortOrder: Optional[str] = Field(
        default=None,
        description="Sort the exhibitions in ascending or descending order.",
        example="asc",
        pattern="^(asc|desc)$"
    )

# Явное указание Query для зависимостей
def filter_query_params(
    organization_id: Annotated[Optional[UUID], Query()] = None,
    tag_names: Annotated[Optional[List[str]], Query()] = None,
    tag_ids: Annotated[Optional[List[UUID]], Query()] = None,
    q: Annotated[Optional[str], Query()] = None
) -> FilterParams:
    return FilterParams(
        organization_id=organization_id,
        tag_names=tag_names,
        tag_ids=tag_ids,
        q=q
    )

def sort_query_params(
    sortBy: Annotated[Optional[str], Query(regex="^(created_at|likes_count|rating|title)$")] = "created_at",
    sortOrder: Annotated[Optional[str], Query(regex="^(asc|desc)$")] = "asc"
) -> SortParams:
    return SortParams(sortBy=sortBy, sortOrder=sortOrder)

FilterDep = Annotated[FilterParams, Depends(filter_query_params)]
SortDep = Annotated[SortParams, Depends(sort_query_params)]
