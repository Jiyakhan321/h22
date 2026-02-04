from sqlalchemy import create_engine, inspect
from sqlmodel import SQLModel
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Import models to register them with SQLModel
from src.models.user import User
from src.models.todo_task import TodoTask
# Database URL from environment variable
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://user:password@localhost/todo_db")

try:
    print("Attempting to connect to database...")
    print(f"Database URL: {DATABASE_URL[:50]}...")  # Truncate for safety

    # Create the database engine
    engine = create_engine(DATABASE_URL, echo=True)

    # Test the connection
    with engine.connect() as connection:
        print("Database connection successful!")

        # Check existing tables
        inspector = inspect(engine)
        tables = inspector.get_table_names()
        print(f"Existing tables: {tables}")

        # Create tables if they don't exist
        print("Creating tables if they don't exist...")
        SQLModel.metadata.create_all(engine)

        # Check tables again after creation
        tables_after = inspector.get_table_names()
        print(f"Tables after creation: {tables_after}")

        print("Tables created successfully!")

except Exception as e:
    print(f"Database connection failed: {e}")
    print("This could be due to:")
    print("- Incorrect database URL in .env")
    print("- Database server not running")
    print("- Network connectivity issues")
    print("- Authentication problems")