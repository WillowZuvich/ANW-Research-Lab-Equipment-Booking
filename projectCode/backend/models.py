from sqlalchemy import Column, Integer, String
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
