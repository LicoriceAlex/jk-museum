# crud/exhibition_block.py

from uuid import UUID

from backend.app.db.models.exhibition import Exhibition, ExhibitionStatusEnum
from backend.app.db.models.exhibition_block import (
    ExhibitionBlock,
    ExhibitionBlockCreate,
    ExhibitionBlockItemCreate,
    ExhibitionBlockUpdate,
    ExhibitionBlockUpdateBase,
)
from backend.app.db.models.exhibition_block_item import ExhibitionBlockItem
from backend.app.utils.logger import log_method_call
from backend.app.utils.sanitizer import sanitize_html
from sqlalchemy import delete, select
from sqlalchemy.ext.asyncio import AsyncSession


@log_method_call
async def validate_exhibition(session: AsyncSession, exhibition_id: UUID) -> None:
    exhibition = await session.get(Exhibition, exhibition_id)
    if not exhibition:
        raise ValueError(f"Exhibition {exhibition_id} not found")
    if exhibition.status not in [ExhibitionStatusEnum.draft, ExhibitionStatusEnum.published]:
        raise ValueError("Exhibition must be in draft or published status")


@log_method_call
async def adjust_block_positions(
    session: AsyncSession,
    exhibition_id: UUID,
    requested_position: int,
) -> int:
    stmt = select(ExhibitionBlock).where(ExhibitionBlock.exhibition_id == exhibition_id)
    result = await session.execute(stmt)
    blocks = result.scalars().all()

    if requested_position < len(blocks):
        for block in blocks:
            if block.position >= requested_position:
                block.position += 1
                session.add(block)
    else:
        requested_position = len(blocks)

    return requested_position


@log_method_call
def sanitize_block_content(content: str | None) -> str | None:
    return sanitize_html(content) if content else None


@log_method_call
def sanitize_block_items(
    items: list[ExhibitionBlockItemCreate] | None,
) -> list[ExhibitionBlockItemCreate] | None:
    if not items:
        return None
    return [
        ExhibitionBlockItemCreate(
            image_key=item.image_key,
            text=sanitize_html(item.text) if item.text else None,
            position=item.position,
        )
        for item in items
    ]


@log_method_call
async def persist_exhibition_block(
    session: AsyncSession,
    block_in: ExhibitionBlockCreate,
    position: int,
) -> ExhibitionBlock:
    block = ExhibitionBlock(
        **block_in.model_dump(exclude={"position", "content"}),
        position=position,
        content=sanitize_block_content(block_in.content),
    )
    session.add(block)
    await session.flush()
    return block


@log_method_call
async def persist_block_items(
    session: AsyncSession,
    block_id: UUID,
    items: list[ExhibitionBlockItemCreate] | None,
) -> None:
    if not items:
        return
    sanitized_items = sanitize_block_items(items)
    for i, item in enumerate(sanitized_items):
        db_item = ExhibitionBlockItem(
            block_id=block_id,
            image_key=item.image_key,
            text=item.text,
            position=i,
        )
        session.add(db_item)


@log_method_call
async def create_exhibition_block(
    session: AsyncSession,
    block_in: ExhibitionBlockCreate,
    items: list[ExhibitionBlockItemCreate] | None = None,
) -> ExhibitionBlock:
    await validate_exhibition(session, block_in.exhibition_id)
    position = await adjust_block_positions(session, block_in.exhibition_id, block_in.position or 0)
    block = await persist_exhibition_block(session, block_in, position)
    await persist_block_items(session, block.id, items)
    await session.commit()
    await session.refresh(block)
    return block


@log_method_call
async def delete_block_items_by_block_id(session: AsyncSession, block_id: UUID) -> None:
    stmt = delete(ExhibitionBlockItem).where(ExhibitionBlockItem.block_id == block_id)
    await session.execute(stmt)


@log_method_call
async def update_exhibition_block(
    session: AsyncSession,
    block_in: ExhibitionBlockUpdate,
    block_id: UUID,
) -> ExhibitionBlock:
    block = await session.get(ExhibitionBlock, block_id)
    if not block:
        raise ValueError(f"Block {block_id} not found")

    base_data = ExhibitionBlockUpdateBase.model_validate(block_in).model_dump(exclude_unset=True)

    if "content" in base_data:
        base_data["content"] = sanitize_block_content(base_data["content"])

    block.sqlmodel_update(base_data)
    session.add(block)

    if block_in.items is not None:
        await delete_block_items_by_block_id(session, block.id)

        sanitized_items = sanitize_block_items(block_in.items)
        for i, item in enumerate(sanitized_items):
            db_item = ExhibitionBlockItem(
                block_id=block.id,
                image_key=item.image_key,
                text=item.text,
                position=i,
            )
            session.add(db_item)

    await session.commit()
    await session.refresh(block)
    return block


@log_method_call
async def delete_exhibition_block(session: AsyncSession, block_id: UUID) -> None:
    block = await session.get(ExhibitionBlock, block_id)
    if not block:
        raise ValueError(f"Block {block_id} not found")
    await session.delete(block)
    await session.commit()
