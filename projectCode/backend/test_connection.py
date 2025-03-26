# This tile ensure FastAPI can successfully connect to MySQL
import sqlalchemy
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

DATABASE_URL = os.getenv('DATABASE_URL')

try:
    engine = sqlalchemy.create_engine(DATABASE_URL)
    connection = engine.connect()
    print("✅ Database connection successful!")
    connection.close()
except Exception as e:
    print(f" Database connection failed: {e}")
