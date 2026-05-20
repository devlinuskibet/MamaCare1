from app.core.database import engine, Base
from app.models.wellness import WellnessProgress

print("Migrating Wellness schema...")
Base.metadata.create_all(bind=engine, tables=[WellnessProgress.__table__])
print("Successfully created wellness_progress table.")
