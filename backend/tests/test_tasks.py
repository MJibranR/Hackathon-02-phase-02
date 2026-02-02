from fastapi.testclient import TestClient
from sqlmodel import Session
from backend.src.models.user import User
from backend.src.models.task import Task
from backend.src.services.auth_service import create_user
import pytest

def get_auth_token(client: TestClient, session: Session, email: str = "taskuser@example.com", password: str = "securepassword"):
    create_user_data = {"email": email, "name": "Task User", "password": password}
    create_user(user_data=create_user_data, session=session)
    login_response = client.post(
        "/api/login",
        data={"username": email, "password": password}
    )
    return login_response.json()["access_token"]

def get_user_id_from_token(client: TestClient, token: str) -> str:
    user_response = client.get("/api/me", headers={"Authorization": f"Bearer {token}"})
    return user_response.json()["id"]

@pytest.fixture
def authenticated_client_and_user_id(client: TestClient, session: Session):
    token = get_auth_token(client, session)
    user_id = get_user_id_from_token(client, token)
    return client, user_id, token

def test_create_task(authenticated_client_and_user_id):
    client, user_id, token = authenticated_client_and_user_id

    response = client.post(
        f"/api/{user_id}/tasks",
        json={"title": "My first task", "description": "This is a description."},
        headers={"Authorization": f"Bearer {token}"}
    )
    
    assert response.status_code == 201
    assert response.json()["title"] == "My first task"
    assert response.json()["description"] == "This is a description."
    assert not response.json()["completed"]
    assert response.json()["user_id"] == user_id
    assert "id" in response.json()

def test_create_task_unauthorized(client: TestClient):
    response = client.post(
        "/api/some_user_id/tasks",
        json={"title": "Unauthorized task", "description": "Should fail"}
    )
    assert response.status_code == 401
    assert response.json()["detail"] == "Could not validate credentials"

def test_read_all_tasks(authenticated_client_and_user_id):
    client, user_id, token = authenticated_client_and_user_id

    # Create a few tasks
    client.post(f"/api/{user_id}/tasks", json={"title": "Task 1"}, headers={"Authorization": f"Bearer {token}"})
    client.post(f"/api/{user_id}/tasks", json={"title": "Task 2"}, headers={"Authorization": f"Bearer {token}"})

    response = client.get(
        f"/api/{user_id}/tasks",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 200
    tasks = response.json()
    assert len(tasks) == 2
    assert tasks[0]["title"] == "Task 2" # Newest first
    assert tasks[1]["title"] == "Task 1"

def test_read_single_task(authenticated_client_and_user_id):
    client, user_id, token = authenticated_client_and_user_id

    create_response = client.post(f"/api/{user_id}/tasks", json={"title": "Single Task"}, headers={"Authorization": f"Bearer {token}"})
    task_id = create_response.json()["id"]

    response = client.get(
        f"/api/{user_id}/tasks/{task_id}",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 200
    assert response.json()["title"] == "Single Task"
    assert response.json()["id"] == task_id

def test_read_single_task_not_found(authenticated_client_and_user_id):
    client, user_id, token = authenticated_client_and_user_id

    response = client.get(
        f"/api/{user_id}/tasks/9999", # Non-existent ID
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 404
    assert response.json()["detail"] == "Task not found"

def test_update_task(authenticated_client_and_user_id):
    client, user_id, token = authenticated_client_and_user_id

    create_response = client.post(f"/api/{user_id}/tasks", json={"title": "Old Title", "description": "Old Desc"}, headers={"Authorization": f"Bearer {token}"})
    task_id = create_response.json()["id"]

    update_response = client.put(
        f"/api/{user_id}/tasks/{task_id}",
        json={"title": "New Title", "description": "New Description", "completed": True},
        headers={"Authorization": f"Bearer {token}"}
    )
    assert update_response.status_code == 200
    assert update_response.json()["title"] == "New Title"
    assert update_response.json()["description"] == "New Description"
    assert update_response.json()["completed"] is True

def test_delete_task(authenticated_client_and_user_id):
    client, user_id, token = authenticated_client_and_user_id

    create_response = client.post(f"/api/{user_id}/tasks", json={"title": "Task to Delete"}, headers={"Authorization": f"Bearer {token}"})
    task_id = create_response.json()["id"]

    delete_response = client.delete(
        f"/api/{user_id}/tasks/{task_id}",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert delete_response.status_code == 204 # No content

    # Verify task is deleted
    get_response = client.get(
        f"/api/{user_id}/tasks/{task_id}",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert get_response.status_code == 404

def test_toggle_task_completion(authenticated_client_and_user_id):
    client, user_id, token = authenticated_client_and_user_id

    create_response = client.post(f"/api/{user_id}/tasks", json={"title": "Toggle Task"}, headers={"Authorization": f"Bearer {token}"})
    task_id = create_response.json()["id"]
    assert create_response.json()["completed"] is False

    # Mark complete
    patch_response = client.patch(
        f"/api/{user_id}/tasks/{task_id}/complete",
        json={"completed": True},
        headers={"Authorization": f"Bearer {token}"}
    )
    assert patch_response.status_code == 200
    assert patch_response.json()["completed"] is True

    # Mark incomplete
    patch_response = client.patch(
        f"/api/{user_id}/tasks/{task_id}/complete",
        json={"completed": False},
        headers={"Authorization": f"Bearer {token}"}
    )
    assert patch_response.status_code == 200
    assert patch_response.json()["completed"] is False