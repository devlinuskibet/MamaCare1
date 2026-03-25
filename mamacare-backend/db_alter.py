import sqlite3

conn = sqlite3.connect('mamacare.db')
cursor = conn.cursor()

columns = [
    "phone VARCHAR",
    "location VARCHAR",
    "emergency_contact VARCHAR",
    "hospital_name VARCHAR",
    "specialization VARCHAR",
    "gestation_weeks INTEGER"
]

for col in columns:
    try:
        cursor.execute(f"ALTER TABLE users ADD COLUMN {col};")
        print(f"Successfully added {col}")
    except Exception as e:
        print(f"Skipping {col} (likely already exists): {e}")

conn.commit()
conn.close()
print("Database schema migration completed successfully.")
