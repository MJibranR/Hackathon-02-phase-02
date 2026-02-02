from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os

from src.api import tasks, auth
from src.error_handlers import register_error_handlers
from src.logger import logger
from src.db import create_db_and_tables

app = FastAPI()

# OPEN CORS - ALLOW EVERYTHING
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
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
    return {"message": "Welcome to the Todo App API", "cors": "open"}

@app.get("/api/health")
def health_check():
    return {"status": "ok", "cors_enabled": True}