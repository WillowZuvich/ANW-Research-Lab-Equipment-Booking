import pytest
from httpx import AsyncClient
from httpx._transports.asgi import ASGITransport
from fastapi import status
from auth import app
from database import SessionLocal, Base, engine
from models import Supplier, Equipment, Specification, Admin

# Create test database schema
Base.metadata.create_all(bind=engine)

@pytest.fixture(scope="module")
def test_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

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
