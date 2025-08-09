from datetime import datetime
from pydantic import BaseModel, Field
from typing import List,Optional

class Module(BaseModel):
    id:Optional[str] = Field(None, alias="_id")
    title:str
    lessons:List[str]
    total_coins:int
    description:str


class Progress(BaseModel):
    user_id:str
    module_id:str
    lessons_completed:List[str]
    completion_percentage:float
    last_accessed:datetime


class CompleteLesson(BaseModel):
    module_id:str
    lesson:str
    
class Activity(BaseModel):
    id:str
    activity_type:str
    module_id:str
    lesson_name:Optional[str]=None
    coins_earned:int
    timestamp:datetime