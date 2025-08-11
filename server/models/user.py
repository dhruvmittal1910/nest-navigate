from pydantic import BaseModel,Field,EmailStr
from typing import Optional
from datetime import datetime,timezone
from bson import ObjectId


# while creating a user in db
class UserInDb(BaseModel):
    id:Optional[str]=Field(default_factory=str)
    email:EmailStr
    username:str
    password:str
    coins_earned:int=0
    created_at:datetime=Field(default_factory=datetime.now(timezone.utc))
    
    class Config:
        populate_by_name=True
        arbitrary_types_allowed=True
    