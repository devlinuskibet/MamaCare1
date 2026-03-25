// import React from 'react';
import { getRiskColor, getRiskMessage } from '../../utils/risk';
import type { PredictionResponse } from '../../types/health';

interface GestationRingProps {
    week: number;
    babySize: string;
    riskLevel: PredictionResponse['risk_level'];
}

const GestationRing = ({ week, babySize, riskLevel }: GestationRingProps) => {
    // 1. Get dynamic colors based on risk
    const colorClass = getRiskColor(riskLevel);
    const message = getRiskMessage(riskLevel);

    return (
        <div className="flex flex-col items-center justify-center py-8 space-y-6">
            {/* The Visual Ring */}
            <div className={`
        relative w-64 h-64 rounded-full border-[12px] flex flex-col items-center justify-center shadow-sm bg-white
        transition-all duration-500 ease-in-out
        ${colorClass}
      `}>
                <span className="text-sm text-gray-400 uppercase tracking-wide font-semibold">Current Week</span>
                <span className="text-7xl font-bold text-gray-800">{week}</span>

                <div className="absolute -bottom-4 bg-pink-100 text-pink-700 px-4 py-1 rounded-full text-sm font-bold shadow-sm border border-pink-200">
                    Size: {babySize}
                </div>
            </div>

            {/* The Reassuring Message */}
            <div className={`px-6 py-3 rounded-xl border text-center max-w-sm shadow-sm ${colorClass}`}>
                <p className="font-medium">{message}</p>
            </div>
        </div>
    );
};

export default GestationRing;