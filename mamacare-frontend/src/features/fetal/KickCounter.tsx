import { useState } from 'react';
import { Activity, BarChart2 } from 'lucide-react';
import AnalyticsTab from './AnalyticsTab';

const KickCounter = () => {
    const [kicks, setKicks] = useState(0);
    const [view, setView] = useState<'tracker' | 'analytics'>('tracker');

    const logKick = () => {
        setKicks(prev => prev + 1);
    };

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center justify-start text-center h-full">
            <div className="w-full flex justify-end mb-2">
                <div className="bg-slate-100 p-1 rounded-lg flex items-center">
                    <button 
                        onClick={() => setView('tracker')}
                        className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${view === 'tracker' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        Tracker
                    </button>
                    <button 
                        onClick={() => setView('analytics')}
                        className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${view === 'analytics' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        Analytics
                    </button>
                </div>
            </div>

            {view === 'tracker' ? (
                <>
                    <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mb-4 mt-2">
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
                </>
            ) : (
                <AnalyticsTab />
            )}
        </div>
    );
};

export default KickCounter;
