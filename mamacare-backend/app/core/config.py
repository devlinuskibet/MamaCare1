from pydantic_settings import BaseSettings
from typing import List, Union

class Settings(BaseSettings):
    PROJECT_NAME: str
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str
    ALGORITHM: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int
    
    # We parse the list of origins for React
    BACKEND_CORS_ORIGINS: List[str] = ["http://localhost:3000"]

    OPENAI_API_KEY: str
    
    # RAG Settings
    OPENROUTER_API_KEY: str
    PINECONE_API_KEY: str
    PINECONE_INDEX_NAME: str = "maternal-care"
    PINECONE_HOST: str | None = None

    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()