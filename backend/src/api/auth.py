# File: backend/src/api/auth.py
from typing import Annotated
from datetime import timedelta

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlmodel import Session, select

from ..db import get_session
from ..models.user import User
from ..services.auth_service import create_user, authenticate_user
from ..auth.jwt import create_access_token, ACCESS_TOKEN_EXPIRE_MINUTES, get_current_user
from ..schemas import UserCreate, UserRead, Token

router = APIRouter()

# ----------------------
# Signup Route
# ----------------------
@router.post("/signup", response_model=UserRead, status_code=status.HTTP_201_CREATED)
def signup(
    user_create: UserCreate,
    session: Annotated[Session, Depends(get_session)]
):
    # Check if email is already registered
    statement = select(User).where(User.email == user_create.email)
    existing_user = session.exec(statement).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Create new user
    user = create_user(user_data=user_create.model_dump(), session=session)
    return user

# ----------------------
# Login Route
# ----------------------
@router.post("/login", response_model=Token)
def login(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
    session: Annotated[Session, Depends(get_session)]
):
    user = authenticate_user(
        email=form_data.username,
        password=form_data.password,
        session=session
    )
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Create JWT token
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email},
        expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

# ----------------------
# Get Current Logged-in User
# ----------------------
@router.get("/me", response_model=UserRead) 
def read_current_user(
    current_user: Annotated[User, Depends(get_current_user)]
):
    return current_user