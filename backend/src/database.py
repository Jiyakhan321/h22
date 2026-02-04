from sqlmodel import create_engine, Session
from contextlib import contextmanager
from typing import Generator
import os
import logging
from dotenv import load_dotenv
from urllib.parse import urlparse

# Configure logging
logger = logging.getLogger(__name__)

load_dotenv()

# Database URL from environment variable
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://user:password@localhost/todo_db")

def get_neon_connect_args(database_url):
    """Get appropriate connection arguments for Neon database"""
    parsed_url = urlparse(database_url)

    # For Neon, we need specific SSL settings
    connect_args = {
        "sslmode": "require",
        "connect_timeout": 30,
    }

    # Additional settings that might help with connection pooling in serverless environments
    if "neon" in parsed_url.hostname or "neon.tech" in database_url:
        connect_args.update({
            "sslmode": "require",
            "connect_timeout": 30,
        })

    return connect_args

# Create the database engine with appropriate settings for Neon
connect_args = get_neon_connect_args(DATABASE_URL)

# For serverless environments like Hugging Face, we may need to handle connections differently
engine = create_engine(
    DATABASE_URL,
    echo=False,  # Set to True for debugging
    connect_args=connect_args,
    pool_pre_ping=True,  # Verify connections before use
    pool_recycle=300,    # Recycle connections every 5 minutes
    pool_size=5,         # Smaller pool size for serverless
    max_overflow=10      # Allow some overflow
)

def get_session() -> Generator[Session, None, None]:
    """
    Dependency function for FastAPI to provide database sessions.
    """
    with Session(engine) as session:
        yield session

# Import models here to ensure they're registered with SQLModel before creating tables
def create_tables():
    """Create all database tables."""
    from sqlmodel import SQLModel
    from .models.user import User
    from .models.todo_task import TodoTask

    try:
        logger.info("Attempting to create database tables...")
        # Add a retry mechanism for table creation in serverless environments
        max_retries = 3
        for attempt in range(max_retries):
            try:
                SQLModel.metadata.create_all(engine)
                logger.info("Database tables created successfully")
                break
            except Exception as e:
                logger.warning(f"Attempt {attempt + 1} to create tables failed: {str(e)}")
                if attempt == max_retries - 1:
                    raise
                import time
                time.sleep(2)  # Wait before retry
    except Exception as e:
        logger.error(f"Error creating database tables: {str(e)}")
        raise