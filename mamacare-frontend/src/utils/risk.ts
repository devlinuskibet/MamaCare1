import type { PredictionResponse } from '../types/health';

export const getRiskColor = (risk: any): string => {
    const normalized = String(risk).toLowerCase().trim();
    if (['high risk', 'high', '2', 2].includes(normalized)) {
        return 'text-red-600 bg-red-100 border border-red-200';
    }
    if (['mid risk', 'medium risk', 'moderate', 'moderate risk', 'medium', '1', 1].includes(normalized)) {
        return 'text-yellow-600 bg-yellow-100 border border-yellow-200';
    }
    if (['low risk', 'stable', 'low', '0', 0].includes(normalized)) {
        return 'text-green-600 bg-green-100 border border-green-200';
    }
    return 'text-slate-600 bg-slate-100 border border-slate-200';
};

export const getRiskMessage = (risk: PredictionResponse['risk_level']): string => {
    switch (risk) {
        case 'high':
            return 'Attention Required: Please contact your provider immediately.';
        case 'medium':
            return 'Caution: Your vitals are slightly elevated. Monitor closely.';
        case 'low':
            return 'Great job, Mama! Your vitals are looking stable and healthy.';
        default:
            return 'No data available.';
    }
};