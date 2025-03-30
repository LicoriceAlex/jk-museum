import asyncpg

from backend.app.core.config import settings


async def check_postgres():
    try:
        conn = await asyncpg.connect(
            user=settings.POSTGRES_USER,
            password=settings.POSTGRES_PASSWORD,
            database=settings.POSTGRES_DB,
            host=settings.POSTGRES_SERVER,
            port=settings.POSTGRES_PORT
        )
        await conn.close()
        return True
    except Exception:
        return False
