"""enums

Revision ID: a8ae60e6c4c5
Revises: b6751333ffaa
Create Date: 2025-12-27 12:38:29.275658

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'a8ae60e6c4c5'
down_revision: Union[str, None] = 'b6751333ffaa'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    
    pass
    # ### end Alembic commands ###


def downgrade() -> None:
    """Downgrade schema."""

    pass
    # ### end Alembic commands ###
