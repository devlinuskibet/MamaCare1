import streamlit as st
import pandas as pd
import joblib
import numpy as np

# --- 1. Load the "Pro" Model and Scaler ---
@st.cache_resource
def load_components():
    model = joblib.load('rf_pregnancy_risk_model.pkl')
    scaler = joblib.load('scaler.pkl')
    return model, scaler

try:
    model, scaler = load_components()
except FileNotFoundError:
    st.error("❌ Error: Files not found. Ensure 'rf_pregnancy_risk_model.pkl' and 'scaler.pkl' are in this folder.")
    st.stop()

# --- 2. App Interface ---
st.set_page_config(page_title="MamaCare Risk Assessment", page_icon="🤰")
st.title("🤰 MamaCare: Maternal Risk Assessment")
st.info("ℹ️ Model Version: Pro (11 Clinical Features)")

with st.form("risk_form"):
    st.subheader("1. Clinical Vitals")
    col1, col2 = st.columns(2)
    
    with col1:
        age = st.number_input("Age (Years)", 10, 70, 25)
        systolic_bp = st.number_input("Systolic BP (mm Hg)", 50, 200, 110)
        diastolic_bp = st.number_input("Diastolic BP (mm Hg)", 30, 150, 70)
        bs = st.number_input("Blood Sugar (mmol/L)", 3.0, 20.0, 7.0, step=0.1)
        
    with col2:
        # --- ADDED MISSING FIELD: BODY TEMP ---
        body_temp = st.number_input("Body Temperature (F)", 95.0, 105.0, 98.0, step=0.1)
        bmi = st.number_input("BMI (Body Mass Index)", 10.0, 50.0, 22.0, step=0.1)
        heart_rate = st.number_input("Heart Rate (bpm)", 40, 150, 72)

    st.subheader("2. Medical History & Indicators")
    col3, col4 = st.columns(2)
    
    with col3:
        prev_comp = st.selectbox("Previous Complications?", ["No", "Yes"])
        mental = st.selectbox("Mental Health Issues?", ["No", "Yes"])
        
    with col4:
        p_diabetes = st.selectbox("Pre-existing Diabetes?", ["No", "Yes"])
        g_diabetes = st.selectbox("Gestational Diabetes?", ["No", "Yes"])

    submit_btn = st.form_submit_button("Analyze Risk Profile", type="primary")

# --- 3. Prediction Logic ---
if submit_btn:
    # 1. Convert Yes/No to 1/0
    # The order here MUST match the CSV column order exactly.
    # Based on your dataset image: Age | SysBP | DiaBP | BS | BodyTemp | BMI | PrevComp | PreDiab | GestDiab | Mental | HeartRate
    features = [
        age, 
        systolic_bp, 
        diastolic_bp, 
        bs, 
        body_temp,   # Added this to reach 11 features
        bmi, 
        1 if prev_comp == "Yes" else 0, 
        1 if p_diabetes == "Yes" else 0, 
        1 if g_diabetes == "Yes" else 0, 
        1 if mental == "Yes" else 0,     
        heart_rate   # Heart Rate is often the last feature in this specific dataset
    ]
    
    # 2. Prepare for Model
    features_array = np.array(features).reshape(1, -1)
    
    try:
        # 3. Scale
        scaled_features = scaler.transform(features_array)
        
        # 4. Predict
        prediction = model.predict(scaled_features)[0]
        
        # 5. Display Result
        st.divider()
        st.subheader("Assessment Result")
        
        # Convert prediction to string to handle both numbers (0,1,2) and text
        result_str = str(prediction).lower()
        
        if result_str == "2" or "high" in result_str: 
            st.error("⚠️ **HIGH RISK DETECTED**")
            st.write("**Recommendation:** Immediate specialist consultation required.")
        elif result_str == "1" or "mid" in result_str or "moderate" in result_str: 
            st.warning("⚠️ **MODERATE RISK DETECTED**")
            st.write("**Recommendation:** Schedule closer monitoring.")
        else: 
            st.success("✅ **LOW RISK**")
            st.write("**Recommendation:** Standard prenatal care.")
            
    except Exception as e:
        st.error(f"An error occurred: {e}")
        st.write("Debug info - Feature Count:", len(features))