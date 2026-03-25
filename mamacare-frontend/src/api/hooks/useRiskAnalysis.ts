import { useMutation } from '@tanstack/react-query';
import { endpoints } from '../endpoints';
import type { VitalsData, PredictionResponse } from '../../types/health';

export const useRiskAnalysis = () => {
    return useMutation<PredictionResponse, Error, VitalsData>({
        mutationFn: async (data: VitalsData) => {
            const response = await endpoints.prediction.predictRisk(data);
            return response.data;
        }
    });
};
