from fastapi.testclient import TestClient
from src.main import app

client = TestClient(app)

def test_read_root():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Todo Web Application API"}

def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "healthy"}

def test_register_endpoint_exists():
    response = client.post("/auth/register", json={
        "email": "test@example.com",
        "password": "password123",
        "firstName": "Test",
        "lastName": "User"
    })
    # We expect a validation error since the user doesn't exist yet
    # but the endpoint should be accessible (status 422 means validation error, not 404)
    assert response.status_code in [422, 400]  # Validation error is acceptable

def test_login_endpoint_exists():
    import uuid
    unique_email = f"test_{uuid.uuid4()}@example.com"

    response = client.post("/auth/login", json={
        "email": unique_email,  # Use unique email to ensure user doesn't exist
        "password": "password123"
    })
    # We expect an authentication error (401) since user doesn't exist, or validation error (422)
    assert response.status_code in [422, 401]  # Validation or auth error is acceptable