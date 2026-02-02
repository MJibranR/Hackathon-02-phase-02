# backend/src/api/tasks.py
from typing import Annotated, List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session

from ..db import get_session
from ..models.task import Task
from ..models.user import User
from ..auth.jwt import get_current_user
from ..services.task_service import create_task, get_all_tasks, get_task_by_id, update_task, delete_task, toggle_task_completion
from ..schemas import TaskCreate, TaskRead, TaskUpdate, TaskCompletion

router = APIRouter()

@router.post("/{user_id}/tasks", response_model=TaskRead, status_code=status.HTTP_201_CREATED)  # added {user_id}
def create_task_for_user(
    user_id: int,  # str -> int
    task_create: TaskCreate,
    current_user: Annotated[User, Depends(get_current_user)],
    session: Annotated[Session, Depends(get_session)]
):
    if user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to create tasks for this user."
        )
    
    task_data = task_create.model_dump()
    task = create_task(task_data=task_data, user_id=current_user.id, session=session)
    return task

@router.get("/{user_id}/tasks", response_model=List[TaskRead])  # added {user_id}
def read_tasks(
    user_id: int,  # str -> int
    current_user: Annotated[User, Depends(get_current_user)],
    session: Annotated[Session, Depends(get_session)]
):
    if user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to view tasks for this user."
        )
    tasks = get_all_tasks(user_id=current_user.id, session=session)
    return tasks

@router.get("/{user_id}/tasks/{task_id}", response_model=TaskRead)  # added {user_id}
def read_single_task(
    user_id: int,  # str -> int
    task_id: int,
    current_user: Annotated[User, Depends(get_current_user)],
    session: Annotated[Session, Depends(get_session)]
):
    if user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to view tasks for this user."
        )
    task = get_task_by_id(task_id=task_id, user_id=current_user.id, session=session)
    if not task:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found")
    return task

@router.put("/{user_id}/tasks/{task_id}", response_model=TaskRead)  # added {user_id}
def update_existing_task(
    user_id: int,  # str -> int
    task_id: int,
    task_update: TaskUpdate,
    current_user: Annotated[User, Depends(get_current_user)],
    session: Annotated[Session, Depends(get_session)]
):
    if user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update tasks for this user."
        )
    task = get_task_by_id(task_id=task_id, user_id=current_user.id, session=session)
    if not task:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found")
    
    updated_task_data = task_update.model_dump(exclude_unset=True)
    task = update_task(task=task, task_data=updated_task_data, session=session)
    return task

@router.delete("/{user_id}/tasks/{task_id}", status_code=status.HTTP_204_NO_CONTENT)  # added {user_id}
def delete_existing_task(
    user_id: int,  # str -> int
    task_id: int,
    current_user: Annotated[User, Depends(get_current_user)],
    session: Annotated[Session, Depends(get_session)]
):
    if user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to delete tasks for this user."
        )
    task = get_task_by_id(task_id=task_id, user_id=current_user.id, session=session)
    if not task:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found")
    
    delete_task(task=task, session=session)
    return

@router.patch("/{user_id}/tasks/{task_id}/complete", response_model=TaskRead)  # added {user_id}
def toggle_task_completion_status(
    user_id: int,  # str -> int
    task_id: int,
    task_completion: TaskCompletion,
    current_user: Annotated[User, Depends(get_current_user)],
    session: Annotated[Session, Depends(get_session)]
):
    if user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to modify tasks for this user."
        )
    task = get_task_by_id(task_id=task_id, user_id=current_user.id, session=session)
    if not task:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found")
    
    task = toggle_task_completion(task=task, completed=task_completion.completed, session=session)
    return task