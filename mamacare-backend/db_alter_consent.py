import sqlite3

def alter():
    conn = sqlite3.connect('mamacare.db')
    c = conn.cursor()
    columns = [
        ("has_consented", "BOOLEAN DEFAULT 0")
    ]
    
    for col, dtype in columns:
        try:
            c.execute(f"ALTER TABLE users ADD COLUMN {col} {dtype}")
            print(f"Added {col}")
        except sqlite3.OperationalError as e:
            print(f"{col} already exists or error: {e}")
            
    # Set default values for preexisting users
    c.execute("UPDATE users SET has_consented = 0 WHERE has_consented IS NULL")
    
    conn.commit()
    conn.close()
    print("Database alteration complete.")

if __name__ == "__main__":
    alter()
