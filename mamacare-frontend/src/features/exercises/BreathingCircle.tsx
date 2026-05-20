import { useState, useEffect } from 'react';
import { Play, Square } from 'lucide-react';
import { endpoints } from '../../api/endpoints';

const BreathingCircle = () => {
    const [isActive, setIsActive] = useState(false);
    const [phase, setPhase] = useState<'Inhale' | 'Hold' | 'Exhale' | 'Ready'>('Ready');
    const [sessionStartTime, setSessionStartTime] = useState<number | null>(null);

    useEffect(() => {
        let interval: ReturnType<typeof setInterval>;
        if (isActive) {
            // Initial Phase
            setPhase('Inhale');
            
            // Loop 12-second total cycle (4 Inhale, 4 Hold, 4 Exhale)
            interval = setInterval(() => {
                setPhase(current => {
                    if (current === 'Inhale') return 'Hold';
                    if (current === 'Hold') return 'Exhale';
                    return 'Inhale';
                });
            }, 4000);
        } else {
            setPhase('Ready');
            if (sessionStartTime) {
                const elapsedMinutes = (Date.now() - sessionStartTime) / 60000;
                if (elapsedMinutes > 0.5) {
                    endpoints.wellness.sync({
                        minutes_added: elapsedMinutes,
                        zen_session_added: true
                    }).catch(console.error);
                }
                setSessionStartTime(null);
            }
        }

        return () => {
            clearInterval(interval);
        };
    }, [isActive]);

    const handleStart = () => {
        setIsActive(true);
        setSessionStartTime(Date.now());
    };

    const handleStop = () => {
        setIsActive(false);
    };

    return (
        <div className="bg-slate-900 rounded-3xl p-8 flex flex-col items-center justify-center text-white relative overflow-hidden shadow-2xl">
            {/* Background ambient light */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/50 to-slate-900/50" />
            
            <h3 className="text-xl font-bold mb-2 relative z-10">Daily Zen: 4-4-4 Breathing</h3>
            <p className="text-slate-400 text-sm mb-12 relative z-10 text-center">Lower your cortisol to naturally reduce pregnancy back strain.</p>

            {/* The CSS Animation wrapper. Using Tailwind arbitrary values for custom keyframes isn't standard so we use standard scale classes orchestrated by React, or we can use generic scale transition. Since we want smooth 4s transitions: */}
            <div className="relative w-48 h-48 flex items-center justify-center mb-12 z-10">
                <div 
                    className={`absolute inset-0 rounded-full border-4 border-indigo-400/30 transition-all ease-in-out duration-[4000ms] ${
                        isActive && phase === 'Inhale' ? 'scale-150 border-indigo-400 bg-indigo-500/10' : 
                        isActive && phase === 'Hold' ? 'scale-150 border-indigo-400 bg-indigo-500/20' : 
                        isActive && phase === 'Exhale' ? 'scale-100 border-indigo-400/30 bg-transparent' : 
                        'scale-100'
                    }`}
                />
                <div 
                    className={`absolute inset-0 blur-xl rounded-full transition-all ease-in-out duration-[4000ms] ${
                        isActive && phase === 'Inhale' ? 'scale-150 bg-indigo-500/20' : 
                        isActive && phase === 'Hold' ? 'scale-150 bg-indigo-500/30' : 
                        isActive && phase === 'Exhale' ? 'scale-100 bg-transparent' : 
                        'scale-100 bg-transparent'
                    }`}
                />
                <div className="relative z-10 text-2xl font-bold text-indigo-50 tracking-widest drop-shadow-md transition-all duration-300">
                    {phase}
                </div>
            </div>

            <div className="flex gap-4 relative z-10">
                {!isActive ? (
                    <button 
                        onClick={handleStart}
                        className="flex items-center gap-2 px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full font-bold transition-all shadow-lg hover:shadow-indigo-500/30"
                    >
                        <Play size={18} fill="currentColor" /> Start Session
                    </button>
                ) : (
                    <button 
                        onClick={handleStop}
                        className="flex items-center gap-2 px-8 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-full font-bold transition-all"
                    >
                        <Square size={18} fill="currentColor" /> Stop
                    </button>
                )}
            </div>
        </div>
    );
};

export default BreathingCircle;
