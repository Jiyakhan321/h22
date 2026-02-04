from sqlmodel import Session, select
from typing import List, Optional
from src.models.todo_task import TodoTask, TodoTaskCreate, TodoTaskUpdate

class TaskService:
    @staticmethod
    def create_task(task_create: TodoTaskCreate, owner_id: str, db_session: Session) -> TodoTask:
        """Create a new task for the specified user"""
        db_task = TodoTask(
            title=task_create.title,
            description=task_create.description,
            completed=task_create.completed,
            priority=task_create.priority,
            owner_id=owner_id
        )

        db_session.add(db_task)
        db_session.commit()
        db_session.refresh(db_task)

        return db_task

    @staticmethod
    def get_tasks_by_user(user_id: str, db_session: Session) -> List[TodoTask]:
        """Get all tasks belonging to a specific user"""
        statement = select(TodoTask).where(TodoTask.owner_id == user_id)
        tasks = db_session.exec(statement).all()
        return tasks

    @staticmethod
    def get_task_by_id_and_user(task_id: str, user_id: str, db_session: Session) -> Optional[TodoTask]:
        """Get a specific task that belongs to the specified user"""
        statement = select(TodoTask).where(
            TodoTask.id == task_id,
            TodoTask.owner_id == user_id
        )
        task = db_session.exec(statement).first()
        return task

    @staticmethod
    def update_task(task_id: str, user_id: str, task_update: TodoTaskUpdate, db_session: Session) -> Optional[TodoTask]:
        """Update a task that belongs to the specified user"""
        statement = select(TodoTask).where(
            TodoTask.id == task_id,
            TodoTask.owner_id == user_id
        )
        db_task = db_session.exec(statement).first()

        if not db_task:
            return None

        # Update the task with provided values
        update_data = task_update.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_task, field, value)

        db_session.add(db_task)
        db_session.commit()
        db_session.refresh(db_task)

        return db_task

    @staticmethod
    def delete_task(task_id: str, user_id: str, db_session: Session) -> bool:
        """Delete a task that belongs to the specified user"""
        statement = select(TodoTask).where(
            TodoTask.id == task_id,
            TodoTask.owner_id == user_id
        )
        db_task = db_session.exec(statement).first()

        if not db_task:
            return False

        db_session.delete(db_task)
        db_session.commit()
        return True