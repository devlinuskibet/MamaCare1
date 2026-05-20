from fastapi import APIRouter, HTTPException, Depends
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from pydantic import BaseModel
from app.services.rag_service import rag_service
from app.core.database import get_db
from app.api.auth import get_current_user
from app.models.chat import ChatMessage

router = APIRouter()

class ChatRequest(BaseModel):
    message: str

@router.get("/history")
def get_chat_history(db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    email = current_user["email"]
    messages = db.query(ChatMessage).filter(ChatMessage.user_email == email).order_by(ChatMessage.timestamp.asc()).all()
    return [{"role": m.role, "content": m.content, "timestamp": m.timestamp} for m in messages]

@router.post("/chat")
def chat(request: ChatRequest, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    """
    Streaming Endpoint for MamaAI (RAG).
    """
    email = current_user["email"]
    
    if not rag_service:
         raise HTTPException(status_code=503, detail="RAG Service not available (Check API Keys)")
         
    # 1. Save User Message Immediately
    user_msg = ChatMessage(user_email=email, role="user", content=request.message)
    db.add(user_msg)
    db.commit()
    
    # 2. Generator definition with history capture
    async def generate():
        ai_full_text = ""
        try:
            for chunk in rag_service.get_response_stream(request.message):
                ai_full_text += chunk
                yield chunk
        finally:
            # 3. Save full Assistant Message safely to Database
            if ai_full_text:
                ai_msg = ChatMessage(user_email=email, role="assistant", content=ai_full_text)
                db.add(ai_msg)
                db.commit()

    return StreamingResponse(generate(), media_type="text/event-stream")
