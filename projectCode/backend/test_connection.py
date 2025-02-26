import sqlalchemy

DATABASE_URL = os.getenv("DATABASE_URL")

try:
    engine = sqlalchemy.create_engine(DATABASE_URL)
    connection = engine.connect()
    print("✅ Database connection successful!")
    connection.close()
except Exception as e:
    print(f" Database connection failed: {e}")
