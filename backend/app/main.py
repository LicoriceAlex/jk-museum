
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.app.api.main import api_router
from backend.app.core.config import settings
from backend.app.utils.logger import logger
    
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix=settings.API_V1_STR)