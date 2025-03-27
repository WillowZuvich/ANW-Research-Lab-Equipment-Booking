# Description: This file contains the backend code for the authentication system.
# using bcrypt to hash passwords before storing them
from fastapi import FastAPI, HTTPException, Depends
from sqlalchemy.orm import Session
from database import SessionLocal
from models import Admin, Student, Researcher, Supplier, Equipment, Booking
import bcrypt
import os
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
from datetime import datetime



load_dotenv()
app = FastAPI()

# Add CORS Middleware to allow frontend requests
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
        db.commit()  # Ensure data is committed
        db.refresh(new_user)
        print(f" User registered: {new_user.Email}")  # Debug log
    except Exception as e:
        db.rollback()  #  Prevent half-saved data
        print(f" Error inserting user: {e}")
        raise HTTPException(status_code=500, detail="Database error")

    return {"message": "User registered successfully!"}


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

    if isinstance(user_data, Admin):
        return {"message": "Login successful", "role": "admin", "userId": user_data.AdminID}
    elif isinstance(user_data, Researcher):
        return {"message": "Login successful", "role": "researcher", "userId": user_data.EmpID}
    else:
        # Student
        return {"message": "Login successful", "role": "student", "userId": user_data.StudentID}



class AddEquipRequest(BaseModel):
    name: str
    condition: str
    supplierName: str

@app.post("/api/addequipment")
async def add_equip(equip: AddEquipRequest, db: Session = Depends(get_db)):

    equip_supplier = db.query(Supplier).filter(Supplier.Name == equip.supplierName).first()

    if not equip_supplier:
        raise HTTPException(status_code=400, detail="Invalid supplier. Please add supplier.")
    else:
        new_equip = Equipment(Name=equip.name, Condition=equip.condition, SupplierId=equip_supplier.SupplierId)
    
        try:
            db.add(new_equip)
            db.commit() 
            db.refresh(new_equip)
            print(f" Item registered: {new_equip.EquipID}")  
        except Exception as e:
            db.rollback()  
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
        db.commit()  
        db.refresh(new_supp)
        print(f" Supplier registered: {new_supp.SupplierId}")  
    except Exception as e:
        db.rollback()  #  Prevent half-saved data
        print(f" Error inserting user: {e}")
        raise HTTPException(status_code=500, detail="Database error")

    return {"message": "Supplier added successfully!"}

class BookingResponse(BaseModel):
    BookingID: int
    Status: str
    EquipmentName: str  
    RequestDate: str  
    StartTime: str
    EndTime: str
    AdminAction: str  

    class Config:
        orm_mode = True

@app.get("/api/student/bookings", response_model=List[BookingResponse])
async def get_student_bookings(student_id: int, db: Session = Depends(get_db)):
    bookings = db.query(Booking).filter(Booking.StudentID == student_id).all()
    return [
        BookingResponse(
            BookingID=b.BookingID,
            Status=b.Status,
            EquipmentName=b.equipment.Name,
            RequestDate=b.RequestDate.strftime("%m/%d/%Y %H:%M:%S") if b.RequestDate else "",
            StartTime=b.StartTime.strftime("%m/%d/%Y %H:%M:%S") if b.StartTime else "",
            EndTime=b.EndTime.strftime("%m/%d/%Y %H:%M:%S") if b.EndTime else "",
            AdminAction=b.AdminAction or ""
        )
        for b in bookings
    ]

@app.get("/api/admin/bookings", response_model=List[BookingResponse])
async def get_all_bookings(db: Session = Depends(get_db)):
    bookings = db.query(Booking).all()
    return [
        BookingResponse(
            BookingID=b.BookingID,
            Status=b.Status,
            EquipmentName=b.equipment.Name,
            RequestDate=b.RequestDate.strftime("%m/%d/%Y %H:%M:%S") if b.RequestDate else "",
            StartTime=b.StartTime.strftime("%m/%d/%Y %H:%M:%S") if b.StartTime else "",
            EndTime=b.EndTime.strftime("%m/%d/%Y %H:%M:%S") if b.EndTime else "",
            AdminAction=b.AdminAction or ""
        )
        for b in bookings
    ]

class CreateBookingRequest(BaseModel):
    student_id: int
    equipment_id: int

@app.post("/api/bookings")
async def create_booking(request: CreateBookingRequest, db: Session = Depends(get_db)):

    if not db.query(Equipment).filter(Equipment.EquipID == request.equipment_id).first():
        raise HTTPException(status_code=404, detail="Equipment not found")

    new_booking = Booking(
        StudentID=request.student_id,
        EquipmentID=request.equipment_id,
        Status="Pending Request",  # Changed from "Pending"
        RequestDate=datetime.utcnow(),  # Add request timestamp
        # Don't set StartTime or EndTime yet
        
    )
    try:
        db.add(new_booking)
        db.commit()
        db.refresh(new_booking)
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail="Error creating booking")
    return {"message": "Booking request created successfully", "booking_id": new_booking.BookingID}

class UpdateBookingStatusRequest(BaseModel):
    status: str  # Should be "Approved" or "Denied"
    admin_action: str  # Add this field

class BookingStatus:
    PENDING = "Pending Request"
    APPROVED = "Approved"
    DENIED = "Denied"
    RETURNED = "Returned"
    CANCELED = "Booking Canceled"

@app.put("/api/bookings/{booking_id}/status")
async def update_booking_status(booking_id: int, request: UpdateBookingStatusRequest, db: Session = Depends(get_db)):
    booking = db.query(Booking).filter(Booking.BookingID == booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    
    if request.status not in ["Approved", "Denied"]:
        raise HTTPException(status_code=400, detail="Invalid status. Must be 'Approved' or 'Denied'")
    
    booking.Status = "Approved" if request.status == "Approved" else "Denied"
    booking.AdminAction = request.admin_action
    booking.ApprovalDate = datetime.utcnow()
    
    if request.status == "Approved":
        booking.StartTime = datetime.utcnow()  # Set start time when approved
    else:
        booking.StartTime = None
        booking.EndTime = None
    
    db.commit()
    return {"message": f"Booking status updated to {booking.Status}"}

@app.put("/api/bookings/{booking_id}/return")
async def return_equipment(booking_id: int, db: Session = Depends(get_db)):
    booking = db.query(Booking).filter(Booking.BookingID == booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    
    booking.EndTime = datetime.utcnow()
    booking.Status = "Returned"
    
    db.commit()
    return {"message": "Equipment returned successfully"}

# Cancel booking endpoint
@app.put("/api/bookings/{booking_id}/cancel")
async def cancel_booking(booking_id: int, db: Session = Depends(get_db)):
    booking = db.query(Booking).filter(Booking.BookingID == booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    
    booking.Status = "Booking Canceled"
    booking.StartTime = None
    booking.EndTime = None
    
    db.commit()
    return {"message": "Booking has been canceled"}


class EquipmentResponse(BaseModel):
    EquipID: int
    Name: str
    Condition: str
    Availability: str  # "Available" or "Booked"

    class Config:
        orm_mode = True

@app.get("/api/equipment", response_model=List[EquipmentResponse])
async def get_equipment(db: Session = Depends(get_db)):
    equipments = db.query(Equipment).all()
    
    return [
        EquipmentResponse(
            EquipID=e.EquipID,
            Name=e.Name,
            Condition=e.Condition,
            Availability="Available" if not db.query(Booking).filter(
                Booking.EquipmentID == e.EquipID, 
                Booking.Status.in_(["Approved", "Pending Request"])
            ).first() else "Booked"
        )
        for e in equipments
    ]

@app.get("/api/equipment/{equip_id}", response_model=EquipmentResponse)
async def get_equipment_details(equip_id: int, db: Session = Depends(get_db)):
    equipment = db.query(Equipment).filter(Equipment.EquipID == equip_id).first()

    if not equipment:
        raise HTTPException(status_code=404, detail="Equipment not found")

    return EquipmentResponse(
        EquipID=equipment.EquipID,
        Name=equipment.Name,
        Condition=equipment.Condition,
        Availability="Available" if not db.query(Booking).filter(
            Booking.EquipmentID == equipment.EquipID, 
            Booking.Status.in_([BookingStatus.APPROVED, BookingStatus.PENDING])
        ).first() else "Booked",
        Specifications=[spec.Detail for spec in equipment.specifications]
    )




        
