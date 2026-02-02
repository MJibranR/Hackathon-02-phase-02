# db_test.py (in backend root)
from src.config import settings
import psycopg2

try:
    conn = psycopg2.connect(settings.DATABASE_URL)
    print("Connected to Neon database successfully!")
    conn.close()
except Exception as e:
    print("Database connection failed:", e)
