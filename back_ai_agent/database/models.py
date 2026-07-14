from sqlalchemy import Column, Integer, Float, String
from database.database import Base


class Incident(Base):

    __tablename__ = "incidents"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    timestamp = Column(
        String
    )

    cpu = Column(
        Float
    )

    ram = Column(
        Float
    )

    disk = Column(
        Float
    )

    network = Column(
        Float
    )

    status = Column(
        String
    )

    score = Column(
        Float
    )

    explanation = Column(
        String
    )