from pydantic import computed_field, field_validator
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    PROJECT_NAME: str
    
    API_V1_STR: str
    
    SECRET_KEY: str
    
    BACKEND_CORS_ORIGINS: list[str] = ["http://localhost", "http://127.0.0.1"]
    
    @field_validator('BACKEND_CORS_ORIGINS', mode='before')
    def assemble_cors_origins(cls, v: str | list[str]) -> list[str]:
        if isinstance(v, str) and not v.startswith("["):
            return [i.strip() for i in v.split(",")]
        elif isinstance(v, (list, str)):
            return v
        raise ValueError(v)
    
    # Database settings
    POSTGRES_SERVER: str
    POSTGRES_USER: str
    POSTGRES_PASSWORD: str
    POSTGRES_DB: str
    POSTGRES_PORT: int
    
    @computed_field
    @property
    def async_db(self) -> str:
        return f'postgresql+asyncpg://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}@{self.POSTGRES_SERVER}:{self.POSTGRES_PORT}/{self.POSTGRES_DB}'
    
    @computed_field
    @property
    def sync_db(self) -> str:
        return f'postgresql://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}@{self.POSTGRES_SERVER}:{self.POSTGRES_PORT}/{self.POSTGRES_DB}'

    ACCESS_TOKEN_EXPIRE_MINUTES: int
    EMAIL_RESET_TOKEN_EXPIRE_HOURS: int
    
    EMAILS_FROM_NAME: str
    EMAILS_FROM_EMAIL: str
    SMTP_HOST: str
    SMTP_PORT: int
    SMTP_USER: str
    SMTP_PASSWORD: str
    SMTP_TLS: bool
    SMTP_SSL: bool
    
    FRONTEND_HOST: str
    
    # consts
    DEFAULT_QUERY_LIMIT: int
    MIN_PASSWORD_LENGTH: int

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        
settings = Settings()