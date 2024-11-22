from sqlalchemy import Column, Integer, String, Enum, DateTime, func
from db.base import Base
from enum import Enum as PyEnum


class Priority(PyEnum):
    baixa = "baixa"
    media = "media"
    alta = "alta"

class Status(PyEnum):
    a_fazer = "a_fazer"
    fazendo = "fazendo"
    pronto = "pronto"


class User(Base):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(30), index=True, nullable=False)
    email = Column(String(50), index=True, unique=True,nullable=False)

class Tasks(Base):
    __tablename__ = 'tasks'
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, index=True,nullable=False)
    description = Column(String(255), index=True,nullable=False)
    sector_name = Column(String(30), index=True,nullable=False)
    priority = Column(Enum(Priority), nullable=False)
    creation_time_stamp = Column(DateTime, default=func.now(), nullable=False)
    status = Column(Enum(Status), nullable=False, default=Status.a_fazer)
