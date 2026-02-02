import pytest
from sqlmodel import Session, SQLModel, create_engine
from fastapi.testclient import TestClient

from backend.src.main import app
from backend.src.db import get_session
from backend.src.models.user import User # Assuming User model will be created later
from backend.src.models.task import Task # Assuming Task model will be created later
from backend.src.config import settings

# Override the DATABASE_URL for testing
TEST_DATABASE_URL = "sqlite:///./test.db"

@pytest.fixture(name="session")
def session_fixture():
    engine = create_engine(TEST_DATABASE_URL)
    SQLModel.metadata.create_all(engine)
    with Session(engine) as session:
        yield session
    SQLModel.metadata.drop_all(engine) # Clean up after tests

@pytest.fixture(name="client")
def client_fixture(session: Session):
    def get_session_override():
        yield session
    app.dependency_overrides[get_session] = get_session_override
    client = TestClient(app)
    yield client
    app.dependency_overrides.clear()
