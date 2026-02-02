# src/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from src.api import tasks, auth
from src.error_handlers import register_error_handlers
from src.logger import logger
from src.db import create_db_and_tables  # make sure this exists in db.py

app = FastAPI(title="Todo App API")

from fastapi.middleware.cors import CORSMiddleware

origins = [
    "http://localhost:3000",  # your React frontend
    "http://localhost:3001",  # your React frontend
    "https://hackathon-02-phase-02-frontend.vercel.app/" # deployed frontend
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,   # must list frontend URL explicitly
    allow_credentials=True,
    allow_methods=["*"],     # GET, POST, PUT, DELETE
    allow_headers=["*"],     # Authorization, Content-Type, etc
)


# Run DB table creation on startup
@app.on_event("startup")
def on_startup():
    try:
        create_db_and_tables()
        logger.info("Database tables created successfully")
    except Exception as e:
        logger.error(f"Failed to create tables: {e}")

# Register custom error handlers
register_error_handlers(app)

# Include API routers
app.include_router(auth.router, prefix="/api")
app.include_router(tasks.router, prefix="/api")

# Root endpoint
@app.get("/")
def read_root():
    logger.info("Root endpoint was called")
    return {"message": "Welcome to the Todo App API"}
