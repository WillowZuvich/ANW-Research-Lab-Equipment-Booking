import pytest
from httpx import AsyncClient
from httpx._transports.asgi import ASGITransport
from fastapi import status
from auth import app
from database import SessionLocal, Base, engine
from models import Supplier, Equipment, Specification, Admin, Booking, Student, Researcher
import requests

# Create test database schema
Base.metadata.create_all(bind=engine)

@pytest.fixture(scope="module")
def test_db():
    db = SessionLocal()
    try:
        yield db
    finally:
"""         db.close()
""" 
@pytest.mark.asyncio
async def test_register_user():
    db = SessionLocal()
    db.rollback()
    existing = db.query(Admin).filter_by(Email="testtestadmin@example.com").first()
    db.close()
    if existing:
        return

    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        payload = {
            "firstName": "TestTest",
            "lastName": "UserUser",
            "email": "testtestadmin@example.com",
            "phoneNumber": "9999999999",
            "password": "secret123",
            "role": "admin"
        }
        response = await ac.post("/api/register", json=payload)
        assert response.status_code == 200
        assert response.json()["message"] == "User registered successfully!"

@pytest.mark.asyncio
async def test_login_user():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        payload = {
            "email": "testtestadmin@example.com",
            "password": "secret123"
        }
        response = await ac.post("/api/login", json=payload)
        assert response.status_code == 200
        assert response.json()["message"] == "Login successful"

@pytest.mark.asyncio
async def test_add_equipment(test_db):
    supplier = test_db.query(Supplier).filter_by(Email="testtestsupplier@example.com").first()
    if not supplier:
        supplier = Supplier(Name="TestTestSupplier", Email="testtestsupplier@example.com", PhoneNumber="8888888888")
        test_db.add(supplier)
        test_db.commit()
        test_db.refresh(supplier)
    else:
        test_db.rollback()

    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        payload = {
            "name": "OscilloscopeTest",
            "condition": "New",
            "supplierName": "testtestsupplier"
        }
        response = await ac.post("/api/addequipment", json=payload)
        assert response.status_code == 200
        assert "EquipID" in response.json()

@pytest.mark.asyncio
async def test_edit_equipment(test_db):
    test_db.rollback()
    equipment = test_db.query(Equipment).first()
    payload = {
        "equipId": equipment.EquipID,
        "name": "OscilloscopeTest Pro",
        "condition": "Used"
    }
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        response = await ac.post("/api/editequipment", json=payload)
        assert response.status_code == 200
        assert response.json()["message"] == "Equipment updated successfully!"

@pytest.mark.asyncio
async def test_add_specification(test_db):
    test_db.rollback()
    equipment = test_db.query(Equipment).first()
    payload = {
        "equipId": equipment.EquipID,
        "input": "TestSpec"
    }
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        response = await ac.post("/api/addspecifications", json=payload)
        assert response.status_code == 200
        assert response.json()["message"] == "Specification added successfully!"

@pytest.mark.asyncio
async def test_remove_specification(test_db):
    test_db.rollback()
    equipment = test_db.query(Equipment).first()
    spec = test_db.query(Specification).filter(Specification.EquipmentID == equipment.EquipID).first()
    payload = {
        "equipId": equipment.EquipID,
        "detail": spec.Detail
    }
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        response = await ac.post("/api/removespecification", json=payload)
        assert response.status_code == 200
        assert response.json()["message"] == "Specification removed successfully!"

@pytest.mark.asyncio
async def test_remove_equipment(test_db):
    test_db.rollback()
    equipment = test_db.query(Equipment).first()
    payload = {"equipId": equipment.EquipID}
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        response = await ac.post("/api/removeequipment", json=payload)
        assert response.status_code == 200
        assert response.json()["message"] == "Equipment removed successfully!"

@pytest.mark.asyncio
async def test_edit_specification(test_db):
    test_db.rollback()

    # Ensure the equipment and spec exist first
    equipment = test_db.query(Equipment).first()

    if not equipment:
        pytest.skip("No equipment found to test with")

    spec = test_db.query(Specification).filter(Specification.EquipmentID == equipment.EquipID).first()

    if not spec:
        # Add a spec if missing
        new_spec = Specification(EquipmentID=equipment.EquipID, Detail="Temporary Spec")
        test_db.add(new_spec)
        test_db.commit()
        test_db.refresh(new_spec)

    # Now test the edit
    payload = {
        "equipId": equipment.EquipID,
        "updated_detail": "UpdatedSpecValue"
    }

    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        response = await ac.put("/api/editspecification", json=payload)
        assert response.status_code == 200
        assert response.json()["message"] == "Specification updated successfully!"

@pytest.mark.asyncio
async def test_get_user_info(test_db):
    # Assuming the test admin from registration test exists
    admin = test_db.query(Admin).filter_by(Email="testtestadmin@example.com").first()

    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        response = await ac.get(f"/api/user?role=admin&userId={admin.AdminID}")
        assert response.status_code == 200
        assert response.json()["firstName"] == admin.FirstName

@pytest.mark.asyncio
async def test_get_all_suppliers(test_db):
    supplier = test_db.query(Supplier).first()
    if not supplier:
        supplier = Supplier(Name="TestSupplier", Email="supplier@test.com", PhoneNumber="1234567890")
        test_db.add(supplier)
        test_db.commit()

    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        response = await ac.get("/api/suppliers")
        assert response.status_code == 200
        assert isinstance(response.json(), list)
        assert any(s["email"] == supplier.Email for s in response.json())

@pytest.mark.asyncio
async def test_get_all_equipment(test_db):
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        response = await ac.get("/api/equipment")
        assert response.status_code == 200
        assert isinstance(response.json(), list)

@pytest.mark.asyncio
async def test_get_equipment_details(test_db):
    equipment = test_db.query(Equipment).first()

    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        response = await ac.get(f"/api/equipment/{equipment.EquipID}")
        assert response.status_code == 200
        assert response.json()["EquipID"] == equipment.EquipID

@pytest.mark.asyncio
async def test_cancel_booking(test_db):
    booking = test_db.query(Booking).filter(Booking.Status != "Booking Canceled").first()

    if not booking:
        pytest.skip("No cancellable booking available.")

    user_type = "student" if booking.StudentID else "researcher"
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        response = await ac.put(f"/api/bookings/{booking.BookingID}/cancel?user_type={user_type}")
        assert response.status_code == 200
        assert response.json()["new_status"] == "Booking Canceled"

@pytest.mark.asyncio
async def test_return_equipment(test_db):
    booking = test_db.query(Booking).filter(Booking.Status != "Returned").first()

    if not booking:
        pytest.skip("No returnable booking available.")

    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        response = await ac.put(f"/api/bookings/{booking.BookingID}/return")
        assert response.status_code == 200
        assert response.json()["message"] == "Equipment returned successfully"

@pytest.mark.asyncio
async def test_add_supplier(test_db):
    test_db.rollback()
    supplier = test_db.query(Supplier).filter(Supplier.Name == "TestSupplier451").first()
    test_db.delete(supplier)
    test_db.commit()
    payload = {
        "name": "TestSupplier451",
        "email": "TestEmail1@Supplier.com",
        "phoneNumber" : "5555544444"
    }
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        response = await ac.post("/api/addsupplier", json=payload)
        assert response.status_code == 200
        assert response.json()["message"] == "Supplier added successfully!"
""" """
@pytest.mark.asyncio
async def test_get_student_booking(test_db):
    test_db.rollback()
    student = test_db.query(Student).first()
 
    payload = {
        "student_id" : student.StudentID
    }
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        response = await ac.get("/api/student/bookings", params=payload)
        assert response.status_code == 200

@pytest.mark.asyncio
async def test_get_researcher_booking(test_db):
    test_db.rollback()
    researcher = test_db.query(Researcher).first()
    payload = {
        "researcher_id" : researcher.EmpID
    }
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        response = await ac.get("/api/researcher/bookings", params=payload)
        assert response.status_code == 200

@pytest.mark.asyncio
async def test_get_all_bookings(test_db):
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        response = await ac.get("/api/admin/bookings")
        assert response.status_code == 200 

@pytest.mark.asyncio
async def test_create_booking(test_db):
    test_db.rollback()
    equipid = 1
    booked = True
    equip = test_db.query(Equipment).filter(Equipment.EquipID == equipid).first()
    while booked and equipid < 50:
        equip = test_db.query(Equipment).filter(Equipment.EquipID == equipid).first()
        if equip:
            booking = test_db.query(Booking).filter(Booking.EquipmentID == equip.EquipID).first()
        equipid += 1
        if equip and not booking:
            booked = False

    if not equip:
        pytest.skip("No items available to book")

    user = test_db.query(Student).first()

    payload ={
        "user_id" : user.StudentID,
        "equipment_id" : equip.EquipID,
        "user_type" : "student"
    }
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        response = await ac.post("/api/bookings", json = payload)
        assert response.status_code == 200
        assert response.json()["message"] == "Booking request created successfully"

@pytest.mark.asyncio
async def test_update_booking_status(test_db):
    booking = test_db.query(Booking).filter(Booking.Status == "Pending Request").first()
    if not booking:
        pytest.skip("No pending requests.")
    id = booking.BookingID
    newStatus = "Approved"
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        headers = {'Content-type': 'application/json'}
        addr = f"/api/bookings/{id}/status"
        payload = {
            "status": newStatus,
            "admin_action": "Approved by admin"
        }
        response = await ac.put(addr, json =payload)
        assert response.status_code == 200
        assert response.json()["message"] == f"Booking status updated to Approved"
