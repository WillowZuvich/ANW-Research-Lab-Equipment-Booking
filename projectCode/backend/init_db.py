from database import engine, Base

# Drop tables if they exist (optional)
#Base.metadata.drop_all(bind=engine)

# Create tables in the database
Base.metadata.create_all(bind=engine)
print("Database tables created successfully!")
