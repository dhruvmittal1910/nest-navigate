from motor.motor_asyncio import AsyncIOMotorClient
from pymongo.errors import ServerSelectionTimeoutError
import os
from dotenv import load_dotenv

load_dotenv()

class Database:
    client: AsyncIOMotorClient = None
    database = None

# Global database instance
db = Database()

# Load MongoDB URI and database name from environment
uri = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
db_name = os.getenv("DATABASE_NAME", "nest_navigate")

async def connect_to_database():
    try:
        # Create a new client and connect to the server
        db.client = AsyncIOMotorClient(uri, serverSelectionTimeoutMS=5000)
        db.database = db.client[db_name]  # <--- Add this line

        # Send a ping to confirm a successful connection
        await db.client.admin.command('ping')
        print("✅ Pinged your deployment. You successfully connected to MongoDB!")
    except Exception as e:
        print("❌ Failed to connect to MongoDB:", e)

async def close_mongo_connection():
    """Close database connection"""
    if db.client:
        db.client.close()
        print("📡 Disconnected from MongoDB")

def get_database():
    """Get database instance"""
    return db.database
