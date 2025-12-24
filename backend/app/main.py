from contextlib import asynccontextmanager

from backend.app.api.main import api_router
from backend.app.core.config import settings
from backend.app.utils.logger import logger
from backend.app.utils.middleware import LoggingMiddleware
from backend.app.utils.minio import minio_client
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Lifespan context manager for FastAPI application.
    This function is used to manage the startup and shutdown events of the FastAPI application.
    It initializes the application and performs any necessary cleanup on shutdown.
    """
    logger.info("Starting FastAPI application...")
    await minio_client.initialize_bucket()
    yield
    logger.info("Shutting down FastAPI application...")


app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
<<<<<<< HEAD
app.add_middleware(
    LoggingMiddleware
)
=======
app.add_middleware(LoggingMiddleware)
>>>>>>> origin/main

app.include_router(api_router, prefix=settings.API_V1_STR)
