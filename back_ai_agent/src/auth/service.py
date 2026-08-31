from sqlmodel import Session, select
from src.db import engine
from src.models import User
from src.auth.security import hash_password, verify_password, create_access_token

def register_user(email: str, password: str, role: str = "devops"):
    with Session(engine) as session:
        existing = session.exec(select(User).where(User.email == email)).first()
        if existing:
            return None, "Email déjà utilisé"

        user = User(email=email, password_hash=hash_password(password), role=role)
        session.add(user)
        session.commit()
        session.refresh(user)
        return user, None

def authenticate_user(email: str, password: str):
    with Session(engine) as session:
        user = session.exec(select(User).where(User.email == email)).first()
        if not user or not verify_password(password, user.password_hash):
            return None
        return user

def login_user(email: str, password: str):
    user = authenticate_user(email, password)
    if not user:
        return None
    token = create_access_token(data={"sub": str(user.id), "role": user.role})
    return token