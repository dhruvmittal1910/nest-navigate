# creating schemas for the user
from datetime import datetime
from pydantic import BaseModel

class UserCreate(BaseModel):
    username:str
    password:str
    email:str

class UserLogin(BaseModel):
    email:str
    password:str

class User(BaseModel):
    id:str
    username:str
    email:str
    coins_earned:int=0
    created_at:datetime
    class Config:
        from_attributes=True


class UserProfile(BaseModel):
    id:str
    username:str
    email:str
    coins_earned:int
    total_modules:int
    completed_modules:int
    overall_progress: float
    created_at:datetime