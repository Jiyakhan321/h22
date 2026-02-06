from unittest.mock import patch, MagicMock
from fastapi.security import HTTPAuthorizationCredentials
from src.middleware.auth_middleware import get_current_user_from_token
from src.services.auth_service import AuthService

def test_get_current_user_from_token_valid():
    """Test that get_current_user_from_token works with valid token"""
    # Mock a valid token payload
    mock_payload = {
        "sub": "test@example.com",
        "user_id": "123e4567-e89b-12d3-a456-426614174000"
    }

    with patch.object(AuthService, 'verify_token', return_value=mock_payload):
        # Create mock credentials
        mock_credentials = HTTPAuthorizationCredentials(scheme="Bearer", credentials="fake_token")

        result = get_current_user_from_token(mock_credentials)

        assert result == {
            "user_id": "123e4567-e89b-12d3-a456-426614174000",
            "email": "test@example.com"
        }

def test_get_current_user_from_token_invalid():
    """Test that get_current_user_from_token raises exception with invalid token"""
    from fastapi import HTTPException

    with patch.object(AuthService, 'verify_token', return_value=None):
        mock_credentials = HTTPAuthorizationCredentials(scheme="Bearer", credentials="invalid_token")

        try:
            get_current_user_from_token(mock_credentials)
            assert False, "Expected HTTPException was not raised"
        except HTTPException as e:
            assert e.status_code == 401

def test_get_current_user_from_token_missing_claims():
    """Test that get_current_user_from_token raises exception with missing claims"""
    from fastapi import HTTPException

    # Mock a token payload with missing user_id
    mock_payload = {
        "sub": "test@example.com"
        # Missing user_id
    }

    with patch.object(AuthService, 'verify_token', return_value=mock_payload):
        mock_credentials = HTTPAuthorizationCredentials(scheme="Bearer", credentials="fake_token")

        try:
            get_current_user_from_token(mock_credentials)
            assert False, "Expected HTTPException was not raised"
        except HTTPException as e:
            assert e.status_code == 401