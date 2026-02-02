from typing import List, Optional
from datetime import datetime
from sqlmodel import SQLModel, Field

# User Schemas
class UserCreate(SQLModel):
    email: str
    name: str
    password: str

class UserRead(SQLModel):
    id: int          # str -> int
    email: str
    name: str

class Token(SQLModel):
    access_token: str
    token_type: str

# Task Schemas
class TaskCreate(SQLModel):
    title: str = Field(min_length=1, max_length=200)
    description: str | None = Field(default=None, max_length=1000)

class TaskRead(SQLModel):
    id: int
    title: str
    description: str | None = None
    completed: bool
    user_id: int     # str -> int
    created_at: datetime
    updated_at: datetime

class TaskUpdate(SQLModel):
    title: str | None = Field(default=None, min_length=1, max_length=200)
    description: str | None = Field(default=None, max_length=1000)
    completed: bool | None = None

class TaskCompletion(SQLModel):
    completed: bool