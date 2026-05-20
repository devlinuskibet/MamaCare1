from app.core.database import engine, Base
from app.models.user import User
from app.models.chat import ChatMessage

print("Creating chat_messages table...")
Base.metadata.create_all(bind=engine, tables=[ChatMessage.__table__])
print("Successfully created chat_messages table.")
