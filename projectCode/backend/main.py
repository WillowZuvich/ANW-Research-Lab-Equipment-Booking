from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from database import engine, get_db
import models
from pydantic import BaseModel

# Create tables if they don't exist
models.Base.metadata.create_all(bind=engine)

app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "Welcome to the Research Lab Equipment Booking System"}

# Dependency to get the database session
def get_database_session():
    db = get_db()
    return next(db)

@app.get("/users/")
def get_users(db: Session = Depends(get_database_session)):
    return db.query(models.User).all()

class UserCreate(BaseModel):
    name: str
    email: str
    role: str
    password: str

@app.post("/users/")
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    new_user = models.User(
        name=user.name,
        email=user.email,
        role=user.role,
        password=user.password
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user
