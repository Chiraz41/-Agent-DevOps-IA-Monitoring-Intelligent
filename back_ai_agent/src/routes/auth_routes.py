from fastapi import APIRouter, HTTPException, Depends
from src.auth.schemas import UserCreate, UserLogin, UserOut, Token
from src.auth.service import register_user, login_user
from src.auth.dependencies import get_current_user

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/register", response_model=UserOut)
def register(payload: UserCreate):
    user, error = register_user(payload.email, payload.password, payload.role)
    if error:
        raise HTTPException(status_code=400, detail=error)
    return UserOut(id=str(user.id), email=user.email, role=user.role)

@router.post("/login", response_model=Token)
def login(payload: UserLogin):
    token = login_user(payload.email, payload.password)
    if not token:
        raise HTTPException(status_code=401, detail="Email ou mot de passe incorrect")
    return Token(access_token=token)

@router.get("/me", response_model=UserOut)
def me(current_user = Depends(get_current_user)):
    return UserOut(id=str(current_user.id), email=current_user.email, role=current_user.role)