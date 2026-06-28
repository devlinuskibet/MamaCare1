import React, { useState } from 'react';
import { Activity } from 'lucide-react';

const KickCounter = () => {
    const [kicks, setKicks] = useState(0);

    const logKick = () => {
        setKicks(prev => prev + 1);
    };

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center justify-center text-center h-full">
            <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mb-4">
                <Activity size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-800">Fetal Movement</h3>
            <p className="text-slate-500 text-sm mt-1 mb-6">Track your baby's kicks to monitor health.</p>
            
            <div className="mb-6">
                <span className="text-5xl font-black text-pink-600">{kicks}</span>
                <span className="text-slate-400 font-medium ml-2 uppercase text-sm">Kicks Today</span>
            </div>

            <button 
                onClick={logKick}
                className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md transition-all active:scale-95 text-lg"
            >
                Log a Kick
            </button>
        </div>
    );
};

export default KickCounter;
