# auth.py
# Description: This file contains the backend code for the authentication system.
# using bcrypt to hash passwords before storing them
from fastapi import FastAPI, HTTPException, Depends, Query
from sqlalchemy.orm import Session
from database import SessionLocal
from models import Admin, Student, Researcher, Supplier, Equipment, Booking, Specification
import bcrypt # type: ignore
import os
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, ForwardRef
from datetime import datetime
from enum import Enum
from sqlalchemy.orm import joinedload
from sqlalchemy import delete, update

load_dotenv()
app = FastAPI()

# Add CORS Middleware to allow frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",  # Your React frontend
    ],
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
    expose_headers=["*"]  # Needed for some browsers
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
        id = 0
        try:
            db.add(new_equip)
            db.commit() 
            db.refresh(new_equip)
            print(f" Item registered: {new_equip.EquipID}")  
            
        except Exception as e:
            db.rollback()  
            print(f" Error inserting user: {e}")
            raise HTTPException(status_code=500, detail="Database error")

        return {"message": "Equipment added successfully!", "EquipID": {new_equip.EquipID}, "Name" : {new_equip.Name}}

class EquipID(BaseModel):
    equipId: int

@app.post("/api/removeequipment")
async def remove_equip(equipid: EquipID, db: Session = Depends(get_db)):
    
    try:
        db.query(Equipment).filter(Equipment.EquipID==equipid.equipId).delete()
        db.commit()
    except Exception as e:
        db.rollback()
        print(f" Unable to remove item: {equipid}")
    return {"message": "Equipment removed successfully!"}

class EditEquip(BaseModel):
     equipId: int
     name: str
     condition:str

@app.post("/api/editequipment")
async def edit_equip(equip: EditEquip, db: Session = Depends(get_db)): 
    equipnew = db.query(Equipment).filter(Equipment.EquipID==equip.equipId).first()
    try:
        equipnew.Name = equip.name
        equipnew.Condition = equip.condition
        db.commit()
    except Exception as e:
        db.rollback()
        print(f" Unable to update item: {equip.equipId}")   
    return {"message": "Equipment updated successfully!"}

class AddSpecificationRequest(BaseModel):
    equipId: int
    input: str
    

@app.post("/api/addspecifications")
async def add_specifications(spec: AddSpecificationRequest, db: Session = Depends(get_db)):
    print(f"Received: equipId={spec.equipId}, input={spec.input}")

    new_spec = Specification(Detail=spec.input, EquipmentID=spec.equipId)
    try:
        db.add(new_spec)
        db.commit() 
        db.refresh(new_spec)
        print(f" Specification registered: {new_spec.EquipmentID}. {new_spec.Detail}")  
    except Exception as e:
        db.rollback()  
        print(f" Error inserting user: {e}")
        raise HTTPException(status_code=500, detail="Database error")

    return {"message": "Specification added successfully!"}
    
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

class RequesterInfo(BaseModel):
    role: str  # "student" or "researcher"
    id: int
    name: str

class BookingResponse(BaseModel):
    BookingID: int
    Status: str
    EquipmentName: str  
    RequestDate: Optional[str] = None  # Now optional
    StartTime: Optional[str] = None    # Now optional
    EndTime: Optional[str] = None      # Now optional
    AdminAction: Optional[str] = None  # Now optional
    requester_info: Optional[RequesterInfo] = None  

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
    bookings = db.query(Booking).options(
        joinedload(Booking.student),
        joinedload(Booking.researcher),
        joinedload(Booking.equipment)
    ).all()

    results = []
    for b in bookings:
        # Handle null equipment case
        equipment_name = b.equipment.Name if b.equipment else "Unknown Equipment"
        
        # Build requester info only if exists
        # requester_info = None
        if b.student:
            requester_info = RequesterInfo(
                role="student",
                id=b.student.StudentID,
                name=f"{b.student.FirstName} {b.student.LastName}"
            )
        elif b.researcher:
            requester_info = RequesterInfo(
                role="researcher",
                id=b.researcher.EmpID,
                name=f"{b.researcher.FirstName} {b.researcher.LastName}"
            )

        results.append(BookingResponse(
            BookingID=b.BookingID,
            Status=b.Status,
            EquipmentName=equipment_name,
            RequestDate=b.RequestDate.isoformat() if b.RequestDate else None,
            StartTime=b.StartTime.isoformat() if b.StartTime else None,
            EndTime=b.EndTime.isoformat() if b.EndTime else None,
            AdminAction=b.AdminAction,
            requester_info=requester_info.dict() if requester_info else None
        ))
    
    return results


@app.get("/api/researcher/bookings", response_model=List[BookingResponse])
async def get_researcher_bookings(researcher_id: int, db: Session = Depends(get_db)):
    bookings = db.query(Booking).filter(Booking.ResearcherID == researcher_id).all()
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
    user_id: int  # Generic field that can be StudentID or ResearcherID
    equipment_id: int
    user_type: str  # "student" or "researcher"

@app.post("/api/bookings")
async def create_booking(request: CreateBookingRequest, db: Session = Depends(get_db)):
    # Check equipment exists
    if not db.query(Equipment).filter(Equipment.EquipID == request.equipment_id).first():
        raise HTTPException(status_code=404, detail="Equipment not found")

    # Validate user type
    if request.user_type not in ["student", "researcher"]:
        raise HTTPException(status_code=400, detail="Invalid user type")

    # Check user exists
    if request.user_type == "student":
        if not db.query(Student).filter(Student.StudentID == request.user_id).first():
            raise HTTPException(status_code=404, detail="Student not found")
    else:
        if not db.query(Researcher).filter(Researcher.EmpID == request.user_id).first():
            raise HTTPException(status_code=404, detail="Researcher not found")
        
    # Validating booking request:
    if request.user_type == "student" and db.query(Booking).filter(
        Booking.StudentID == request.user_id,
        Booking.EquipmentID == request.equipment_id,
        Booking.Status.in_(["Pending Request", "Approved"])
    ).first():
        raise HTTPException(status_code=400, detail="Duplicate booking request")

    # Create booking
    booking_data = {
        "EquipmentID": request.equipment_id,
        "Status": "Pending Request",
        "RequestDate": datetime.utcnow()
    }

    if request.user_type == "student":
        booking_data["StudentID"] = request.user_id
    else:
        booking_data["ResearcherID"] = request.user_id

    new_booking = Booking(**booking_data)

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
    booking.AdminAction = request.status
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
        raise HTTPException(404, "Booking not found")
    
    booking.Status = "Returned"
    booking.EndTime = datetime.utcnow()
    db.commit()
    return {"message": "Equipment returned successfully"}

class UserType(str, Enum):
    student = "student"
    researcher = "researcher"

# Cancel booking endpoint
@app.put("/api/bookings/{booking_id}/cancel")
async def cancel_booking(
    booking_id: int, 
    user_type: UserType = Query(..., description="Type of user: 'student' or 'researcher'"),
    db: Session = Depends(get_db)
):
    booking = db.query(Booking).filter(Booking.BookingID == booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    
    # Additional validation to ensure the canceler owns the booking
    if user_type == "student" and booking.StudentID is None:
        raise HTTPException(status_code=403, detail="This booking doesn't belong to a student")
    elif user_type == "researcher" and booking.ResearcherID is None:
        raise HTTPException(status_code=403, detail="This booking doesn't belong to a researcher")
    
    booking.Status = "Booking Canceled"
    booking.StartTime = None
    booking.EndTime = None
    
    db.commit()
    return {
        "message": "Booking has been canceled",
        "booking_id": booking_id,
        "new_status": booking.Status,
        "equipment_id": booking.EquipmentID
    }

class EquipmentResponse(BaseModel):
    EquipID: int
    Name: str
    Condition: str
    Availability: str
    Specifications: List[str] = []  

    class Config:
        orm_mode = True

@app.get("/api/equipment", response_model=List[EquipmentResponse])
async def get_equipment(db: Session = Depends(get_db)):
    equipments = db.query(Equipment).options(
        joinedload(Equipment.specifications)  # Eager load specifications
    ).all()
    
    return [
        EquipmentResponse(
            EquipID=e.EquipID,
            Name=e.Name,
            Condition=e.Condition,
            Availability="Available" if not db.query(Booking).filter(
                Booking.EquipmentID == e.EquipID, 
                Booking.Status.in_(["Approved", "Pending Request"])
            ).first() else "Booked",
            Specifications=[spec.Detail for spec in e.specifications]  # Now matches model
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
    
    
# GET all suppliers (NEW ENDPOINT)
class SupplierResponse(BaseModel):
    name: str
    email: str
    phoneNumber: str

    class Config:
        orm_mode = True

@app.get("/api/suppliers", response_model=List[SupplierResponse])
async def get_all_suppliers(db: Session = Depends(get_db)):
    suppliers = db.query(Supplier).all()
    return [
        SupplierResponse(
            name=s.Name,
            email=s.Email,
            phoneNumber=s.PhoneNumber
        ) for s in suppliers
    ]
    
# Optional: Add PUT/DELETE endpoints later for updates/removal if needed.

@app.get("/api/user")
async def get_user_info(role: str = Query(...), userId: int = Query(...), db: Session = Depends(get_db)):
    if role == "admin":
        user = db.query(Admin).filter(Admin.AdminID == userId).first()
    elif role == "student":
        user = db.query(Student).filter(Student.StudentID == userId).first()
    elif role == "researcher":
        user = db.query(Researcher).filter(Researcher.EmpID == userId).first()
    else:
        raise HTTPException(status_code=400, detail="Invalid role")

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return {
        "firstName": user.FirstName,
        "lastName": user.LastName,
        "role": role
    }