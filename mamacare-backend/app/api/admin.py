from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.orm import Session
from sqlalchemy import case, desc
from sqlalchemy import case, desc
from typing import List, Optional
from copy import deepcopy
from pydantic import BaseModel
import csv
import io
import uuid

from app.core.database import get_db
from app.api.auth import get_current_user
from app.models.user import User
from app.models.health_record import HealthRecord
from app.services.ml_service import ml_service

# Input schema for Manual Triage
class ManualTriageInput(BaseModel):
    patient_name: str
    age: int
    systolic_bp: int
    diastolic_bp: int
    blood_sugar: float
    body_temp: float
    heart_rate: int

router = APIRouter()

def get_admin_user(current_user: dict = Depends(get_current_user)):
    """
    Dependency to ensure the user has 'provider' or 'admin' role.
    """
    if current_user.get("role") not in ["provider", "admin"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions to access this resource",
        )
    return current_user

@router.get("/triage")
def get_triage_records(
    db: Session = Depends(get_db),
    admin_user: dict = Depends(get_admin_user)
):
    """
    Get all health records containing vitals, risk predictions, and the mother's full name.
    Prioritizes 'High Risk' records over others, then orders by most recent.
    """
    # Define the ordering logic for risk
    risk_ordering = case(
        {
            "High Risk": 1,
            "Medium Risk": 2,
            "Moderate Risk": 2, # Catch in case both are used
            "Low Risk": 3
        },
        value=HealthRecord.risk_prediction,
        else_=4
    )

    # Query joining HealthRecord and User, filtered by unresolved
    records = (
        db.query(HealthRecord, User.full_name, User.id)
        .join(User, HealthRecord.user_email == User.email)
        .filter(HealthRecord.is_resolved == False)
        .order_by(risk_ordering, desc(HealthRecord.timestamp))
        .all()
    )

    # Format the response
    results = []
    for record, full_name, user_id in records:
        # We need to construct a dictionary or Pydantic model response
        # We can extract the columns from the SQLAlchemy model
        record_dict = {
            "id": record.id,
            "user_id": user_id,
            "user_email": record.user_email,
            "full_name": full_name, # From joined User table
            "timestamp": record.timestamp,
            "systolic_bp": record.systolic_bp,
            "diastolic_bp": record.diastolic_bp,
            "blood_sugar": record.blood_sugar,
            "body_temp": record.body_temp,
            "heart_rate": record.heart_rate,
            "risk_prediction": record.risk_prediction,
            "confidence_score": record.confidence_score,
            "is_resolved": record.is_resolved,
        }
        results.append(record_dict)

    return results

@router.post("/upload-csv")
async def upload_patient_csv(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    admin_user: dict = Depends(get_admin_user)
):
    """
    Accepts a CSV containing: Patient Name, Systolic, Diastolic, Blood Sugar, Heart Rate.
    Parses it, runs the ML model, provisions users (if missing), and saves the health records.
    """
    if not file.filename.endswith(".csv"):
        raise HTTPException(status_code=400, detail="Only CSV files are allowed.")

    try:
        contents = await file.read()
        decoded = contents.decode("utf-8")
        reader = csv.DictReader(io.StringIO(decoded))
        
        # Verify Headers (Case-insensitive check)
        headers = [h.strip().lower() for h in reader.fieldnames or []]
        required = ["patient name", "systolic", "diastolic", "blood sugar", "heart rate"]
        
        for req in required:
            if req not in headers:
                 raise HTTPException(status_code=400, detail=f"Missing required column: {req}. Found: {headers}")

        processed_count = 0
        high_risk_count = 0

        for row in reader:
            # Map case-insensitive keys
            row_dict = {k.strip().lower(): v for k, v in row.items()}
            
            # Extract basic data
            patient_name = row_dict.get("patient name", "Unknown Patient")
            sys_bp = int(row_dict.get("systolic", 0))
            dia_bp = int(row_dict.get("diastolic", 0))
            blood_sugar = float(row_dict.get("blood sugar", 0.0))
            heart_rate = int(row_dict.get("heart rate", 0))

            # Fallbacks for missing model inputs
            age = int(row_dict.get("age", 25))
            body_temp = float(row_dict.get("body temp", 98.6))

            # Run ML prediction
            input_features = [age, sys_bp, dia_bp, blood_sugar, body_temp, heart_rate]
            risk, confidence = ml_service.predict(input_features)

            # Provision / Find User
            guest_email = f"{patient_name.replace(' ', '_').lower()}_{uuid.uuid4().hex[:6]}@guest.local"
            
            # Check if user with that name already exists (Fallback logic is loose here, typically would use email)
            existing_user = db.query(User).filter(User.full_name == patient_name).first()
            if not existing_user:
                new_user = User(
                    email=guest_email,
                    hashed_password="guest_no_login",
                    full_name=patient_name,
                    role="mother",
                    is_active=True
                )
                db.add(new_user)
                db.flush() # Get the new ID/objects ready without fully committing
                owner_email = new_user.email
            else:
                owner_email = existing_user.email

            # Create Health Record
            record = HealthRecord(
                user_email=owner_email,
                systolic_bp=sys_bp,
                diastolic_bp=dia_bp,
                blood_sugar=blood_sugar,
                body_temp=body_temp,
                heart_rate=heart_rate,
                risk_prediction=risk,
                confidence_score=confidence
            )
            db.add(record)

            # Accumulate stats
            processed_count += 1
            if risk.lower() == "high risk":
                high_risk_count += 1

        # Save all records in one bulk commit
        db.commit()

        return {
            "message": f"Processed {processed_count} records. {high_risk_count} high risk detected."
        }

    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error processing CSV: {str(e)}")

@router.post("/manual-triage")
def manual_triage(
    data: ManualTriageInput,
    db: Session = Depends(get_db),
    admin_user: dict = Depends(get_admin_user)
):
    """
    Accepts single patient vitals from the manual dashboard modal.
    Runs the ML model and permanently saves the HealthRecord.
    """
    try:
        # 1. Predict Risk
        input_features = [
            data.age,
            data.systolic_bp,
            data.diastolic_bp,
            data.blood_sugar,
            data.body_temp,
            data.heart_rate
        ]
        risk, confidence = ml_service.predict(input_features)

        # 2. Provision / Find User
        patient_name = data.patient_name.strip()
        guest_email = f"{patient_name.replace(' ', '_').lower()}_{uuid.uuid4().hex[:6]}@guest.local"
        
        existing_user = db.query(User).filter(User.full_name == patient_name).first()
        if not existing_user:
            new_user = User(
                email=guest_email,
                hashed_password="guest_no_login",
                full_name=patient_name,
                role="mother",
                is_active=True
            )
            db.add(new_user)
            db.flush()
            owner_email = new_user.email
        else:
            owner_email = existing_user.email

        # 3. Save Record
        record = HealthRecord(
            user_email=owner_email,
            systolic_bp=data.systolic_bp,
            diastolic_bp=data.diastolic_bp,
            blood_sugar=data.blood_sugar,
            body_temp=data.body_temp,
            heart_rate=data.heart_rate,
            risk_prediction=risk,
            confidence_score=confidence
        )
        db.add(record)
        db.commit()

        return {
            "message": "Manual triage recorded successfully.",
            "risk_prediction": risk,
            "confidence_score": confidence
        }

    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to record triage: {str(e)}")

@router.get("/patient/{user_id}")
def get_patient_details(
    user_id: int,
    db: Session = Depends(get_db),
    admin_user: dict = Depends(get_admin_user)
):
    """
    Retrieves the User profile and all their chronological HealthRecord entries.
    """
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Patient not found")

    records = (
        db.query(HealthRecord)
        .filter(HealthRecord.user_email == user.email)
        .order_by(desc(HealthRecord.timestamp))
        .all()
    )

    return {
        "profile": {
            "id": user.id,
            "full_name": user.full_name,
            "email": user.email,
        },
        "history": records
    }

@router.patch("/record/{record_id}/resolve")
def resolve_alert(
    record_id: int,
    db: Session = Depends(get_db),
    admin_user: dict = Depends(get_admin_user)
):
    """
    Marks a specific HealthRecord as resolved, removing it from the active triage board.
    """
    record = db.query(HealthRecord).filter(HealthRecord.id == record_id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Health record not found")

    record.is_resolved = True
    db.commit()
    
    return {"message": "Alert resolved successfully", "record_id": record.id}

@router.get("/directory")
def get_patient_directory(
    db: Session = Depends(get_db),
    admin_user: dict = Depends(get_admin_user)
):
    """
    Returns a unique list of all mothers who have submitted vitals.
    Groups by email to only return the latest status and joins with User table.
    """
    records = (
        db.query(HealthRecord, User)
        .join(User, HealthRecord.user_email == User.email)
        .order_by(desc(HealthRecord.timestamp))
        .all()
    )
    
    seen_emails = set()
    directory = []
    
    for record, user in records:
        if record.user_email not in seen_emails:
            seen_emails.add(record.user_email)
            
            directory.append({
                "id": str(user.id),
                "email": record.user_email,
                "name": user.full_name,
                "age": "N/A",
                "gestation": "N/A",
                "status": record.risk_prediction or "Unknown",
                "lastVisit": record.timestamp.strftime("%b %d, %Y") if record.timestamp else "N/A"
            })
            
    return directory
