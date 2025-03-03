#This file handles user registration and login
#          using bcrypt to hash passwords before storing them
from fastapi import FastAPI, HTTPException, Depends
from sqlalchemy.orm import Session
from database import SessionLocal
from models import Admin, Student, Researcher, Supplier, Equipment
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


# Define a request model to accept JSON body
class LoginRequest(BaseModel):
    email: str
    password: str

@app.post("/api/login")
async def login_user(user: LoginRequest, db: Session = Depends(get_db)):
    user_data = db.query(Admin).filter(Admin.Email == user.email).first() or \
                db.query(Student).filter(Student.Email == user.email).first() or \
                db.query(Researcher).filter(Researcher.Email == user.email).first()

    if not user_data or not verify_password(user.password, user_data.Password):
        raise HTTPException(status_code=400, detail="Invalid email or password")

    return {"message": "Login successful", "role": "admin" if isinstance(user_data, Admin) else "researcher" if isinstance(user_data, Researcher) else "student"}


class AddEquipRequest(BaseModel):
    name: str
    condition: str
    supplierName: str

@app.post("/api/addequipment")
async def add_equip(equip: AddEquipRequest, db: Session = Depends(get_db)):
    
    #Query for supplier name. If not found, send back explanation message and from there go to add suplier page.
    #Once supplier is added, automatically add item to database.

    equip_supplier = db.query(Supplier).filter(Supplier.Name == equip.supplierName).first()

    if not equip_supplier:
        raise HTTPException(status_code=400, detail="Invalid supplier. Please add supplier.")
    else:
        new_equip = Equipment(Name=equip.name, Condition=equip.condition, SupplierId=equip_supplier.SupplierId)
    
        try:
            db.add(new_equip)
            db.commit()  # ✅ Ensure data is committed
            db.refresh(new_equip)
            print(f" Item registered: {new_equip.EquipID}")  # Debug log
        except Exception as e:
            db.rollback()  #  Prevent half-saved data
            print(f" Error inserting user: {e}")
            raise HTTPException(status_code=500, detail="Database error")

        return {"message": "Equipment added successfully!"}
    
class AddSupplierRequest(BaseModel):
    name: str
    email: str
    phoneNumber: str


@app.post("/api/addsupplier")
async def add_supplier(supplier: AddSupplierRequest, db: Session = Depends(get_db)):
    
    new_supp = Supplier(Name=supplier.name, Email=supplier.email, PhoneNumber=supplier.phoneNumber)
    
    try:
        db.add(new_supp)
        db.commit()  # ✅ Ensure data is committed
        db.refresh(new_supp)
        print(f" Supplier registered: {new_supp.SupplierId}")  # Debug log
    except Exception as e:
        db.rollback()  #  Prevent half-saved data
        print(f" Error inserting user: {e}")
        raise HTTPException(status_code=500, detail="Database error")

    return {"message": "Supplier added successfully!"}
        
