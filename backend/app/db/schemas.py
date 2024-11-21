from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from enum import Enum


# schema base user
class UserBase(BaseModel):
    id: int
    username: str
    email: str

    class Config:
        orm_mode = True

class UserCreate(BaseModel):
    username: str
    email: str

class UserUpdate(BaseModel):
    username: Optional[str] = None
    email: Optional[str] = None


# tasks 
class Priority(str, Enum):
    baixa = "baixa"
    media = "media"
    alta = "alta"

class Status(str, Enum):
    a_fazer = "a_fazer"
    em_andamento = "em_andamento"
    concluido = "concluido"

# base schema task
class TaskBase(BaseModel):
    id: int
    user_id: int
    description: str
    sector_name: str
    priority: Priority
    creation_time_stamp: datetime
    status: Status

    class Config:
        orm_mode = True

# Schema para criação de Task
class TaskCreate(BaseModel):
    description: str
    sector_name: str
    priority: Priority
    status: Optional[Status] = Status.a_fazer  
    user_id: int  

# Schema para atualização de Task
class TaskUpdate(BaseModel):
    description: Optional[str] = None
    sector_name: Optional[str] = None
    priority: Optional[Priority] = None
    status: Optional[Status] = None