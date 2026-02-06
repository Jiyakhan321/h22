from fastapi.testclient import TestClient
from src.main import app
from unittest.mock import patch, MagicMock
from src.models.user import User

client = TestClient(app)

def test_register_endpoint_exists():
    """Test that POST /auth/register endpoint exists"""
    # Mock the database session to avoid actual database connection
    with patch('src.database.Session') as mock_session_class:
        mock_session = MagicMock()
        mock_session.exec.return_value.first.return_value = None  # No existing user
        mock_session_class.return_value.__enter__.return_value = mock_session

        # Mock the user creation
        mock_user = User(
            id="123e4567-e89b-12d3-a456-426614174000",
            email="test@example.com",
            first_name="Test",
            last_name="User",
            hashed_password="hashed_password",
            created_at="2023-01-01T00:00:00",
            updated_at="2023-01-01T00:00:00",
            is_active=True
        )

        with patch('src.services.auth_service.AuthService.create_user', return_value=mock_user):
            response = client.post("/auth/register", json={
                "email": "test@example.com",
                "password": "password123",
                "firstName": "Test",
                "lastName": "User"
            })

            # Should return 200 OK or 422 Unprocessable Entity (validation error) but not 404
            assert response.status_code in [200, 422]

def test_login_endpoint_exists():
    """Test that POST /auth/login endpoint exists"""
    # Mock the database session to avoid actual database connection
    with patch('src.database.Session') as mock_session_class:
        mock_session = MagicMock()
        mock_user = User(
            id="123e4567-e89b-12d3-a456-426614174000",
            email="test@example.com",
            first_name="Test",
            last_name="User",
            hashed_password="$2b$12$dummy_hash_for_testing",
            created_at="2023-01-01T00:00:00",
            updated_at="2023-01-01T00:00:00",
            is_active=True
        )
        mock_session.exec.return_value.first.return_value = mock_user

        mock_session_class.return_value.__enter__.return_value = mock_session

        with patch('src.services.auth_service.AuthService.authenticate_user', return_value=mock_user):
            with patch('src.services.auth_service.AuthService.create_access_token',
                      return_value="mocked_jwt_token"):
                response = client.post("/auth/login", json={
                    "email": "test@example.com",
                    "password": "password123"
                })

                # Should return 200 OK or 422 Unprocessable Entity (validation error) but not 404
                assert response.status_code in [200, 422]

def test_logout_endpoint_exists():
    """Test that POST /auth/logout endpoint exists"""
    # This endpoint requires authentication, so we'll test that it returns 403 without auth
    response = client.post("/auth/logout")
    # Should return 403 Forbidden without authentication
    assert response.status_code == 403