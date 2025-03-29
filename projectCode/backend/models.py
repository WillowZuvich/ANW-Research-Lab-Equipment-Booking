# models.py
# This file defines tables like Admin, Student, Researcher using SQLAlchemy
#           and creates a Base class for models to inherit from
from sqlalchemy import Column, Integer, String, DateTime, TIMESTAMP, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base

class Booking(Base):
    __tablename__ = "Bookings"

    BookingID = Column(Integer, primary_key=True, index=True, autoincrement=True)
    StudentID = Column(Integer, ForeignKey("Student.StudentID"), nullable=True)
    ResearcherID = Column(Integer, ForeignKey("Researcher.EmpID"), nullable=True)
    EquipmentID = Column(Integer, ForeignKey("Equipment.EquipID"), nullable=False)
    Status = Column(String(50), default="Pending Request")  # Changed default status
    RequestDate = Column(DateTime, server_default=func.now())  # When request was made
    ApprovalDate = Column(DateTime, nullable=True)  # When admin approves/denies
    StartTime = Column(DateTime, nullable=True)  # When equipment is actually booked
    EndTime = Column(DateTime, nullable=True)  # When equipment is returned
    AdminAction = Column(String(50), nullable=True)  # Stores 'Approved' or 'Denied'

    # Relationships
    student = relationship("Student", back_populates="bookings")
    researcher = relationship("Researcher", back_populates="bookings")
    equipment = relationship("Equipment", back_populates="bookings")


class Admin(Base):
    __tablename__ = "Admin"
    AdminID = Column(Integer, primary_key=True, index=True, autoincrement=True)
    FirstName = Column(String(100), nullable=False)
    LastName = Column(String(100), nullable=False)
    Email = Column(String(255), unique=True, nullable=False)
    PhoneNumber = Column(String(20), nullable=False)
    Password = Column(String(255), nullable=False)

class Student(Base):
    __tablename__ = "Student"
    StudentID = Column(Integer, primary_key=True, index=True, autoincrement=True)
    FirstName = Column(String(100), nullable=False)
    LastName = Column(String(100), nullable=False)
    Email = Column(String(255), unique=True, nullable=False)
    PhoneNumber = Column(String(20), nullable=False)
    Password = Column(String(255), nullable=False)
    bookings = relationship("Booking", back_populates="student", cascade="all, delete-orphan")

class Researcher(Base):
    __tablename__ = "Researcher"
    EmpID = Column(Integer, primary_key=True, index=True, autoincrement=True)
    FirstName = Column(String(100), nullable=False)
    LastName = Column(String(100), nullable=False)
    Email = Column(String(255), unique=True, nullable=False)
    PhoneNumber = Column(String(20), nullable=False)
    Password = Column(String(255), nullable=False)
    bookings = relationship("Booking", back_populates="researcher", cascade="all, delete-orphan")

class Supplier(Base):
    __tablename__ = "Supplier"
    SupplierId = Column(Integer, primary_key=True, index=True, autoincrement=True)
    Name = Column(String(100), nullable=False, unique=True)
    Email = Column(String(255), unique=True, nullable=False)
    PhoneNumber = Column(String(20), nullable=False)


class Specification(Base):
    __tablename__ = "Specification"
    SpecID = Column(Integer, primary_key=True, index=True, autoincrement=True)
    EquipmentID = Column(Integer, ForeignKey("Equipment.EquipID"), nullable=False)
    Detail = Column(String(255), nullable=False) 
    equipment = relationship("Equipment", back_populates="specifications")

class Equipment(Base):
    __tablename__ = "Equipment"
    EquipID = Column(Integer, primary_key=True, index=True, autoincrement=True)
    Name = Column(String(100), nullable=False)
    Condition = Column(String(100), nullable=False)
    SupplierId = Column(Integer, ForeignKey("Supplier.SupplierId"))
    specifications = relationship("Specification", back_populates="equipment", cascade="all, delete-orphan")
    bookings = relationship("Booking", back_populates="equipment")

