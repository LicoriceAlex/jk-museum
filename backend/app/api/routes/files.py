import io
from typing import Any
from fastapi import APIRouter, File, HTTPException, UploadFile
from fastapi.responses import StreamingResponse
from backend.app.utils.minio import minio_client
from backend.app.db.schemas import FileUploadResponse


router = APIRouter()


@router.post(
    "/upload",
    response_model=FileUploadResponse,
)
async def upload_file(
    file: UploadFile = File(...),
    prefix: str = "general/"
) -> Any:
    """Загрузить файл в MinIO и вернуть ключ объекта и подписанный URL."""
    image_key = await minio_client.upload_file(file, prefix=prefix)
    file_url = await minio_client.get_file_url(image_key)
    return FileUploadResponse(image_key=image_key, file_url=file_url)


@router.get("/{image_key}")
async def serve_exhibit_file(image_key: str):
    """Serve a file from MinIO as a streaming response."""
    try:
        return StreamingResponse(
            content=minio_client.download_file(image_key),
            media_type="image/jpeg",
            headers={"Cache-Control": "no-cache"}
        )
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Error serving file: {str(e)}")
