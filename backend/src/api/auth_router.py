from datetime import datetime, timedelta, timezone
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlmodel import Session, select
from src.database import get_session
from src.models.user import User, UserCreate, UserLogin, UserResponse
from src.services.auth_service import AuthService
from src.middleware.auth_middleware import get_current_user_from_token

auth_router = APIRouter()
security = HTTPBearer()

@auth_router.post("/register")
def register(user_create: UserCreate, db_session: Session = Depends(get_session)):
    """Register a new user and return JWT token"""
    # Check if user already exists
    existing_user = db_session.exec(
        select(User).where(User.email == user_create.email)
    ).first()

    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )

    # Create the user
    db_user = AuthService.create_user(user_create, db_session)

    # Create access token for the newly registered user
    access_token_expires = timedelta(minutes=30)
    access_token = AuthService.create_access_token(
        data={"sub": db_user.email, "user_id": str(db_user.id)},
        expires_delta=access_token_expires
    )

    # Return both access token and user data
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": UserResponse(
            id=db_user.id,
            email=db_user.email,
            first_name=db_user.first_name,
            last_name=db_user.last_name,
            created_at=db_user.created_at,
            updated_at=db_user.updated_at,
            is_active=db_user.is_active
        )
    }

@auth_router.post("/login")
def login(user_login: UserLogin, db_session: Session = Depends(get_session)):
    """Authenticate user and return JWT token"""
    user = AuthService.authenticate_user(
        user_login.email,
        user_login.password,
        db_session
    )

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Create access token
    access_token_expires = timedelta(minutes=30)
    access_token = AuthService.create_access_token(
        data={"sub": user.email, "user_id": str(user.id)},
        expires_delta=access_token_expires
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": UserResponse(
            id=user.id,
            email=user.email,
            first_name=user.first_name,
            last_name=user.last_name,
            created_at=user.created_at,
            updated_at=user.updated_at,
            is_active=user.is_active
        )
    }

@auth_router.post("/logout")
def logout(current_user: dict = Depends(get_current_user_from_token)):
    """Logout user (client-side token removal)"""
    # In a stateless JWT system, logout is typically handled on the client side
    # This endpoint can be used to invalidate tokens in a more advanced system
    return {"message": "Logged out successfully"}

@auth_router.get("/me", response_model=UserResponse)
def get_current_user(current_user: dict = Depends(get_current_user_from_token),
                    db_session: Session = Depends(get_session)):
    """Get current user information"""
    user_id = current_user["user_id"]

    # Retrieve user from database
    statement = select(User).where(User.id == user_id)
    user = db_session.exec(statement).first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    return UserResponse(
        id=user.id,
        email=user.email,
        first_name=user.first_name,
        last_name=user.last_name,
        created_at=user.created_at,
        updated_at=user.updated_at,
        is_active=user.is_active
    )

@auth_router.post("/verify")
def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Verify if the provided JWT token is valid"""
    token = credentials.credentials

    payload = AuthService.verify_token(token)
    if payload is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"},
        )

    user_id = payload.get("user_id")
    email = payload.get("sub")

    if user_id is None or email is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token claims",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Calculate time until expiration
    exp_time = payload.get("exp")
    current_time = datetime.now(timezone.utc).timestamp()
    time_until_expiry = max(0, exp_time - current_time) if exp_time else 0

    return {
        "valid": True,
        "user": {
            "id": user_id,
            "email": email
        },
        "expiresIn": int(time_until_expiry)
    }

@auth_router.post("/refresh")
def refresh_token():  # In a real implementation, this would use refresh tokens
    """Refresh JWT access token (simplified implementation)"""
    # This is a simplified version - a real implementation would require refresh tokens
    # For now, we'll return an error indicating this endpoint needs to be implemented
    # with proper refresh token mechanism
    raise HTTPException(
        status_code=status.HTTP_501_NOT_IMPLEMENTED,
        detail="Refresh token mechanism not implemented in this version",
    )