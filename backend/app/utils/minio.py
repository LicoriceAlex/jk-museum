import uuid
from collections.abc import AsyncGenerator

from aiobotocore.session import get_session
from backend.app.core.config import settings
from botocore.config import Config
from fastapi import HTTPException, UploadFile


class MinIOClient:
    def __init__(self):
        self.bucket_name = settings.MINIO_BUCKET
        self.endpoint_url = settings.MINIO_ENDPOINT
        self.access_key = settings.MINIO_ACCESS_KEY
        self.secret_key = settings.MINIO_SECRET_KEY
        self.session = get_session()

    async def _get_client(self) -> AsyncGenerator:
        """Create and return an async S3 client."""
        async with self.session.create_client(
            "s3",
            endpoint_url=self.endpoint_url,
            aws_access_key_id=self.access_key,
            aws_secret_access_key=self.secret_key,
            config=Config(signature_version="s3v4"),
        ) as client:
            yield client

    async def initialize_bucket(self):
        """Ensure the bucket exists, creating it if necessary."""
        async for client in self._get_client():
            try:
                await client.head_bucket(Bucket=self.bucket_name)
            except client.exceptions.ClientError as e:
                error_code = e.response["Error"]["Code"]
                if error_code in ("404", "NoSuchBucket"):
                    await client.create_bucket(Bucket=self.bucket_name)
                else:
                    raise

    async def upload_file(self, file: UploadFile, prefix: str = "") -> str:
        """Upload a file to MinIO and return the object key."""
        file_key = f"{uuid.uuid4()}"
        file_content = await file.read()

        async for client in self._get_client():
            await client.put_object(
                Bucket=self.bucket_name,
                Key=file_key,
                Body=file_content,
                ContentType=file.content_type,
            )
        return file_key

    async def get_file_url(self, file_key: str, expires_in: int = 3600) -> str:
        """Generate a presigned URL for a file."""
        async for client in self._get_client():
            url = await client.generate_presigned_url(
                ClientMethod="get_object",
                Params={"Bucket": self.bucket_name, "Key": file_key},
                ExpiresIn=expires_in,
            )
            return url

    async def delete_file(self, file_key: str):
        """Delete a file from MinIO."""
        async for client in self._get_client():
            await client.delete_object(Bucket=self.bucket_name, Key=file_key)

    async def download_file(self, file_key: str) -> AsyncGenerator[bytes, None]:
        """Download a file from MinIO as a stream."""
        async for client in self._get_client():
            try:
                response = await client.get_object(Bucket=self.bucket_name, Key=file_key)
                async for chunk in response["Body"].iter_chunks():
                    yield chunk
            except client.exceptions.NoSuchKey as err:
                raise HTTPException(status_code=404, detail="File not found") from err
            except Exception as err:
                raise HTTPException(
                    status_code=500,
                    detail=f"Error downloading file: {err!s}",
                ) from err
            finally:
                # Ensure the response is closed
                if "response" in locals():
                    response["Body"].close()


# Singleton instance
minio_client = MinIOClient()
