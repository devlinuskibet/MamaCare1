from app.core.database import engine, Base
from app.models.user import User
from app.models.wellness import WellnessProgress

print("Dropping wellness_progress table to ensure schema sync...")
try:
    WellnessProgress.__table__.drop(bind=engine)
    print("Dropped.")
except Exception as e:
    print(e)

print("Recreating Wellness schema...")
Base.metadata.create_all(bind=engine, tables=[WellnessProgress.__table__])
print("Schema successfully completely recreated.")
