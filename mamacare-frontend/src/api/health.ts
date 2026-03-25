import axiosClient from './axiosClient';

export interface PredictionInput {
    Age: number;
    SystolicBP: number;
    DiastolicBP: number;
    BS: number;
    BodyTemp: number;
    HeartRate: number;
}

export interface PredictionOutput {
    risk_level: string;
    confidence_score: number;
    timestamp: string;
}

export interface HealthRecord {
    systolic_bp: number;
    diastolic_bp: number;
    blood_sugar: number;
    body_temp: number;
    heart_rate: number;
    risk_prediction: string;
    confidence_score: number;
}

export interface HealthHistoryItem {
    id: number;
    timestamp: string;
    systolic_bp: number;
    diastolic_bp: number;
    blood_sugar: number;
    body_temp: number;
    heart_rate: number;
    risk_prediction: string;
    confidence_score: number;
}

export interface TrendResult {
    metric: string;
    slope: number;
    interpretation: string;
    data_points: number;
}

export interface AnalysisResponse {
    trends: TrendResult[];
    overall_status: string;
}

export const healthApi = {
    predictRisk: async (data: PredictionInput) => {
        const response = await axiosClient.post<PredictionOutput>('/api/prediction/predict', data);
        return response.data;
    },
    addHealthRecord: async (data: HealthRecord) => {
        const response = await axiosClient.post('/api/health/add', data);
        return response.data;
    },
    getHistory: async () => {
        const response = await axiosClient.get<HealthHistoryItem[]>('/api/health/history');
        return response.data;
    },
    getTrends: async () => {
        const response = await axiosClient.get<AnalysisResponse>('/api/analysis/trends');
        return response.data;
    }
};
