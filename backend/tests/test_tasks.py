from fastapi.testclient import TestClient
from src.main import app

client = TestClient(app)

def test_tasks_endpoints_require_authentication():
    # Test that tasks endpoints require authentication
    response = client.get("/tasks/")
    assert response.status_code in [401, 403]  # Unauthorized without token

    response = client.post("/tasks/", json={"title": "Test task"})
    assert response.status_code in [401, 403]  # Unauthorized without token

    response = client.put("/tasks/123", json={"title": "Updated task"})
    assert response.status_code in [401, 403]  # Unauthorized without token

    response = client.delete("/tasks/123")
    assert response.status_code in [401, 403]  # Unauthorized without token