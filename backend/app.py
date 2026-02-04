from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import os
import logging
from dotenv import load_dotenv
import asyncio

# Configure logging - use more detailed logging for Hugging Face debugging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

from src.api.auth_router import auth_router
from src.api.task_router import task_router
from src.database import create_tables

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup logic - create database tables
    logger.info("Starting up FastAPI application...")
    logger.info(f"DATABASE_URL environment variable exists: {'DATABASE_URL' in os.environ}")
    logger.info(f"Database URL starts with postgresql: {os.getenv('DATABASE_URL', '').startswith('postgresql')}")
    
    try:
        # Add a retry mechanism for database initialization
        max_retries = 5
        for attempt in range(max_retries):
            try:
                create_tables()
                logger.info("Database tables created/verified successfully")
                break
            except Exception as e:
                logger.warning(f"Database initialization attempt {attempt + 1} failed: {str(e)}")
                if attempt == max_retries - 1:
                    logger.error(f"Failed to initialize database after {max_retries} attempts")
                    raise
                # Wait progressively longer between attempts
                wait_time = 2 ** attempt  # Exponential backoff
                logger.info(f"Waiting {wait_time}s before next attempt...")
                await asyncio.sleep(wait_time)
                
    except Exception as e:
        logger.error(f"Database connection error: {str(e)}")
        raise
    logger.info("FastAPI application started successfully")
    yield
    # Shutdown logic can go here
    logger.info("Shutting down FastAPI application...")

app = FastAPI(
    title="Todo Web Application API",
    description="REST API for the Full-Stack Multi-User Todo Web Application",
    version="1.0.0",
    lifespan=lifespan
)

logger.info("FastAPI app initialized")

# CORS middleware - configure origins for Hugging Face Spaces and local development
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://localhost:3000",
        "http://localhost:3001",
        "https://localhost:3001",
        "http://127.0.0.1:3000",
        "https://127.0.0.1:3000",
        "https://*.hf.space",  # Specific for Hugging Face Spaces
        "https://huggingface.co",  # Hugging Face domain
        "*",  # Allow all origins for Hugging Face Spaces deployment
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

logger.info("CORS middleware configured")

# Include routers
app.include_router(auth_router, prefix="/auth", tags=["Authentication"])
app.include_router(task_router, prefix="/tasks", tags=["Tasks"])

logger.info("Auth router mounted")
logger.info("Task router mounted")

@app.get("/")
def read_root():
    return {"message": "Todo Web Application API"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}

@app.get("/debug/env")
def debug_env():
    """Debug endpoint to check environment variables"""
    return {
        "database_url_set": "DATABASE_URL" in os.environ,
        "database_url_preview": os.getenv("DATABASE_URL", "")[:50] + "..." if os.getenv("DATABASE_URL") else "Not set",
    }

# Log when the module is loaded
logger.info("FastAPI application module loaded successfully")