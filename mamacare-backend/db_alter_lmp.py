import sqlite3

conn = sqlite3.connect('mamacare.db')
cursor = conn.cursor()

try:
    cursor.execute("ALTER TABLE users ADD COLUMN lmp DATE;")
    print("Successfully added lmp DATE column.")
except Exception as e:
    print(f"Skipping lmp addition (likely already exists): {e}")

conn.commit()
conn.close()
