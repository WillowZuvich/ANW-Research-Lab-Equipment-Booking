import sqlalchemy

DATABASE_URL="mysql+mysqlconnector://root:88DogsPurple466!@45.61.62.183:3306/ResearchEquipmentDB"

try:
    engine = sqlalchemy.create_engine(DATABASE_URL)
    connection = engine.connect()
    print("✅ Database connection successful!")
    connection.close()
except Exception as e:
    print(f" Database connection failed: {e}")