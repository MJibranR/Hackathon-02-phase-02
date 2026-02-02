import logging

def setup_logging() -> logging.Logger:
    """
    Sets up the global logger and returns a logger instance.
    """
    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
        handlers=[
            logging.StreamHandler()
        ]
    )

    # Suppress noisy logs from uvicorn
    logging.getLogger("uvicorn").setLevel(logging.WARNING)
    logging.getLogger("uvicorn.access").setLevel(logging.WARNING)

    # Suppress noisy logs from sqlalchemy
    logging.getLogger("sqlalchemy").setLevel(logging.WARNING)

    return logging.getLogger("todo_app")  # Your app-specific logger

# Create a logger instance
logger = setup_logging()
