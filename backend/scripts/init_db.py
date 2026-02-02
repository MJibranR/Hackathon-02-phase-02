# scripts/init_db.py
import sys
import os

# Add the src folder to the path
sys.path.append(os.path.join(os.path.dirname(os.path.abspath(__file__)), "../src"))

from db import create_db_and_tables  # now absolute import works

if __name__ == "__main__":
    create_db_and_tables()
    print("✅ Database tables created successfully!")
