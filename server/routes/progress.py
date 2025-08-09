from fastapi import FastAPI,APIRouter,HTTPException,status,Depends
from typing import List
from datetime import datetime,timezone
from database.database import get_database
from auth import verify_token
from schemas.progress import CompleteLesson, Module
# from models.progress import 
from bson import ObjectId


router=APIRouter(prefix="/api",tags=['progress'])

# Sample modules data
SAMPLE_MODULES = [
    {
        "id": "mod_1",
        "title": "Home Buying Basics",
        "lessons": ["What is a Mortgage?", "Down Payments 101", "Credit Scores"],
        "total_coins": 75,
        "difficulty": "Beginner",
        "description": "Learn the fundamentals of purchasing your first home"
    },
    {
        "id": "mod_2",
        "title": "Home Inspections",
        "lessons": ["Types of Inspections", "Red Flags", "Negotiating Repairs"],
        "total_coins": 100,
        "difficulty": "Intermediate",
        "description": "Understanding the home inspection process"
    },
    {
        "id": "mod_3",
        "title": "Financing Your Home",
        "lessons": ["Loan Types", "Interest Rates", "Pre-approval Process"],
        "total_coins": 125,
        "difficulty": "Intermediate",
        "description": "Navigate the complex world of home financing"
    },
    {
        "id": "mod_4",
        "title": "Closing Process",
        "lessons": ["Final Walkthrough", "Closing Documents", "Moving Day"],
        "total_coins": 150,
        "difficulty": "Advanced",
        "description": "Complete your home purchase successfully"
    }
]



@router.get("/modules")
async def get_modules():
    db = get_database()
    modules = await db.modules.find().to_list(length=None)
    
    # Convert ObjectId to string
    for module in modules:
        module["_id"] = str(module["_id"])
    
    return modules


@router.post("/create_modules")
async def create_modules(module_data:Module):
    # /create a module here
    db=get_database()
    
    # checking if module exists based on the just name
    existing_module=await db.modules.find_one({"title":module_data.title})
    if existing_module:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Module Title already exists"
        )
    
    # now create new module 
    new_module={
        "title":module_data.title,
        "lessons":module_data.lessons,
        "total_coins":module_data.total_coins,
        "description":module_data.description
    }
    
    result=await db.modules.insert_one(new_module)
    if result.inserted_id:
        return {"id": str(result.inserted_id)}
    else:
        raise HTTPException(status_code=500, detail="Failed to create module")
    
    

# get progress data for the user
@router.get("/progress/{user_id}")
async def get_progress_user(user_id:str,user_email:str=Depends(verify_token)):
    print(user_id,"user_id")
    db=get_database()
    # verify if user exists or has permissions
    user_doc=await db.users.find_one({"email":user_email.lower()})
    if not user_doc or str(user_doc["_id"])!=user_id:
        # means not valid user
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied"
        )
    
    # get progress data
    progress_data=await db.progress.find({"user_id":user_id}).to_list(length=None)
    
    progress_list = []
    for data in progress_data:
        progress_list.append({
        "user_id": data.get("user_id"),
        "module_id": data.get("module_id"),
        "lessons_completed": data.get("lessons_completed", []),
        "completion_percentage": data.get("completion_percentage", 0.0),
        "last_accessed": data.get("last_accessed") or data.get("created_at")
    })

    
    return progress_list


@router.post("/progress/complete-lesson")
async def complete_lesson(lesson_data:CompleteLesson,user_email:str=Depends(verify_token)):
    
    db=get_database()
    print("complete-lesson post request",user_email, lesson_data)
    # Get user data
    user_doc = await db.users.find_one({"email": user_email.lower()})
    if not user_doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    user_id = str(user_doc["_id"])
    
    # find the module 
    module=None
    
    for m in SAMPLE_MODULES:
        if m["id"]==lesson_data.module_id:
            module=m
            break
    
    if not module:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Module not found"
        )
    # check if lesson exists in module
    if lesson_data.lesson not in module["lessons"]:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="lesson not found"
        )

    progress_data=await db.progress.find_one({
        "user_id":user_id,
        "module_id":lesson_data.module_id
    })
    if not progress_data:
        # create it 
        progress_data={
            "user_id":user_id,
            "module_id":lesson_data.module_id,
            "lessons_completed":[],
            "completion_percentage":0.0
        }
        
        # insert it into the database
        result=await db.progress.insert_one(progress_data)
        print(result)
        progress_data=await db.progress.find_one({"_id":result.inserted_id})
        
    # add lesson to completed if not 
    lesson_completed=progress_data.get("lesson_completed",[])

    if lesson_data.lesson not in lesson_completed:
        lesson_completed.append(lesson_data.lesson)
        
        #calc the percentage
        total=len(module["lessons"])
        percentage=(len(lesson_completed)/total)*100
        
        coins_per_lesson=module["total_coins"]//total
        
        
        await db.progress.update_one(
            {"user_id":user_id,"module_id":lesson_data.module_id},
            {
                "$set":{
                    "lesson_completed":lesson_completed,
                    "completion_percentage":round(percentage,1),
                    "last_accessed":datetime.now(timezone.utc)
                }
            }
        )
        
        
        # update coins to user database
        await db.users.update_one(
            {"_id":ObjectId(user_id)},
            {"$inc":{
                "coins_earned":coins_per_lesson
            }}
        )
        
