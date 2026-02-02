from typing import List, Optional
from sqlmodel import Session, select
from src.models.task import Task

# -------------------------
# Create a new task
# -------------------------
def create_task(*, task_data: dict, user_id: str, session: Session) -> Task:
    task_data["user_id"] = user_id
    db_task = Task(**task_data)
    session.add(db_task)
    session.commit()
    session.refresh(db_task)
    return db_task

# -------------------------
# Get all tasks for a user
# -------------------------
def get_all_tasks(*, user_id: str, session: Session) -> List[Task]:
    statement = select(Task).where(Task.user_id == user_id).order_by(Task.created_at.desc())
    return session.exec(statement).all()

# -------------------------
# Get single task by ID
# -------------------------
def get_task_by_id(*, task_id: int, user_id: str, session: Session) -> Optional[Task]:
    statement = select(Task).where(Task.id == task_id, Task.user_id == user_id)
    return session.exec(statement).first()

# -------------------------
# Update a task
# -------------------------
def update_task(*, task: Task, task_data: dict, session: Session) -> Task:
    for key, value in task_data.items():
        setattr(task, key, value)
    session.add(task)
    session.commit()
    session.refresh(task)
    return task

# -------------------------
# Delete a task
# -------------------------
def delete_task(*, task: Task, session: Session):
    session.delete(task)
    session.commit()

# -------------------------
# Toggle task completion
# -------------------------
def toggle_task_completion(*, task: Task, completed: bool, session: Session) -> Task:
    task.completed = completed
    session.add(task)
    session.commit()
    session.refresh(task)
    return task
