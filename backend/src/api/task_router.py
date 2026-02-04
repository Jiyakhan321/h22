from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlmodel import Session
from typing import List
from jose import jwt
import os
from dotenv import load_dotenv

from src.database import get_session
from src.models.todo_task import TodoTaskCreate, TodoTaskUpdate, TodoTaskRead
from src.services.task_service import TaskService
from src.middleware.auth_middleware import get_current_user_from_token

load_dotenv()

task_router = APIRouter()
security = HTTPBearer()

@task_router.get("/", response_model=List[TodoTaskRead])
def get_tasks(current_user: dict = Depends(get_current_user_from_token),
              db_session: Session = Depends(get_session)):
    """Get all tasks for the authenticated user"""
    user_id = current_user["user_id"]
    tasks = TaskService.get_tasks_by_user(user_id, db_session)
    return tasks

@task_router.post("/", response_model=TodoTaskRead)
def create_task(task_create: TodoTaskCreate,
                current_user: dict = Depends(get_current_user_from_token),
                db_session: Session = Depends(get_session)):
    """Create a new task for the authenticated user"""
    user_id = current_user["user_id"]
    task = TaskService.create_task(task_create, user_id, db_session)
    return task

@task_router.get("/{task_id}", response_model=TodoTaskRead)
def get_task(task_id: str,
             current_user: dict = Depends(get_current_user_from_token),
             db_session: Session = Depends(get_session)):
    """Get a specific task for the authenticated user"""
    user_id = current_user["user_id"]
    task = TaskService.get_task_by_id_and_user(task_id, user_id, db_session)

    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found or you don't have permission to access it"
        )

    return task

@task_router.put("/{task_id}", response_model=TodoTaskRead)
def update_task(task_id: str,
                task_update: TodoTaskUpdate,
                current_user: dict = Depends(get_current_user_from_token),
                db_session: Session = Depends(get_session)):
    """Update a task for the authenticated user"""
    user_id = current_user["user_id"]
    task = TaskService.update_task(task_id, user_id, task_update, db_session)

    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found or you don't have permission to access it"
        )

    return task

@task_router.delete("/{task_id}")
def delete_task(task_id: str,
                current_user: dict = Depends(get_current_user_from_token),
                db_session: Session = Depends(get_session)):
    """Delete a task for the authenticated user"""
    user_id = current_user["user_id"]
    success = TaskService.delete_task(task_id, user_id, db_session)

    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found or you don't have permission to access it"
        )

    return {"message": "Task deleted successfully"}