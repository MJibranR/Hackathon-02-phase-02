from fastapi.testclient import TestClient
from sqlmodel import Session
from backend.src.models.user import User

# This client fixture is defined in conftest.py
# @pytest.fixture(name="client")
# def client_fixture(): ...

def test_create_user(client: TestClient):
    response = client.post(
        "/api/signup",
        json={"email": "test@example.com", "name": "Test User", "password": "securepassword"}
    )
    assert response.status_code == 201
    assert response.json()["email"] == "test@example.com"
    assert response.json()["name"] == "Test User"
    assert "id" in response.json()

def test_create_user_email_exists(client: TestClient):
    # First create a user
    client.post(
        "/api/signup",
        json={"email": "duplicate@example.com", "name": "Duplicate User", "password": "securepassword"}
    )
    # Try to create with same email
    response = client.post(
        "/api/signup",
        json={"email": "duplicate@example.com", "name": "Another User", "password": "anotherpassword"}
    )
    assert response.status_code == 400
    assert response.json()["detail"] == "Email already registered"

def test_login_for_access_token(client: TestClient, session: Session):
    # Create a user first
    create_user_data = {"email": "login@example.com", "name": "Login User", "password": "loginpassword"}
    create_user(user_data=create_user_data, session=session)

    response = client.post(
        "/api/login",
        data={"username": "login@example.com", "password": "loginpassword"}
    )
    assert response.status_code == 200
    assert "access_token" in response.json()
    assert response.json()["token_type"] == "bearer"

def test_login_for_access_token_wrong_password(client: TestClient, session: Session):
    # Create a user first
    create_user_data = {"email": "wrongpass@example.com", "name": "Wrong Pass User", "password": "correctpassword"}
    create_user(user_data=create_user_data, session=session)

    response = client.post(
        "/api/login",
        data={"username": "wrongpass@example.com", "password": "wrongpassword"}
    )
    assert response.status_code == 401
    assert response.json()["detail"] == "Incorrect username or password"

def test_login_for_access_token_nonexistent_user(client: TestClient):
    response = client.post(
        "/api/login",
        data={"username": "nonexistent@example.com", "password": "anypassword"}
    )
    assert response.status_code == 401
    assert response.json()["detail"] == "Incorrect username or password"

def test_read_users_me(client: TestClient, session: Session):
    # Create a user and log in to get a token
    create_user_data = {"email": "me@example.com", "name": "Me User", "password": "mypassword"}
    created_user = create_user(user_data=create_user_data, session=session)

    login_response = client.post(
        "/api/login",
        data={"username": "me@example.com", "password": "mypassword"}
    )
    token = login_response.json()["access_token"]

    response = client.get(
        "/api/me",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 200
    assert response.json()["email"] == created_user.email
    assert response.json()["name"] == created_user.name
    assert response.json()["id"] == created_user.id

def test_read_users_me_unauthorized(client: TestClient):
    response = client.get("/api/me")
    assert response.status_code == 401
    assert response.json()["detail"] == "Could not validate credentials"
