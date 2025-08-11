from datetime import datetime,timedelta,timezone
from fastapi import HTTPException,status, Depends
from jose import JWTError,jwt
from passlib.context import CryptContext
from dotenv import load_dotenv
import os
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials


load_dotenv()

security=HTTPBearer()

# put these in .env files
SECRET_KEY="secret"
ALGO="HS256"
access_token_expires=60

# hashing password
pwd_context=CryptContext(schemes=['bcrypt'],deprecated="auto")


def verify_password(password:str,hased_password:str):
    return pwd_context.verify(password,hased_password)

def create_token(data:dict,expires_delta:timedelta=timedelta(hours=1)):
    to_encode=data.copy()
    if expires_delta:
        expire=datetime.now().astimezone()+expires_delta
    else:
        expire =datetime.now().astimezone()+timedelta(minutes=access_token_expires)
    
    to_encode.update({"exp":expire})
    return jwt.encode(to_encode,SECRET_KEY,algorithm=ALGO)

def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    # verify token and if invalid raise exception
    validity = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload=jwt.decode(credentials.credentials,SECRET_KEY,algorithms=[ALGO])
        email:str=payload.get("sub")
        if email is None:
            raise validity
        token_data=email
    except JWTError:
        return validity
    
    return token_data

def get_hashed_password(password:str)->str:
    return pwd_context.hash(password)