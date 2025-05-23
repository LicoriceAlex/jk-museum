from fastapi import APIRouter

from backend.app.api.routes import (
    users, login, healthcheck,
    organizations, exhibits,
    files, exhibitions, exhibition_blocks
)


api_router = APIRouter()


api_router.include_router(
    users.router, tags=["users"], prefix="/users"
)
api_router.include_router(
    login.router, tags=["login"], prefix="/login"
)
api_router.include_router(
    organizations.router,
    tags=["organizations"],
    prefix="/organizations"
)
api_router.include_router(
    exhibits.router,
    tags=["exhibits"],
    prefix="/exhibits"
)
api_router.include_router(
    files.router,
    tags=["files"],
    prefix="/files"
)
api_router.include_router(healthcheck.router)
api_router.include_router(
    exhibitions.router,
    tags=["exhibitions"],
    prefix="/exhibitions"
)
api_router.include_router(
    exhibition_blocks.router,
    tags=["exhibitions"],
    prefix="/exhibitions/{exhibition_id}/blocks"
)