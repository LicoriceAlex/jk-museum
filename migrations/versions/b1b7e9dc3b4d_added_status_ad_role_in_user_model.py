"""added status ad role in user model

Revision ID: b1b7e9dc3b4d
Revises: 1496a8a81f0a
Create Date: 2025-04-03 11:09:33.430244

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'b1b7e9dc3b4d'
down_revision: Union[str, None] = '1496a8a81f0a'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade():
    # 1. Создаем ENUM типы
    status_enum = sa.Enum('active', 'blocked', name='statusenum')
    role_enum = sa.Enum('user', 'moderator', 'admin', name='roleenum')
    status_enum.create(op.get_bind())
    role_enum.create(op.get_bind())
    
    # 2. Добавляем колонки как NULLABLE
    op.add_column('users', sa.Column('status', status_enum, nullable=True))
    op.add_column('users', sa.Column('role', role_enum, nullable=True))
    
    # 3. Заполняем существующие записи дефолтными значениями
    op.execute("UPDATE users SET status = 'active' WHERE status IS NULL")
    op.execute("UPDATE users SET role = 'user' WHERE role IS NULL")
    
    # 4. Меняем на NOT NULL
    op.alter_column('users', 'status', nullable=False)
    op.alter_column('users', 'role', nullable=False)


def downgrade():
    # 1. Сначала делаем колонки NULLABLE
    op.alter_column('users', 'status', nullable=True)
    op.alter_column('users', 'role', nullable=True)
    
    # 2. Удаляем колонки
    op.drop_column('users', 'status')
    op.drop_column('users', 'role')
    
    # 3. Удаляем ENUM типы
    sa.Enum(name='statusenum').drop(op.get_bind())
    sa.Enum(name='roleenum').drop(op.get_bind())
    