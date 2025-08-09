from fastapi import FastAPI, HTTPException, APIRouter,status,Depends
# from auth import create_token
from schemas.user import UserCreate,UserLogin, User, UserProfile
from datetime import datetime,timedelta
from auth import get_hashed_password,access_token_expires,create_token,verify_password,verify_token
from models.user import UserInDb
from database.database import get_database

router=APIRouter(prefix='/api/users',tags=["users"])



# Sample modules data
SAMPLE_MODULES = [
    {
        "id": "mod_1",
        "title": "Home Buying Basics",
        "lessons": ["What is a Mortgage?", "Down Payments 101", "Credit Scores"],
        "total_coins": 75,
        "difficulty": "Beginner"
    },
    {
        "id": "mod_2",
        "title": "Home Inspections",
        "lessons": ["Types of Inspections", "Red Flags", "Negotiating Repairs"],
        "total_coins": 100,
        "difficulty": "Intermediate"
    },
    {
        "id": "mod_3",
        "title": "Financing Your Home",
        "lessons": ["Loan Types", "Interest Rates", "Pre-approval Process"],
        "total_coins": 125,
        "difficulty": "Intermediate"
    },
    {
        "id": "mod_4",
        "title": "Closing Process",
        "lessons": ["Final Walkthrough", "Closing Documents", "Moving Day"],
        "total_coins": 150,
        "difficulty": "Advanced"
    }
]


# register the user
@router.post("/register")
async def register_user(user_data:UserCreate):
    # db=get_database()
    db=get_database()
    
    # check if user already exists
    existing_user=await db.users.find_one({"email":user_data.email.lower()})
    print(existing_user,"existing_user")
    if existing_user:
        #means found the email
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    # means we did not find the user and need to create one
    
    hashed_password = get_hashed_password(user_data.password)

    user_doc=UserInDb(
        email=user_data.email,
        username=user_data.username,
        password=hashed_password
    )
    
    # insert in db
    result=await db.users.insert_one(user_doc.dict(by_alias=True))
    user_id=str(result.inserted_id)
    
    # now creating the access token for the user
    token_expires=timedelta(minutes=access_token_expires)
    token=create_token(
        data={"sub":user_data.email},expires_delta=token_expires
    )
    user_details=User(
        id=user_id,
        email=user_data.email,
        username=user_data.email,
        coins_earned=0,
        created_at=user_doc.created_at
    )
    
    return token,user_details

# login route
@router.post("/login")
async def login_user(login_data:UserLogin):
    # passing email and id in login_data
    db=get_database()
    # find user by email if exists
    user_doc=await db.users.find_one({"email":login_data.email.lower()})
    if user_doc is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="user does not exists"
        )
    # check if the password is correct
    check_password=verify_password(login_data.password,user_doc["password"])
    if check_password is False:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="wrong password"
        ) 
        
    # now creating the access token for the user
    token_expires=timedelta(minutes=access_token_expires)
    token=create_token(
        data={"sub":login_data.email},expires_delta=token_expires
    )
    print("logged in")
    user_details=User(
        id=str(user_doc["_id"]),
        email=user_doc["email"],
        password=user_doc["password"],
        username=user_doc["username"],
        coins_earned=user_doc.get("coins_earned",0),
        created_at=user_doc["created_at"]
    )
    
    return token,user_details

# get the profile information
@router.get("/profile")
async def get_profile_date(user_email:str = Depends(verify_token)):
    print("calling get profile route")
    db=get_database()
    
    # get user data
    user_doc=await db.users.find_one({"email":user_email.lower()})
    if not user_doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # get user data
    user_id=str(user_doc["_id"])
    progress_docs=await db.progress.find({"user_id":user_id}).to_list(length=None)
    
    # get total modules 
    module_data=await db.modules.find().to_list(length=None)
    
    # Calculate overall progress
    total_modules = len(module_data)
    completed_modules = sum(1 for p in progress_docs if p.get("completion_percentage", 0) == 100)
    overall_progress = (completed_modules / total_modules * 100) if total_modules > 0 else 0
    
    return UserProfile(
        id=user_id,
        email=user_doc["email"],
        username=user_doc["username"],
        coins_earned=user_doc.get("coins_earned", 0),
        total_modules=total_modules,
        completed_modules=completed_modules,
        overall_progress=round(overall_progress, 1),
        created_at=user_doc["created_at"]
    )