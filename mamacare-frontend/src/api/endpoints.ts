import axiosClient from './axiosClient';
import type { VitalsData, PredictionResponse } from '../types/health';
import type { User, AuthResponse } from '../types/user';

// 3. API Methods
export const endpoints = {
    auth: {
        login: (data: any) => axiosClient.post<AuthResponse>('/api/auth/login', data),
        signup: (data: any) => axiosClient.post<AuthResponse>('/api/auth/signup', data),
        me: () => axiosClient.get<User>('/api/user/me'),
    },

    prediction: {
        // The core "Check Vitals" function
        predictRisk: (data: VitalsData) => axiosClient.post<PredictionResponse>('/api/prediction/predict', data),

        // For the Dashboard graphs
        getHistory: () => axiosClient.get<any>('/api/health/history'),
    },

    chatbot: {
        sendMessage: (message: string) => axiosClient.post('/api/chatbot/query', { message }),
    },

    admin: {
        getTriageRecords: () => axiosClient.get<any[]>('/api/admin/triage'),
        uploadCsv: (formData: FormData) => axiosClient.post<{message: string}>('/api/admin/upload-csv', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        }),
        getDirectory: () => axiosClient.get<any[]>('/api/admin/directory'),
        manualTriage: (data: any) => axiosClient.post<{message: string, risk_prediction: string, confidence_score: number}>('/api/admin/manual-triage', data),
        getPatientDetails: (userId: string) => axiosClient.get<{profile: any, history: any[]}>(`/api/admin/patient/${userId}`),
        resolveAlert: (recordId: number) => axiosClient.patch<{message: string, record_id: number}>(`/api/admin/record/${recordId}/resolve`),
        addPatient: (data: any) => axiosClient.post<any>('/api/admin/add-patient', data),
    },

    reports: {
        getDailyAlerts: () => axiosClient.get<any[]>('/api/reports/daily-alerts'),
        getVitalTrends: () => axiosClient.get<any[]>('/api/reports/vital-trends'),
        getUsageHeatmap: () => axiosClient.get<any[]>('/api/reports/usage-heatmap'),
        exportPatientReport: (email: string) => axiosClient.get(`/api/reports/export/${email}`, { responseType: 'blob' }),
    },
    user: {
        getMe: () => axiosClient.get<any>('/api/user/me'),
        updateProfile: (data: any) => axiosClient.put<{message: string}>('/api/user/update', data),
    },
    wellness: {
        get: () => axiosClient.get<any>('/api/wellness/progress'),
        sync: (data: { minutes_added: number, zen_session_added?: boolean }) => axiosClient.post<any>('/api/wellness/sync', data)
    }
};