from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.services.rag_service import rag_service

router = APIRouter()

class ChatRequest(BaseModel):
    message: str

@router.post("/chat")
def chat(request: ChatRequest):
    """
    Endpoint for MamaBot (RAG).
    """
    if not rag_service:
         raise HTTPException(status_code=503, detail="RAG Service not available (Check API Keys)")
         
    result = rag_service.get_response(request.message)
    return result
