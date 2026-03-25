import type { PredictionResponse } from '../types/health';

export const getRiskColor = (risk: PredictionResponse['risk_level']): string => {
    switch (risk) {
        case 'high':
            return 'border-red-500 text-red-700 bg-red-50';
        case 'medium':
            return 'border-yellow-500 text-yellow-700 bg-yellow-50';
        case 'low':
            return 'border-green-500 text-green-700 bg-green-50';
        default:
            return 'border-slate-200 text-slate-700 bg-slate-50';
    }
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