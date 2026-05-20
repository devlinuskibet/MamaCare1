import sqlite3

def alter():
    conn = sqlite3.connect('mamacare.db')
    c = conn.cursor()
    columns = [
        ("age", "INTEGER"), 
        ("gravida", "INTEGER"), 
        ("parity", "INTEGER"), 
        ("living_children", "INTEGER"), 
        ("blood_group", "VARCHAR"), 
        ("height_cm", "FLOAT"), 
        ("pre_pregnancy_weight_kg", "FLOAT"),
        ("has_diabetes", "BOOLEAN DEFAULT 0"), 
        ("has_hypertension", "BOOLEAN DEFAULT 0"),
        ("has_asthma", "BOOLEAN DEFAULT 0"), 
        ("has_epilepsy", "BOOLEAN DEFAULT 0"),
        ("prev_csection", "BOOLEAN DEFAULT 0"), 
        ("is_profile_complete", "BOOLEAN DEFAULT 0")
    ]
    
    for col, dtype in columns:
        try:
            c.execute(f"ALTER TABLE users ADD COLUMN {col} {dtype}")
            print(f"Added {col}")
        except sqlite3.OperationalError as e:
            print(f"{col} already exists or error: {e}")
            
    # Set default values for preexisting users
    c.execute("UPDATE users SET is_profile_complete = 0 WHERE is_profile_complete IS NULL")
    
    conn.commit()
    conn.close()
    print("Database alteration complete.")

if __name__ == "__main__":
    alter()
