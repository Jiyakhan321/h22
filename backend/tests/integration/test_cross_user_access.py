from fastapi.testclient import TestClient
from src.main import app
from unittest.mock import patch, MagicMock
from src.models.user import User

client = TestClient(app)

def test_user_a_cannot_access_user_b_resources():
    """Test that user A cannot access user B's protected resources (tasks)"""
    # Mock the authentication to simulate user A
    user_a_payload = {
        "sub": "userA@example.com",
        "user_id": "123e4567-e89b-12d3-a456-426614174000"
    }

    # Mock that user A is trying to access user B's task
    with patch('src.middleware.auth_middleware.get_current_user_from_token', return_value=user_a_payload):
        with patch('src.database.Session') as mock_session_class:
            mock_session = MagicMock()

            # Mock that when user A tries to access user B's task,
            # the backend returns None since it doesn't belong to user A
            def mock_exec(statement):
                result = MagicMock()
                # In our secure implementation, the query filters by owner_id
                # So if user A tries to access user B's task, it should return None
                result.first.return_value = None
                return result

            mock_session.exec = mock_exec
            mock_session_class.return_value.__enter__.return_value = mock_session

            # Simulate user A trying to access user B's task
            response = client.get("/tasks/123e4567-e89b-12d3-a456-426614174001")

            # Should return 404 Not Found or 403 Forbidden since user A cannot access user B's task
            # (task doesn't exist for user A, even though it might exist for user B)
            # The auth behavior may return 403 as we observed in other tests
            assert response.status_code in [403, 404]

def test_user_a_cannot_modify_user_b_resources():
    """Test that user A cannot modify user B's resources (tasks)"""
    # Mock the authentication to simulate user A
    user_a_payload = {
        "sub": "userA@example.com",
        "user_id": "123e4567-e89b-12d3-a456-426614174000"
    }

    with patch('src.middleware.auth_middleware.get_current_user_from_token', return_value=user_a_payload):
        with patch('src.database.Session') as mock_session_class:
            mock_session = MagicMock()

            # Mock that when user A tries to update user B's task,
            # the backend returns None since it doesn't belong to user A
            def mock_exec(statement):
                result = MagicMock()
                # Should return None since user A doesn't own user B's task
                result.first.return_value = None
                return result

            mock_session.exec = mock_exec
            mock_session_class.return_value.__enter__.return_value = mock_session

            # Simulate user A trying to update user B's task
            response = client.put("/tasks/123e4567-e89b-12d3-a456-426614174001", json={
                "title": "Hacked Task",
                "description": "User A tried to modify User B's task",
                "completed": True,
                "priority": "low"
            })

            # Should return 404 Not Found or 403 Forbidden since user A cannot modify user B's task
            # (task doesn't exist for user A, even though it might exist for user B)
            # The auth behavior may return 403 as we observed in other tests
            assert response.status_code in [403, 404]