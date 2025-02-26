from fastapi import FastAPI, HTTPException, Depends
from sqlalchemy.orm import Session
from database import SessionLocal
from models import Admin, Student, Researcher
import bcrypt
import os
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

load_dotenv()
app = FastAPI()

# ✅ Add CORS Middleware to allow frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Allow frontend access
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)

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

class RegisterUserRequest(BaseModel):
    firstName: str
    lastName: str
    email: str
    phoneNumber: str
    password: str
    role: str

@app.post("/api/register")
async def register_user(user: RegisterUserRequest, db: Session = Depends(get_db)):
    hashed_password = hash_password(user.password)

    if user.role.lower() == "admin":
        new_user = Admin(FirstName=user.firstName, LastName=user.lastName, Email=user.email, PhoneNumber=user.phoneNumber, Password=hashed_password)
    elif user.role.lower() == "student":
        new_user = Student(FirstName=user.firstName, LastName=user.lastName, Email=user.email, PhoneNumber=user.phoneNumber, Password=hashed_password)
    elif user.role.lower() == "researcher":
        new_user = Researcher(FirstName=user.firstName, LastName=user.lastName, Email=user.email, PhoneNumber=user.phoneNumber, Password=hashed_password)
    else:
        raise HTTPException(status_code=400, detail="Invalid role")

    try:
        db.add(new_user)
        db.commit()  # ✅ Ensure data is committed
        db.refresh(new_user)
        print(f" User registered: {new_user.Email}")  # Debug log
    except Exception as e:
        db.rollback()  #  Prevent half-saved data
        print(f" Error inserting user: {e}")
        raise HTTPException(status_code=500, detail="Database error")

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
