// src/types/health.ts

// 1. The Raw Vitals (Input)
export interface VitalsData {
    systolic_bp: number;
    diastolic_bp: number;
    heart_rate: number;
    body_temp: number;
    glucose_level: number;
    gestation_week: number;
}

// 2. The Prediction (Output) - THIS IS THE MISSING PART
export interface PredictionResponse {
    risk_level: 'low' | 'medium' | 'high';
    alert_message: string;
    timestamp: string;
    details?: {
        systolic_bp: number;
        diastolic_bp: number;
    };
}

// 3. The History Graphs
export interface HealthTrendPoint {
    date: string;
    value: number;
    risk_level: 'low' | 'medium' | 'high';
}