# src/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os

from src.api import tasks, auth
from src.error_handlers import register_error_handlers
from src.logger import logger
from src.db import create_db_and_tables

app = FastAPI(title="Todo App API")

# ✅ ALLOW EVERYTHING - COMPLETELY PUBLIC
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow ALL origins
    allow_credentials=False,  # Disable credentials requirement
    allow_methods=["*"],  # Allow all methods
    allow_headers=["*"],  # Allow all headers
)

@app.on_event("startup")
def on_startup():
    try:
        create_db_and_tables()
        logger.info("Database tables created successfully")
    except Exception as e:
        logger.error(f"Failed to create tables: {e}")

register_error_handlers(app)

app.include_router(auth.router, prefix="/api")
app.include_router(tasks.router, prefix="/api")

@app.get("/")
def read_root():
    logger.info("Root endpoint was called")
    return {"message": "Welcome to the Todo App API"}

@app.get("/api/health")
def health_check():
    return {
        "status": "ok",
        "database_url_set": bool(os.getenv("DATABASE_URL")),
        "secret_set": bool(os.getenv("BETTER_AUTH_SECRET")),
    }