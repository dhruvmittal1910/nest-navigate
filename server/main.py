from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import user,progress
from database.database import connect_to_database, close_mongo_connection
from contextlib import asynccontextmanager


@asynccontextmanager
async def lifespan(app:FastAPI):
    print("starting up")
    await connect_to_database()
    yield
    print("closing up")
    await close_mongo_connection()
    
    
app=FastAPI(lifespan=lifespan)

app.add_middleware(CORSMiddleware,allow_origins=["*"],allow_credentials=True, allow_methods=["*"],allow_headers=["*"] )


@app.get("/")
def home():
    return {"messgage":"working currently on home route"}

app.include_router(user.router)
app.include_router(progress.router)

if __name__=="__main__":
    import uvicorn
    uvicorn.run("main:app",reload=True)