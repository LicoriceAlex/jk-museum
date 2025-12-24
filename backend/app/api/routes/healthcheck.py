from backend.app.utils.healthcheck import check_postgres
from fastapi import APIRouter, HTTPException

router = APIRouter()


@router.get("/health")
async def health_check():
    results = {
        "postgres": await check_postgres(),
    }

    if all(results.values()):
        return {"status": "healthy", "details": results}
<<<<<<< HEAD
    
    raise HTTPException(
        status_code=503,
        detail={"status": "unhealthy", "details": results}
    )
=======

    raise HTTPException(status_code=503, detail={"status": "unhealthy", "details": results})
>>>>>>> origin/main
