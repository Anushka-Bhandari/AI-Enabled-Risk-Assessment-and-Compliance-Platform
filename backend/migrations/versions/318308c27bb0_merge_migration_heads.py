"""Merge migration heads

Revision ID: 318308c27bb0
Revises: 0e373399fe85, fc59e2f5485e
Create Date: 2026-07-09 03:11:10.409183

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '318308c27bb0'
down_revision = ('0e373399fe85', 'fc59e2f5485e')
branch_labels = None
depends_on = None


def upgrade():
    pass


def downgrade():
    pass
