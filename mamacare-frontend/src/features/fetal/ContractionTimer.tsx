import React, { useState, useEffect } from 'react';
import { Play, Square, AlertCircle } from 'lucide-react';

export interface Contraction {
    id: string;
    startTime: Date;
    endTime: Date | null;
    durationSeconds: number;
    frequencySeconds: number | null; 
}

const ContractionTimer = () => {
    const [contractions, setContractions] = useState<Contraction[]>([]);
    const [isTiming, setIsTiming] = useState(false);
    const [activeDuration, setActiveDuration] = useState(0);
    
    // Labor Detection State
    const [showHospitalAlert, setShowHospitalAlert] = useState(false);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isTiming) {
            interval = setInterval(() => {
                setActiveDuration(prev => prev + 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isTiming]);

    useEffect(() => {
        // Evaluate 5-1-1 rule: Contractions 5 mins apart, lasting 1 min, for 1 hour
        // For simulation, we'll just check if the last 3 contractions are ~5 mins apart and ~60s long
        if (contractions.length >= 3) {
            const recent = contractions.slice(0, 3);
            const allLongEnough = recent.every(c => c.durationSeconds >= 50); // roughly 1 min
            const allFrequentEnough = recent.every(c => c.frequencySeconds && c.frequencySeconds <= 360 && c.frequencySeconds >= 10); // roughly 5 mins apart

            if (allLongEnough && allFrequentEnough) {
                setShowHospitalAlert(true);
            }
        }
    }, [contractions]);

    const handleStartStop = () => {
        if (!isTiming) {
            // Start
            const now = new Date();
            let frequency = null;
            if (contractions.length > 0) {
                const lastStartTime = contractions[0].startTime;
                frequency = Math.floor((now.getTime() - lastStartTime.getTime()) / 1000);
            }
            
            setContractions([
                {
                    id: Date.now().toString(),
                    startTime: now,
                    endTime: null,
                    durationSeconds: 0,
                    frequencySeconds: frequency
                },
                ...contractions
            ]);
            setIsTiming(true);
            setActiveDuration(0);
        } else {
            // Stop
            const now = new Date();
            setContractions(prev => {
                const updated = [...prev];
                updated[0].endTime = now;
                updated[0].durationSeconds = activeDuration;
                return updated;
            });
            setIsTiming(false);
        }
    };

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    };

    const formatDuration = (seconds: number | null) => {
        if (seconds === null) return '--';
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        if (m > 0) return `${m}m ${s}s`;
        return `${s}s`;
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            {showHospitalAlert && (
                <div className="bg-red-500 text-white p-4 flex items-center justify-center gap-3 animate-pulse">
                    <AlertCircle size={24} />
                    <span className="font-bold text-lg">Time to head to the hospital! Contractions are 5 minutes apart and lasting 60 seconds.</span>
                </div>
            )}
            
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
                            <span className="text-lg font-medium mt-1">{formatDuration(activeDuration)}</span>
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
                                {contractions.map((c, i) => (
                                    <tr key={c.id}>
                                        <td className="px-4 py-3 text-slate-800">{formatTime(c.startTime)}</td>
                                        <td className="px-4 py-3 text-slate-600">
                                            {i === 0 && isTiming ? (
                                                <span className="text-pink-600 font-medium animate-pulse">{formatDuration(activeDuration)}</span>
                                            ) : (
                                                formatDuration(c.durationSeconds)
                                            )}
                                        </td>
                                        <td className="px-4 py-3 text-slate-600">{formatDuration(c.frequencySeconds)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ContractionTimer;
