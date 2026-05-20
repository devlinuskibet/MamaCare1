import axios from 'axios';
import type { VitalsData, PredictionResponse } from '../types/health';
import type { User, AuthResponse } from '../types/user';

// 1. Base Configuration
const api = axios.create({
    baseURL: 'http://localhost:8000/api', // Make sure this matches your FastAPI URL
    headers: {
        'Content-Type': 'application/json',
    },
});

// 2. Interceptor (Auto-attaches the JWT Token)
api.interceptors.request.use((config: any) => {
    const token = localStorage.getItem('access_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// 3. API Methods
export const endpoints = {
    auth: {
        login: (data: any) => api.post<AuthResponse>('/auth/login', data),
        signup: (data: any) => api.post<AuthResponse>('/auth/signup', data),
        me: () => api.get<User>('/users/me'),
    },

    prediction: {
        // The core "Check Vitals" function
        predictRisk: (data: VitalsData) => api.post<PredictionResponse>('/prediction/predict', data),

        // For the Dashboard graphs
        getHistory: () => api.get<any>('/health/history'),
    },

    chatbot: {
        sendMessage: (message: string) => api.post('/chatbot/query', { message }),
    },

    admin: {
        getTriageRecords: () => api.get<any[]>('/admin/triage'),
        uploadCsv: (formData: FormData) => api.post<{message: string}>('/admin/upload-csv', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        }),
        getDirectory: () => api.get<any[]>('/admin/directory'),
        manualTriage: (data: any) => api.post<{message: string, risk_prediction: string, confidence_score: number}>('/admin/manual-triage', data),
        getPatientDetails: (userId: string) => api.get<{profile: any, history: any[]}>(`/admin/patient/${userId}`),
        resolveAlert: (recordId: number) => api.patch<{message: string, record_id: number}>(`/admin/record/${recordId}/resolve`),
        addPatient: (data: any) => api.post<any>('/admin/add-patient', data),
    },

    reports: {
        getDailyAlerts: () => api.get<any[]>('/reports/daily-alerts'),
        getVitalTrends: () => api.get<any[]>('/reports/vital-trends'),
        getUsageHeatmap: () => api.get<any[]>('/reports/usage-heatmap'),
        exportPatientReport: (email: string) => api.get(`/reports/export/${email}`, { responseType: 'blob' }),
    },
    user: {
        getMe: () => api.get<any>('/user/me'),
        updateProfile: (data: any) => api.put<{message: string}>('/user/update', data),
    },
    wellness: {
        get: () => api.get<any>('/wellness/progress'),
        sync: (data: { minutes_added: number, zen_session_added?: boolean }) => api.post<any>('/wellness/sync', data)
    }
};

export default api;