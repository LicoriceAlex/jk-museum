from fastapi import APIRouter, HTTPException

from backend.app.utils.healthcheck import check_postgres


router = APIRouter()

@router.get("/health")
async def health_check():
    results = {
        "postgres": await check_postgres(),
    }
    
    if all(results.values()):
        return {"status": "healthy", "details": results}
    
    raise HTTPException(
        status_code=503,
        detail={"status": "unhealthy", "details": results}
    )