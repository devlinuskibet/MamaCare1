from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import StreamingResponse
import io
from sqlalchemy.orm import Session
from sqlalchemy import func, desc, extract
from datetime import datetime, timedelta
from typing import List
from fpdf import FPDF

from app.core.database import get_db
from app.api.auth import get_current_user
from app.models.health_record import HealthRecord
from app.models.user import User

router = APIRouter()

def get_admin_user(current_user: dict = Depends(get_current_user)):
    if current_user.get("role") not in ["provider", "admin"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions to access this resource",
        )
    return current_user

@router.get("/daily-alerts")
def get_daily_alerts(
    db: Session = Depends(get_db),
    admin_user: dict = Depends(get_admin_user)
):
    """
    Returns counts of 'High Risk', 'Mid Risk', 'Low Risk' entries in the last 24 hours.
    Formatted for Recharts PieChart: [{name: 'High Risk', value: 5}, ...]
    """
    twenty_four_hours_ago = datetime.utcnow() - timedelta(days=1)
    
    # Query Database
    results = (
        db.query(
            func.coalesce(HealthRecord.risk_prediction, "Unknown").label("risk_label"),
            func.count(HealthRecord.id).label("count")
        )
        .filter(HealthRecord.timestamp >= twenty_four_hours_ago)
        .group_by("risk_label")
        .all()
    )
    
    # Format for Recharts
    chart_data = [{"name": risk, "value": count} for risk, count in results]
    
    # Ensure minimum categories exist even if 0
    existing_labels = {item["name"].lower() for item in chart_data}
    
    if "high risk" not in existing_labels:
        chart_data.append({"name": "High Risk", "value": 0})
    if "mid risk" not in existing_labels:
        chart_data.append({"name": "Mid Risk", "value": 0})
    if "low risk" not in existing_labels:
        chart_data.append({"name": "Low Risk", "value": 0})
        
    return chart_data

@router.get("/vital-trends")
def get_vital_trends(
    db: Session = Depends(get_db),
    admin_user: dict = Depends(get_admin_user)
):
    """
    Returns a 7-day average of Systolic Blood Pressure and Blood Sugar across all patients.
    Formatted for Recharts LineChart.
    """
    seven_days_ago = datetime.utcnow() - timedelta(days=7)
    
    # We must explicitly cast datetime to DATE in sqlite/postgres to group by day.
    # In SQLite, func.date() extracts the date part 'YYYY-MM-DD'.
    # Note: Depending on db dialect, `func.date(HealthRecord.timestamp)` works broadly.
    results = (
        db.query(
            func.date(HealthRecord.timestamp).label("day"),
            func.avg(HealthRecord.systolic_bp).label("avg_systolic"),
            func.avg(HealthRecord.blood_sugar).label("avg_bs")
        )
        .filter(HealthRecord.timestamp >= seven_days_ago)
        .group_by("day")
        .order_by("day")
        .all()
    )
    
    # Format for Recharts
    chart_data = []
    for day_str, avg_sys, avg_bs in results:
        # Avoid nulls returning None to frontend
        sys = round(avg_sys, 1) if avg_sys is not None else 0
        bs = round(avg_bs, 1) if avg_bs is not None else 0
        chart_data.append({
            "date": day_str,
            "avg_systolic": sys,
            "avg_glucose": bs
        })
        
    return chart_data

@router.get("/usage-heatmap")
def get_usage_heatmap(
    db: Session = Depends(get_db),
    admin_user: dict = Depends(get_admin_user)
):
    """
    Extracts the hour from timestamps to identify Peak Usage times globally.
    Formatted for Recharts BarChart.
    """
    # SQLite uses strftime('%H', timestamp) which extract outputs as string.
    # Postgres uses extract('hour', timestamp).
    # We can try to use standard SQLAlchemy extract which handles cross-dialect nicely.
    
    results = (
        db.query(
            extract('hour', HealthRecord.timestamp).label('hour'),
            func.count(HealthRecord.id).label('submissions')
        )
        .group_by('hour')
        .order_by('hour')
        .all()
    )
    
    # Fill in all 24 hours so the chart looks complete
    activity_dict = {int(hour): count for hour, count in results}
    chart_data = []
    
    for h in range(24):
        # Format as "08:00", "15:00"
        hour_str = f"{h:02d}:00"
        count = activity_dict.get(h, 0)
        chart_data.append({
            "hour": hour_str,
            "submissions": count
        })
        
    return chart_data

class PDFReport(FPDF):
    def header(self):
        self.set_font("helvetica", "B", 16)
        self.set_text_color(99, 102, 241) # Indigo
        self.cell(0, 10, "MamaCare AI Analytics Report", border=False, ln=True, align="C")
        self.ln(10)
        
    def footer(self):
        self.set_y(-15)
        self.set_font("helvetica", "I", 8)
        self.set_text_color(128, 128, 128)
        self.cell(0, 10, f"Page {self.page_no()}", align="C")

@router.get("/export/{email}")
def export_patient_report(
    email: str,
    db: Session = Depends(get_db),
    admin_user: dict = Depends(get_admin_user)
):
    """
    Generates a PDF download with the last 10 entries of the specific patient.
    """
    user = db.query(User).filter(User.email == email).first()
    full_name = user.full_name if user else "Unknown Patient"
    
    records = (
        db.query(HealthRecord)
        .filter(HealthRecord.user_email == email)
        .order_by(desc(HealthRecord.timestamp))
        .limit(10)
        .all()
    )
    
    pdf = PDFReport()
    pdf.add_page()
    
    age_str = f"{user.age} yrs" if user and user.age else "N/A"
    bg_str = user.blood_group if user and user.blood_group else "N/A"
    g_str = f"{user.gravida}" if user and user.gravida is not None else "Unknown"
    p_str = f"{user.parity}" if user and user.parity is not None else "Unknown"
    
    # Calculate BMI
    bmi_str = "N/A"
    if user and user.pre_pregnancy_weight_kg and user.height_cm:
        try:
            bmi = user.pre_pregnancy_weight_kg / ((user.height_cm / 100) ** 2)
            bmi_str = f"{bmi:.1f}"
        except:
            pass
            
    loc_str = user.location if user and user.location else "N/A"

    # Patient Profile / Official Header
    pdf.set_font("helvetica", "B", 12)
    pdf.set_text_color(15, 23, 42) # Slate 900
    pdf.cell(0, 8, "Patient Profile", ln=True)
    
    # 2-Column Header Table
    pdf.set_font("helvetica", "", 10)
    pdf.set_text_color(71, 85, 105) # Slate 600
    
    # Row 1
    pdf.cell(90, 6, f"Patient Name: {full_name}", border=0)
    pdf.cell(90, 6, f"Obstetric: G{g_str} P{p_str}", border=0, ln=True)
    
    # Row 2
    pdf.cell(90, 6, f"Age: {age_str}", border=0)
    pdf.cell(90, 6, f"BMI: {bmi_str}", border=0, ln=True)
    
    # Row 3
    pdf.cell(90, 6, f"Blood Group: {bg_str}", border=0)
    pdf.cell(90, 6, f"Location: {loc_str}", border=0, ln=True)
    
    pdf.set_font("helvetica", "I", 9)
    pdf.set_text_color(148, 163, 184) # Slate 400
    pdf.cell(0, 6, f"Generated On: {datetime.utcnow().strftime('%Y-%m-%d %H:%M UTC')}", ln=True)
    pdf.ln(10)
    
    # Table Header
    pdf.set_font("helvetica", "B", 10)
    pdf.set_fill_color(241, 245, 249) # Slate 50
    pdf.set_text_color(15, 23, 42)
    pdf.cell(35, 10, "Date", border=1, fill=True)
    pdf.cell(30, 10, "Vitals (BP)", border=1, fill=True)
    pdf.cell(15, 10, "BS", border=1, fill=True)
    pdf.cell(15, 10, "HR", border=1, fill=True)
    pdf.cell(50, 10, "Risk Assessment", border=1, fill=True)
    pdf.cell(45, 10, "AI Confidence", border=1, fill=True, ln=True)
    
    # Table Rows
    pdf.set_font("helvetica", "", 10)
    for r in records:
        date_str = r.timestamp.strftime('%Y-%m-%d') if r.timestamp else "N/A"
        bp_str = f"{r.systolic_bp}/{r.diastolic_bp}"
        bs_str = f"{r.blood_sugar}"
        hr_str = f"{r.heart_rate}"
        risk = r.risk_prediction or "Unknown"
        conf = f"{(r.confidence_score * 100):.1f}%" if r.confidence_score else "N/A"
        
        pdf.set_text_color(15, 23, 42)
        pdf.cell(35, 10, date_str, border=1)
        pdf.cell(30, 10, bp_str, border=1)
        pdf.cell(15, 10, bs_str, border=1)
        pdf.cell(15, 10, hr_str, border=1)
        
        # Colorizer AI Insight
        val = risk.lower()
        if "high" in val:
            pdf.set_text_color(220, 38, 38) # Red
        elif "mid" in val:
            pdf.set_text_color(217, 119, 6) # Amber
        elif "low" in val:
            pdf.set_text_color(16, 185, 129) # Green
            
        pdf.cell(50, 10, risk, border=1)
        
        pdf.set_text_color(15, 23, 42)
        pdf.cell(45, 10, conf, border=1, ln=True)
        
    # Output PDF
    pdf_bytes = pdf.output()
    if isinstance(pdf_bytes, str):
        # fpdf1 returns string (latin1), fpdf2 output() returns bytearray
        pdf_bytes = pdf_bytes.encode('latin1')
        
    return StreamingResponse(
        io.BytesIO(pdf_bytes),
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename=Maternal_Health_Report_{email}.pdf"}
    )
