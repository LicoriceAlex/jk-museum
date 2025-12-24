from typing import Any

from backend.app.db.schemas import FileUploadResponse
from backend.app.utils.minio import minio_client
from fastapi import APIRouter, File, HTTPException, UploadFile
from fastapi.responses import StreamingResponse

router = APIRouter()


@router.post(
    "/upload",
    response_model=FileUploadResponse,
)
async def upload_file(file: UploadFile = None, prefix: str = "general/") -> Any:
    """Загрузить файл в MinIO и вернуть ключ объекта и подписанный URL."""
    if file is None:
        file = File(...)
    object_key = await minio_client.upload_file(file, prefix=prefix)
    file_url = await minio_client.get_file_url(object_key)
    return FileUploadResponse(object_key=object_key, file_url=file_url)


@router.get("/{object_key}")
async def serve_exhibit_file(object_key: str):
    """Serve a file from MinIO as a streaming response."""
    try:
        return StreamingResponse(
            content=minio_client.download_file(object_key),
            media_type="image/jpeg",
            headers={"Cache-Control": "no-cache"},
        )
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error serving file: {e!s}") from e
