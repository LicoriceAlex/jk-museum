from backend.app.api.routes.admin import exhibitions, organizations
from fastapi import APIRouter

router = APIRouter()

router.include_router(organizations.router, prefix="/organizations", tags=["admin/organizations"])
router.include_router(exhibitions.router, prefix="/exhibitions", tags=["admin/exhibitions"])
