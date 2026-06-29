import React, { useState } from 'react';
import { Play, Square } from 'lucide-react';

export interface Contraction {
    id: string;
    startTime: Date;
    endTime: Date | null;
    durationSeconds: number;
    frequencySeconds: number | null; // time since last contraction ended
}

const ContractionTimer = () => {
    const [contractions, setContractions] = useState<Contraction[]>([]);
    const [isTiming, setIsTiming] = useState(false);
    
    // UI logic (simplified for step 2)
    const handleStartStop = () => {
        setIsTiming(!isTiming);
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-6 md:p-8 text-center border-b border-slate-100">
                <h2 className="text-2xl font-bold text-slate-800 mb-2">Contraction Timer</h2>
                <p className="text-slate-500 mb-8">Track your contractions to know when it's time to head to the hospital.</p>
                
                <button 
                    onClick={handleStartStop}
                    className={`w-48 h-48 rounded-full flex flex-col items-center justify-center mx-auto transition-all shadow-md
                        ${isTiming 
                            ? 'bg-red-50 hover:bg-red-100 text-red-600 border-4 border-red-200' 
                            : 'bg-pink-50 hover:bg-pink-100 text-pink-600 border-4 border-pink-200'
                        }`}
                >
                    {isTiming ? (
                        <>
                            <Square size={48} className="mb-2" />
                            <span className="font-bold text-xl">Stop</span>
                        </>
                    ) : (
                        <>
                            <Play size={48} className="mb-2 ml-2" />
                            <span className="font-bold text-xl">Start</span>
                        </>
                    )}
                </button>
            </div>
            
            <div className="p-6 md:p-8 bg-slate-50">
                <h3 className="font-bold text-slate-800 mb-4">Recent Contractions</h3>
                {contractions.length === 0 ? (
                    <div className="text-center text-slate-500 py-4 bg-white rounded-xl border border-slate-200 border-dashed">
                        No contractions logged yet.
                    </div>
                ) : (
                    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 text-sm">
                                <tr>
                                    <th className="px-4 py-3 font-medium">Start Time</th>
                                    <th className="px-4 py-3 font-medium">Duration</th>
                                    <th className="px-4 py-3 font-medium">Frequency</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {/* Sample row to visualize layout for step 2 */}
                                <tr>
                                    <td className="px-4 py-3 text-slate-800">10:00 AM</td>
                                    <td className="px-4 py-3 text-slate-600">45 sec</td>
                                    <td className="px-4 py-3 text-slate-600">--</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ContractionTimer;
