import uuid
from collections.abc import Sequence
from uuid import UUID

from backend.app.api.dependencies.exhibition.filters import FilterParams, SortParams
from backend.app.core.config import settings
from backend.app.crud import organization as organization_crud
from backend.app.crud.exhibition_participant import (
    create_exhibition_participants,
    update_exhibition_participants,
)
from backend.app.crud.exhibition_tag import create_or_exist_exhibition_tags, delete_exhibition_tags
from backend.app.crud.tag import create_or_exist_tags
from backend.app.db.models.exhibition import (
    Exhibition,
    ExhibitionCreate,
    ExhibitionPublic,
    ExhibitionsPublic,
    ExhibitionUpdate,
)
from backend.app.db.models.exhibition_block import ExhibitionBlock, ExhibitionBlockPublic
from backend.app.db.models.exhibition_block_item import ExhibitionBlockItem
from backend.app.db.models.exhibition_participant import ExhibitionParticipant
from backend.app.db.models.exhibition_tag import ExhibitionTag
from backend.app.db.models.tag import Tag, TagPublic
from backend.app.db.models.user_exhibition_like import UserExhibitionLike
from backend.app.utils.logger import log_method_call
from fastapi import HTTPException
from sqlalchemy import JSON, Integer, Select, func, literal_column, select, text
from sqlalchemy.ext.asyncio import AsyncSession


@log_method_call
async def get_exhibition(session: AsyncSession, **filters) -> ExhibitionPublic | None:
    statement = select(Exhibition).filter_by(**filters)
    result = await session.execute(statement)
    exhibition = result.scalar_one_or_none()
    if not exhibition:
        return None

    likes_stmt = select(func.count(UserExhibitionLike.user_id)).where(
        UserExhibitionLike.exhibition_id == exhibition.id,
    )
    likes_result = await session.execute(likes_stmt)
    likes_count = likes_result.scalar_one() or 0

    participants_stmt = select(ExhibitionParticipant).where(
        ExhibitionParticipant.exhibition_id == exhibition.id,
    )
    participants_result = await session.execute(participants_stmt)
    participants = [p.model_dump() for p in participants_result.scalars().all()]

    tags_stmt = (
        select(Tag)
        .join(ExhibitionTag, Tag.id == ExhibitionTag.tag_id)
        .where(ExhibitionTag.exhibition_id == exhibition.id)
    )
    tags_result = await session.execute(tags_stmt)
    tags = [t.model_dump() for t in tags_result.scalars().all()]

    blocks_stmt = select(ExhibitionBlock).where(ExhibitionBlock.exhibition_id == exhibition.id)
    blocks_result = await session.execute(blocks_stmt)
    blocks = []
    for block in blocks_result.scalars().all():
        items_stmt = select(ExhibitionBlockItem).where(ExhibitionBlockItem.block_id == block.id)
        items_result = await session.execute(items_stmt)
        items = [item.model_dump() for item in items_result.scalars().all()]
        blocks.append({**block.model_dump(), "items": items})

    return ExhibitionPublic(
        **exhibition.model_dump(),
        participants=participants,
        tags=tags,
        likes_count=likes_count,
        blocks=blocks,
    )


async def _validate_organization(session: AsyncSession, organization_id: UUID) -> None:
    organization = await organization_crud.get_organization(session, id=organization_id)
    if not organization:
        raise HTTPException(status_code=404, detail=f"Organization {organization_id} not found")


async def _validate_exhibition_data(session: AsyncSession, exhibition_in: ExhibitionCreate) -> None:
    await _validate_organization(session, exhibition_in.organization_id)


@log_method_call
async def create_exhibition(
    session: AsyncSession,
    exhibition_in: ExhibitionCreate,
) -> ExhibitionPublic:
    await _validate_exhibition_data(session, exhibition_in)
    exhibition = await _create_base_exhibition(session, exhibition_in)
    exhibition_id = exhibition.id
    exhibition = exhibition.model_dump()
    participants = await _add_exhibition_participants(
        session,
        exhibition_in.participants,
        exhibition_id,
    )
    tags = await _add_exhibition_tags(session, exhibition_in.tags, exhibition_id)
    return ExhibitionPublic(
        **exhibition,
        participants=participants,
        tags=tags,
    )


@log_method_call
async def _create_base_exhibition(
    session: AsyncSession,
    exhibition_in: ExhibitionCreate,
) -> Exhibition:
    await create_or_exist_tags(session, exhibition_in.tags)
    exhibition = Exhibition(**exhibition_in.model_dump(exclude={"participants", "tags"}))
    session.add(exhibition)
    await session.commit()
    await session.refresh(exhibition)
    return exhibition


@log_method_call
async def _add_exhibition_participants(
    session: AsyncSession,
    participant_names: list[str],
    exhibition_id: UUID,
) -> list[dict]:
    participants = await create_exhibition_participants(
        session=session,
        exhibition_participant_names=participant_names,
        exhibition_id=exhibition_id,
    )
    return [p.model_dump() for p in participants]


@log_method_call
async def _add_exhibition_tags(
    session: AsyncSession,
    tags: list[str],
    exhibition_id: UUID,
) -> list[dict]:
    tags = await create_or_exist_exhibition_tags(
        session=session,
        tags=tags,
        exhibition_id=exhibition_id,
    )
    return [t.model_dump() for t in tags]


@log_method_call
async def update_exhibition(
    session: AsyncSession,
    exhibition_id: UUID,
    exhibition_in: ExhibitionUpdate,
) -> ExhibitionPublic:
    exhibition = await session.get(Exhibition, exhibition_id)
    if not exhibition:
        raise ValueError(f"Exhibition {exhibition_id} not found")

    base_data = exhibition_in.model_dump(exclude={"participants", "tags"}, exclude_unset=True)
    exhibition.sqlmodel_update(base_data)

    participants = await update_exhibition_participants(
        session,
        exhibition_in.participants,
        exhibition_id,
    )

    if exhibition_in.tags is not None:
        await delete_exhibition_tags(session, exhibition_in.tags, exhibition_id)
        tags = await create_or_exist_exhibition_tags(
            session=session,
            tags=exhibition_in.tags,
            exhibition_id=exhibition_id,
        )

    session.add(exhibition)
    await session.commit()
    await session.refresh(exhibition)

    return ExhibitionPublic(
        **exhibition.model_dump(),
        participants=participants,
        tags=tags,
    )


@log_method_call
async def delete_exhibition(session: AsyncSession, exhibition: Exhibition) -> Exhibition:
    await session.delete(exhibition)
    await session.commit()
    return exhibition


@log_method_call
async def get_exhibitions(
    session: AsyncSession,
    sort: SortParams = SortParams(),  # noqa: B008
    filters: FilterParams = FilterParams(),  # noqa: B008
    skip: int = 0,
    limit: int = settings.DEFAULT_QUERY_LIMIT,
    current_user_id: UUID | None = None,
    search: str | None = None,
) -> ExhibitionsPublic:
    """
    Retrieve a paginated list of exhibitions with filtering, sorting, and related data.
    """
    query_builder = ExhibitionQueryBuilder(session, filters, sort, skip, limit, current_user_id, search)
    return await query_builder.execute()


@log_method_call
async def get_user_exhibition_likes(
    session: AsyncSession,
    exhibition_id: uuid.UUID,
    current_user_id: uuid.UUID,
) -> Sequence[UserExhibitionLike]:
    return (
        (
            await session.execute(
                select(UserExhibitionLike).where(
                    UserExhibitionLike.exhibition_id == exhibition_id,
                    UserExhibitionLike.user_id == current_user_id,
                ),
            )
        )
        .scalars()
        .all()
    )


class ExhibitionQueryBuilder:
    """Handles query construction and execution for exhibitions with filtering, sorting, and pagination."""

    def __init__(
        self,
        session: AsyncSession,
        filters: FilterParams,
        sort: SortParams,
        skip: int,
        limit: int,
        current_user_id=None,
        search: str | None = None,
    ):
        self.session = session
        self.filters = filters
        self.sort = sort
        self.skip = skip
        self.limit = limit
        self.statement = None
        self.count_statement = select(func.count(Exhibition.id))
        self._needs_likes = True
        self.current_user_id = current_user_id
        self.search = search

    async def execute(self) -> ExhibitionsPublic:
        """Builds and executes the query, returning paginated results."""
        self._build_query()
        result = await self._fetch_results()
        count = await self._fetch_count()
        return ExhibitionsPublic(data=result, count=count)

    def _build_query(self) -> None:
        """Constructs the main query with subqueries, filters, and sorting."""
        tags_subquery = self._build_tags_subquery()
        participants_subquery = self._build_participants_subquery()
        blocks_subquery = self._build_blocks_subquery()

        likes_subquery = self._build_likes_subquery()

        select_columns = [
            Exhibition,
            tags_subquery.c.tags,
            participants_subquery.c.participants,
            blocks_subquery.c.blocks,
        ]

        if likes_subquery is not None:
            select_columns.append(
                func.coalesce(likes_subquery.c.likes_count, 0).label("likes_count"),
            )

        self.statement = select(*select_columns)

        self.statement = self.statement.outerjoin(
            tags_subquery,
            Exhibition.id == tags_subquery.c.exhibition_id,
        ).outerjoin(participants_subquery, Exhibition.id == participants_subquery.c.exhibition_id)

        self.statement = self.statement.outerjoin(
            blocks_subquery,
            Exhibition.id == blocks_subquery.c.exhibition_id,
        )

        if likes_subquery is not None:
            self.statement = self.statement.outerjoin(
                likes_subquery,
                Exhibition.id == likes_subquery.c.exhibition_id,
            )

        self._apply_filters()
        self._apply_search()
        self._apply_sorting()
        self._apply_pagination()
        if (
            self.sort.sortBy == "likes_count"
            or hasattr(self.filters, "likes_min")
            or hasattr(self.filters, "likes_max")
        ):
            return (
                select(
                    UserExhibitionLike.exhibition_id,
                    func.count(UserExhibitionLike.user_id).label("likes_count"),
                )
                .group_by(UserExhibitionLike.exhibition_id)
                .subquery()
            )
        return None

    def _build_tags_subquery(self) -> Select:
        """Builds a subquery to fetch tags for each exhibition as a JSON array."""
        return (
            select(
                ExhibitionTag.exhibition_id,
                func.coalesce(
                    func.array_agg(
                        func.json_build_object(
                            "id",
                            Tag.id,
                            "name",
                            Tag.name,
                            "created_at",
                            Tag.created_at,
                        ),
                    ),
                    list([]),
                ).label("tags"),
            )
            .join(Tag, ExhibitionTag.tag_id == Tag.id)
            .group_by(ExhibitionTag.exhibition_id)
            .subquery()
        )

    def _build_blocks_subquery(self):
        """Builds subquery for exhibition blocks and their items using raw SQL."""
        raw_sql = """
            SELECT
                exhibition_blocks.exhibition_id,
                ARRAY_AGG(
                    JSON_BUILD_OBJECT(
                        'id', exhibition_blocks.id,
                        'type', exhibition_blocks.type,
                        'content', exhibition_blocks.content,
                        'settings', exhibition_blocks.settings,
                        'position', exhibition_blocks.position,
                        'created_at', exhibition_blocks.created_at,
                        'updated_at', exhibition_blocks.updated_at,
                        'items', COALESCE(items_subquery.items, ARRAY[]::json[])
                    )
                ) AS blocks
            FROM exhibition_blocks
            LEFT OUTER JOIN (
                SELECT
                    exhibition_block_items.block_id,
                    ARRAY_AGG(
                        JSON_BUILD_OBJECT(
                            'id', exhibition_block_items.id,
                            'text', exhibition_block_items.text,
                            'image_key', exhibition_block_items.image_key,
                            'position', exhibition_block_items.position,
                            'created_at', exhibition_block_items.created_at,
                            'updated_at', exhibition_block_items.updated_at
                        ) ORDER BY exhibition_block_items.position
                    ) AS items
                FROM exhibition_block_items
                GROUP BY exhibition_block_items.block_id
            ) AS items_subquery
            ON exhibition_blocks.id = items_subquery.block_id
            GROUP BY exhibition_blocks.exhibition_id
        """
        # Явно указываем столбцы подзапроса
        return text(raw_sql).columns(exhibition_id=Integer, blocks=JSON).subquery()

    def _build_participants_subquery(self) -> Select:
        """Builds subquery for exhibition participants."""
        return (
            select(
                ExhibitionParticipant.exhibition_id,
                func.array_agg(
                    func.json_build_object(
                        "id",
                        ExhibitionParticipant.id,
                        "name",
                        ExhibitionParticipant.name,
                        "created_at",
                        ExhibitionParticipant.created_at,
                    ),
                ).label("participants"),
            )
            .group_by(ExhibitionParticipant.exhibition_id)
            .subquery()
        )

    def _build_likes_subquery(self):
        """Builds a subquery to count likes for each exhibition."""
        return (
            select(
                UserExhibitionLike.exhibition_id,
                func.count(UserExhibitionLike.user_id).label("likes_count"),
            )
            .group_by(UserExhibitionLike.exhibition_id)
            .subquery()
        )

    def _apply_pagination(self) -> None:
        """Applies pagination to the query."""

        self.statement = self.statement.offset(self.skip).limit(self.limit)

    def _apply_search(self) -> None:
        """Applies search filtering to the query."""
        if self.search:
            self.statement = self.statement.where(
                Exhibition.title.startswith(self.search),
            )

    def _apply_sorting(self) -> None:
        """Applies sorting to the query."""
        if not self.sort.sortBy or not self.sort.sortOrder:
            return

        if self.sort.sortBy == "likes_count":
            if not self._needs_likes:
                raise ValueError("Likes subquery required for sorting by likes_count")

            order_column = literal_column("likes_count")
        else:
            order_column = getattr(Exhibition, self.sort.sortBy, None)
            if not order_column:
                raise HTTPException(
                    status_code=400,
                    detail=f"Invalid sort field: {self.sort.sortBy}",
                )

        self.statement = self.statement.order_by(
            order_column.asc().nullslast()
            if self.sort.sortOrder == "asc"
            else order_column.desc().nullslast(),
        )

    def _apply_filters(self) -> None:
        """Applies filters to both main and count queries."""
        if self.filters.organization_id:
            self.statement = self.statement.where(
                Exhibition.organization_id == self.filters.organization_id,
            )

    async def _fetch_results(self) -> list[ExhibitionPublic]:
        result = await self.session.execute(self.statement)
        rows = list(result.mappings())
        exhibition_ids = [row["Exhibition"].id for row in rows]
        liked_ids = set()

        # Проверяем лайки текущего пользователя, если он авторизован
        if self.current_user_id and exhibition_ids:
            like_rows = await self.session.execute(
                select(UserExhibitionLike.exhibition_id).where(
                    UserExhibitionLike.exhibition_id.in_(exhibition_ids),
                    UserExhibitionLike.user_id == self.current_user_id,
                ),
            )
            liked_ids = set(str(lid) for lid in like_rows.scalars().all())

        exhibitions = []
        for row in rows:
            exhibition_id = str(row["Exhibition"].id)
            blocks_data = row.get("blocks", [])  # Переносим получение blocks_data внутрь цикла
            data = {
                **row["Exhibition"].model_dump(),
                "tags": [TagPublic(**tag) for tag in (row["tags"] or [])],
                "participants": [ExhibitionParticipant(**p) for p in (row["participants"] or [])],
                "likes_count": row.get("likes_count", 0),
                "is_liked_by_current_user": exhibition_id in liked_ids
                if self.current_user_id
                else None,
                "blocks": [ExhibitionBlockPublic(**block) for block in blocks_data]
                if blocks_data
                else [],
            }
            exhibitions.append(ExhibitionPublic(**data))

        return exhibitions

    async def _fetch_count(self) -> int:
        """Fetches the total count of exhibitions with applied filters."""
        count_stmt = self.count_statement
        if self.filters.organization_id:
            count_stmt = count_stmt.where(
                Exhibition.organization_id == self.filters.organization_id,
            )

        result = await self.session.execute(count_stmt)
        return result.scalar_one() if result else 0
