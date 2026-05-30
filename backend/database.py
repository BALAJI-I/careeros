from pymongo import MongoClient
from dotenv import load_dotenv
import os

load_dotenv(os.path.join(os.path.dirname(__file__), "../.env"))

MONGODB_URL = os.getenv("MONGODB_URL")
DB_NAME = os.getenv("DB_NAME", "careeros")

# Fix SSL for Python 3.14
client = MongoClient(
    MONGODB_URL,
    tls=True,
    tlsAllowInvalidCertificates=True
)

db = client[DB_NAME]

# Collections
resumes_collection = db["resumes"]
users_collection = db["users"]
jobs_collection = db["jobs"]
tasks_collection = db["tasks"]

def check_connection():
    try:
        client.admin.command("ping")
        return True
    except Exception as e:
        print(f"MongoDB connection error: {e}")
        return False
