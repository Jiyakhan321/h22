from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import os
import logging
from dotenv import load_dotenv

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

from src.api.auth_router import auth_router
from src.api.task_router import task_router
from src.api.chat_router import chat_router
from src.database import create_tables

# Get frontend and backend URLs from environment variables
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:3000")
BACKEND_URL = os.getenv("BACKEND_URL", "http://localhost:8000")

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup logic - create database tables
    logger.info("Starting up FastAPI application...")
    try:
        create_tables()
        logger.info("Database tables created/verified successfully")
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

# CORS middleware - configure origins for Hugging Face Spaces and Vercel frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:3001",
        FRONTEND_URL,  # Your Vercel frontend URL
        BACKEND_URL,   # Your Hugging Face backend URL
        "https://h22-nlqwdpwgq-jaweria.vercel.app",  # Explicitly add your frontend URL
        "*"  # Allow all origins for Hugging Face Spaces deployment
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

logger.info("CORS middleware configured")

# Include routers
app.include_router(auth_router, prefix="/auth", tags=["Authentication"])
app.include_router(task_router, prefix="/tasks", tags=["Tasks"])
app.include_router(chat_router, tags=["Chat"])

logger.info("Auth router mounted")
logger.info("Task router mounted")
logger.info("Chat router mounted")

@app.get("/")
def read_root():
    return {"message": "Todo Web Application API"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}

# Log when the module is loaded
logger.info("FastAPI application module loaded successfully")