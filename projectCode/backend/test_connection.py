import sqlalchemy

DATABASE_URL = "mysql+mysqlconnector://freebd_naomi_user123:q%2452f5G67HaTdtp@sql.freedb.tech:3306/freebd_research"

try:
    engine = sqlalchemy.create_engine(DATABASE_URL)
    connection = engine.connect()
    print("✅ Database connection successful!")
    connection.close()
except Exception as e:
    print(f" Database connection failed: {e}")