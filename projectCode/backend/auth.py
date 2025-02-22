from fastapi import FastAPI, HTTPException, Depends
from sqlalchemy.orm import Session
from database import SessionLocal
from models import Admin, Student, Researcher
import bcrypt
import os
from dotenv import load_dotenv

load_dotenv()
app = FastAPI()

# Dependency to get database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Helper function to hash passwords
def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

# Helper function to verify passwords
def verify_password(plain_password, hashed_password):
    return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))

# REGISTER API
@app.post("/api/register")
async def register_user(firstName: str, lastName: str, email: str, phoneNumber: str, password: str, role: str, db: Session = Depends(get_db)):
    hashed_password = hash_password(password)

    if role == "admin":
        new_user = Admin(FirstName=firstName, LastName=lastName, Email=email, PhoneNumber=phoneNumber, Password=hashed_password)
    elif role == "student":
        new_user = Student(FirstName=firstName, LastName=lastName, Email=email, PhoneNumber=phoneNumber, Password=hashed_password)
    elif role == "researcher":
        new_user = Researcher(FirstName=firstName, LastName=lastName, Email=email, PhoneNumber=phoneNumber, Password=hashed_password)
    else:
        raise HTTPException(status_code=400, detail="Invalid role")

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {"message": "User registered successfully!"}

# LOGIN API
@app.post("/api/login")
async def login_user(email: str, password: str, db: Session = Depends(get_db)):
    user = db.query(Admin).filter(Admin.Email == email).first() or \
           db.query(Student).filter(Student.Email == email).first() or \
           db.query(Researcher).filter(Researcher.Email == email).first()

    if not user or not verify_password(password, user.Password):
        raise HTTPException(status_code=400, detail="Invalid email or password")

    return {"message": "Login successful", "role": "admin" if isinstance(user, Admin) else "researcher" if isinstance(user, Researcher) else "student"}
