from fastapi.testclient import TestClient
from sqlmodel import Session
from backend.src.services.auth_service import create_user
from backend.src.services.task_service import create_task
import pytest

# Helper to get auth token
def get_auth_token(client: TestClient, session: Session, email: str, password: str):
    create_user_data = {"email": email, "name": "Test User", "password": password}
    create_user(user_data=create_user_data, session=session)
    login_response = client.post(
        "/api/login",
        data={"username": email, "password": password}
    )
    return login_response.json()["access_token"]

# Helper to get user ID from token
def get_user_id_from_token(client: TestClient, token: str) -> str:
    user_response = client.get("/api/me", headers={"Authorization": f"Bearer {token}"})
    return user_response.json()["id"]

@pytest.fixture
def user_a_client_token_id(client: TestClient, session: Session):
    token_a = get_auth_token(client, session, "user_a@example.com", "securepassword")
    id_a = get_user_id_from_token(client, token_a)
    return client, token_a, id_a

@pytest.fixture
def user_b_client_token_id(client: TestClient, session: Session):
    token_b = get_auth_token(client, session, "user_b@example.com", "securepassword")
    id_b = get_user_id_from_token(client, token_b)
    return client, token_b, id_b

def test_user_cannot_view_other_users_tasks(user_a_client_token_id, user_b_client_token_id, session: Session):
    client, token_a, id_a = user_a_client_token_id
    _, token_b, id_b = user_b_client_token_id

    # User A creates a task
    task_a_data = {"title": "User A's Task", "description": "This belongs to A"}
    create_task(task_data=task_a_data, user_id=id_a, session=session)

    # User B tries to view User A's tasks
    response = client.get(
        f"/api/{id_a}/tasks", # User B tries to access User A's tasks path
        headers={"Authorization": f"Bearer {token_b}"} # But with User B's token
    )
    assert response.status_code == 403
    assert response.json()["detail"] == "Not authorized to view tasks for this user."

def test_user_cannot_modify_other_users_tasks(user_a_client_token_id, user_b_client_token_id, session: Session):
    client, token_a, id_a = user_a_client_token_id
    _, token_b, id_b = user_b_client_token_id

    # User A creates a task
    task_a_data = {"title": "User A's Task to modify", "description": "This belongs to A"}
    task_a = create_task(task_data=task_a_data, user_id=id_a, session=session)

    # User B tries to update User A's task
    response = client.put(
        f"/api/{id_a}/tasks/{task_a.id}", # User B tries to access User A's task path
        json={"title": "User B trying to update"},
        headers={"Authorization": f"Bearer {token_b}"} # But with User B's token
    )
    assert response.status_code == 403
    assert response.json()["detail"] == "Not authorized to update tasks for this user."

    # User B tries to delete User A's task
    response = client.delete(
        f"/api/{id_a}/tasks/{task_a.id}",
        headers={"Authorization": f"Bearer {token_b}"}
    )
    assert response.status_code == 403
    assert response.json()["detail"] == "Not authorized to delete tasks for this user."

    # User B tries to toggle completion of User A's task
    response = client.patch(
        f"/api/{id_a}/tasks/{task_a.id}/complete",
        json={"completed": True},
        headers={"Authorization": f"Bearer {token_b}"}
    )
    assert response.status_code == 403
    assert response.json()["detail"] == "Not authorized to modify tasks for this user."
