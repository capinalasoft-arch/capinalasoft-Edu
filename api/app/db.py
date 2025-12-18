from sqlalchemy import create_engine
from sqlalchemy.engine import Engine

from .settings import settings


def create_db_engine() -> Engine:
    return create_engine(
        settings.sqlalchemy_url,
        pool_pre_ping=True,
        pool_recycle=3600,
    )


engine = create_db_engine()
