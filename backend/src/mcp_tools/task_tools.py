from typing import Optional, List
from sqlmodel import Session, select
from src.models.todo_task import TodoTask, TodoTaskCreate, TodoTaskUpdate
from src.database import get_session
from src.services.task_service import TaskService


class TaskTools:
    """MCP tools for task management operations"""
    
    @staticmethod
    def add_task(user_id: str, title: str, description: Optional[str] = None) -> dict:
        """
        Add a new task for the user.
        
        Args:
            user_id: The ID of the user creating the task
            title: The title of the task
            description: Optional description of the task
            
        Returns:
            Dictionary with task creation result
        """
        try:
            # Create a new database session
            with next(get_session()) as db_session:
                # Create task data
                task_create = TodoTaskCreate(
                    title=title,
                    description=description or "",
                    completed=False,
                    priority="medium"  # Default priority
                )
                
                # Use TaskService to create the task
                new_task = TaskService.create_task(task_create, user_id, db_session)
                
                return {
                    "success": True,
                    "task_id": str(new_task.id),
                    "message": f"Task '{title}' added successfully"
                }
        except Exception as e:
            return {
                "success": False,
                "error": str(e),
                "message": f"Failed to add task: {str(e)}"
            }

    @staticmethod
    def list_tasks(user_id: str, status: str = "all") -> dict:
        """
        List tasks for the user based on status.
        
        Args:
            user_id: The ID of the user whose tasks to list
            status: Filter by status ('all', 'pending', 'completed')
            
        Returns:
            Dictionary with list of tasks
        """
        try:
            # Create a new database session
            with next(get_session()) as db_session:
                # Get all tasks for the user
                tasks = TaskService.get_tasks_by_user(user_id, db_session)
                
                # Filter based on status
                if status == "pending":
                    tasks = [task for task in tasks if not task.completed]
                elif status == "completed":
                    tasks = [task for task in tasks if task.completed]
                # 'all' returns all tasks
                
                # Format tasks for response
                formatted_tasks = []
                for task in tasks:
                    formatted_tasks.append({
                        "id": str(task.id),
                        "title": task.title,
                        "description": task.description,
                        "completed": task.completed,
                        "priority": task.priority,
                        "created_at": task.created_at.isoformat() if task.created_at else None,
                        "updated_at": task.updated_at.isoformat() if task.updated_at else None
                    })
                
                return {
                    "success": True,
                    "tasks": formatted_tasks,
                    "count": len(formatted_tasks),
                    "message": f"Found {len(formatted_tasks)} {status} tasks"
                }
        except Exception as e:
            return {
                "success": False,
                "error": str(e),
                "message": f"Failed to list tasks: {str(e)}"
            }

    @staticmethod
    def complete_task(user_id: str, task_id: str) -> dict:
        """
        Mark a task as completed.
        
        Args:
            user_id: The ID of the user
            task_id: The ID of the task to complete
            
        Returns:
            Dictionary with completion result
        """
        try:
            # Create a new database session
            with next(get_session()) as db_session:
                # First, get the task to verify it exists and belongs to the user
                task = TaskService.get_task_by_id_and_user(task_id, user_id, db_session)
                
                if not task:
                    return {
                        "success": False,
                        "error": "Task not found or access denied",
                        "message": "Task not found or you don't have permission to access it"
                    }
                
                # Update the task to mark as completed
                task_update = TodoTaskUpdate(completed=True)
                updated_task = TaskService.update_task(task_id, user_id, task_update, db_session)
                
                if not updated_task:
                    return {
                        "success": False,
                        "error": "Failed to update task",
                        "message": "Could not mark task as completed"
                    }
                
                return {
                    "success": True,
                    "task_id": str(updated_task.id),
                    "message": f"Task '{updated_task.title}' marked as completed"
                }
        except Exception as e:
            return {
                "success": False,
                "error": str(e),
                "message": f"Failed to complete task: {str(e)}"
            }

    @staticmethod
    def delete_task(user_id: str, task_id: str) -> dict:
        """
        Delete a task.
        
        Args:
            user_id: The ID of the user
            task_id: The ID of the task to delete
            
        Returns:
            Dictionary with deletion result
        """
        try:
            # Create a new database session
            with next(get_session()) as db_session:
                # First, get the task to verify it exists and belongs to the user
                task = TaskService.get_task_by_id_and_user(task_id, user_id, db_session)
                
                if not task:
                    return {
                        "success": False,
                        "error": "Task not found or access denied",
                        "message": "Task not found or you don't have permission to access it"
                    }
                
                # Delete the task
                success = TaskService.delete_task(task_id, user_id, db_session)
                
                if not success:
                    return {
                        "success": False,
                        "error": "Failed to delete task",
                        "message": "Could not delete task"
                    }
                
                return {
                    "success": True,
                    "task_id": task_id,
                    "message": f"Task '{task.title}' deleted successfully"
                }
        except Exception as e:
            return {
                "success": False,
                "error": str(e),
                "message": f"Failed to delete task: {str(e)}"
            }

    @staticmethod
    def update_task(user_id: str, task_id: str, title: Optional[str] = None, description: Optional[str] = None) -> dict:
        """
        Update a task's title or description.
        
        Args:
            user_id: The ID of the user
            task_id: The ID of the task to update
            title: New title (optional)
            description: New description (optional)
            
        Returns:
            Dictionary with update result
        """
        try:
            # Create a new database session
            with next(get_session()) as db_session:
                # First, get the task to verify it exists and belongs to the user
                task = TaskService.get_task_by_id_and_user(task_id, user_id, db_session)
                
                if not task:
                    return {
                        "success": False,
                        "error": "Task not found or access denied",
                        "message": "Task not found or you don't have permission to access it"
                    }
                
                # Prepare update data
                update_data = {}
                if title is not None:
                    update_data["title"] = title
                if description is not None:
                    update_data["description"] = description
                
                if not update_data:
                    return {
                        "success": False,
                        "error": "No updates provided",
                        "message": "No title or description provided to update"
                    }
                
                # Create update object
                task_update = TodoTaskUpdate(**update_data)
                
                # Update the task
                updated_task = TaskService.update_task(task_id, user_id, task_update, db_session)
                
                if not updated_task:
                    return {
                        "success": False,
                        "error": "Failed to update task",
                        "message": "Could not update task"
                    }
                
                return {
                    "success": True,
                    "task_id": str(updated_task.id),
                    "message": f"Task updated successfully"
                }
        except Exception as e:
            return {
                "success": False,
                "error": str(e),
                "message": f"Failed to update task: {str(e)}"
            }