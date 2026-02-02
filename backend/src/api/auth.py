from typing import Optional
from sqlmodel import Session, select
from passlib.context import CryptContext
from src.models.user import User

# -------------------------
# Password hashing context
# -------------------------
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
BCRYPT_MAX_LENGTH = 72  # bcrypt only supports 72-byte passwords

# -------------------------
# Password utilities
# -------------------------
def get_password_hash(password: str) -> str:
    """
    Hash the password using bcrypt.
    Truncate to 72 BYTES (not characters) to avoid bcrypt limitation.
    """
    # Convert to bytes and truncate, then back to string
    password_bytes = password.encode('utf-8')[:BCRYPT_MAX_LENGTH]
    safe_password = password_bytes.decode('utf-8', errors='ignore')
    return pwd_context.hash(safe_password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verify a password against its hash.
    Truncate to 72 BYTES (not characters) to match hashing.
    """
    # Convert to bytes and truncate, then back to string
    password_bytes = plain_password.encode('utf-8')[:BCRYPT_MAX_LENGTH]
    safe_password = password_bytes.decode('utf-8', errors='ignore')
    return pwd_context.verify(safe_password, hashed_password)

# -------------------------
# Create new user
# -------------------------
def create_user(*, user_data: dict, session: Session) -> User:
    """
    Create a new user in the database.
    Truncates password for bcrypt and stores the hash.
    """
    # Hash password (automatically truncates to 72 bytes)
    hashed_password = get_password_hash(user_data["password"])
    user_data["password_hash"] = hashed_password
    user_data.pop("password", None)  # Remove plain password

    # Create user model and save
    db_user = User(**user_data)
    session.add(db_user)
    session.commit()
    session.refresh(db_user)
    return db_user

# -------------------------
# Authenticate user
# -------------------------
def authenticate_user(*, email: str, password: str, session: Session) -> Optional[User]:
    """
    Authenticate a user with email and password.
    Returns the User object if valid, else None.
    """
    statement = select(User).where(User.email == email)
    user = session.exec(statement).first()
    if not user:
        return None
    if not verify_password(password, user.password_hash):
        return None
    return user