# This file defines tables like Admin, Student, Researcher using SQLAlchemy
from sqlalchemy import Column, Integer, String, ForeignKey
from database import Base

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

class Researcher(Base):
    __tablename__ = "Researcher"

    EmpID = Column(Integer, primary_key=True, index=True, autoincrement=True)
    FirstName = Column(String(100), nullable=False)
    LastName = Column(String(100), nullable=False)
    Email = Column(String(255), unique=True, nullable=False)
    PhoneNumber = Column(String(20), nullable=False)
    Password = Column(String(255), nullable=False)

class Equipment(Base):
    __tablename__ = "Equipment"

    EquipID = Column(Integer, primary_key=True, index=True, autoincrement=True)
    Name = Column(String(100), nullable=False)
    Condition = Column(String(20), nullable=False)
    SupplierId = Column(Integer, ForeignKey("Supplier.SupplierId"))

class Supplier(Base):
    __tablename__ = "Supplier"

    SupplierId = Column(Integer, primary_key=True, index=True, autoincrement=True)
    Name = Column(String(100), nullable=False, unique=True)
    Email = Column(String(255), unique=True, nullable=False)
    PhoneNumber = Column(String(20), nullable=False)
