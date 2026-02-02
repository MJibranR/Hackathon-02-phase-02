from typing import Optional
from datetime import datetime

from sqlmodel import Field, SQLModel, Relationship

from .user import User


class Task(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    title: str = Field(min_length=1, max_length=200, nullable=False)
    description: Optional[str] = Field(default=None, max_length=1000)
    completed: bool = Field(default=False, nullable=False)
    created_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)
    updated_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)

    user_id: int = Field(foreign_key="user.id", index=True, nullable=False)  # Changed str -> int
    user: Optional[User] = Relationship(back_populates="tasks")