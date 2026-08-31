from sqlmodel import create_engine, Session, SQLModel
from config import DATABASE_URL

engine = create_engine(DATABASE_URL, echo=False)

def get_session():
    with Session(engine) as session:
        yield session

def create_db_and_tables():
    """Crée les tables directement (utile en dev, sans passer par Alembic)."""
    SQLModel.metadata.create_all(engine)