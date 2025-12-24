from typing import Annotated
from uuid import UUID

from fastapi import Depends, Query
from pydantic import BaseModel, Field


class FilterParams(BaseModel):
    """Параметры фильтрации выставок."""

    organization_id: UUID | None = Field(
        default=None,
        description="Filter exhibitions by organization ID.",
        example="123e4567-e89b-12d3-a456-426614174000",
    )
    tag_names: list[str] | None = Field(
        default=None,
        description="Filter exhibitions by tags.",
        example=["art", "science"],
    )
    tag_ids: list[UUID] | None = Field(
        default=None,
        description="Filter exhibitions by tag IDs.",
        example=["123e4567-e89b-12d3-a456-426614174000"],
    )
    q: str | None = Field(
        default=None,
        description="Search exhibitions by title or description.",
        example="art exhibition",
    )


class SortParams(BaseModel):
    """Параметры сортировки выставок."""

    sortBy: str | None = Field(
        default=None,
        description="Sort the exhibitions by a specific field.",
        example="created_at",
        pattern="^(created_at|likes_count|rating|title)$",
    )
    sortOrder: str | None = Field(
        default=None,
        description="Sort the exhibitions in ascending or descending order.",
        example="asc",
        pattern="^(asc|desc)$",
    )


# Явное указание Query для зависимостей
def filter_query_params(
    organization_id: Annotated[UUID | None, Query()] = None,
    tag_names: Annotated[list[str] | None, Query()] = None,
    tag_ids: Annotated[list[UUID] | None, Query()] = None,
    q: Annotated[str | None, Query()] = None,
) -> FilterParams:
    return FilterParams(organization_id=organization_id, tag_names=tag_names, tag_ids=tag_ids, q=q)


def sort_query_params(
    sortBy: Annotated[
        str | None,
        Query(regex="^(created_at|likes_count|rating|title)$"),
    ] = "created_at",
    sortOrder: Annotated[str | None, Query(regex="^(asc|desc)$")] = "asc",
) -> SortParams:
    return SortParams(sortBy=sortBy, sortOrder=sortOrder)


FilterDep = Annotated[FilterParams, Depends(filter_query_params)]
SortDep = Annotated[SortParams, Depends(sort_query_params)]
