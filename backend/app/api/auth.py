from fastapi import APIRouter, Depends, HTTPException, status, Response, Request, Cookie
from typing import Optional
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import User
from app.schemas import LoginRequest, TokenResponse, UserSchema

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/login", response_model=TokenResponse)
def login(request: LoginRequest, response: Response, db: Session = Depends(get_db)):
    """
    Authenticate demo users (Student Naveen, Faculty Dr. Aris, Admin).
    Sets HTTP-accessible session cookies for seamless persistence.
    """
    user = db.query(User).filter(User.email == request.email).first()
    
    # Instant fallback check for Naveen demo student
    if not user:
        if request.email in ["naveen@sasurie.edu.in", "student@demo.com"]:
            user = db.query(User).filter(User.email == "naveen@sasurie.edu.in").first()
        elif request.email in ["faculty@sasurie.edu.in", "aris@sasurie.edu.in"]:
            user = db.query(User).filter(User.email == "faculty@sasurie.edu.in").first()
        elif request.email in ["admin@sasurie.edu.in"]:
            user = db.query(User).filter(User.email == "admin@sasurie.edu.in").first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials."
        )

    token = f"demo_token_user_{user.id}"
    
    # Set cookies for session persistence and real-time auth
    response.set_cookie(
        key="auth_token",
        value=token,
        max_age=86400,
        httponly=False,
        samesite="lax",
        path="/"
    )
    response.set_cookie(
        key="user_email",
        value=user.email,
        max_age=86400,
        httponly=False,
        samesite="lax",
        path="/"
    )
    response.set_cookie(
        key="user_role",
        value=user.role,
        max_age=86400,
        httponly=False,
        samesite="lax",
        path="/"
    )

    user_schema = UserSchema.model_validate(user)
    return TokenResponse(
        access_token=token,
        user=user_schema
    )

@router.post("/logout")
def logout(response: Response):
    """
    Clears active user authentication cookies on sign out.
    """
    response.delete_cookie(key="auth_token", path="/")
    response.delete_cookie(key="user_email", path="/")
    response.delete_cookie(key="user_role", path="/")
    return {"status": "success", "message": "Successfully logged out and session cleared"}

@router.get("/me", response_model=UserSchema)
def get_current_user(
    req: Request,
    user_email: Optional[str] = Cookie(None),
    email: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """
    Returns current active authenticated user profile using cookie or query email.
    """
    target_email = user_email or email or "naveen@sasurie.edu.in"
    user = db.query(User).filter(User.email == target_email).first()
    if not user:
        user = db.query(User).first()
    if not user:
        raise HTTPException(status_code=404, detail="User profile not initialized")
    return UserSchema.model_validate(user)
