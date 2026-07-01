import React from 'react';
import { AlertCircle, Clock, CheckCircle2 } from 'lucide-react';

const TriageBoard = () => {
    return (
        <div className="space-y-6 animate-in fade-in duration-300 h-full flex flex-col">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Live Triage Board</h1>
                    <p className="text-slate-500 mt-1">Real-time monitoring of incoming maternal triage queues.</p>
                </div>
                
                {/* Shift Statistics */}
                <div className="flex gap-4 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
                    <div className="flex items-center gap-3 bg-red-50 border border-red-100 px-4 py-3 rounded-xl min-w-fit">
                        <AlertCircle className="text-red-600" size={24} />
                        <div>
                            <p className="text-xs font-semibold text-red-600 uppercase tracking-wider">Active Emergencies</p>
                            <p className="text-2xl font-bold text-red-700">2</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 bg-amber-50 border border-amber-100 px-4 py-3 rounded-xl min-w-fit">
                        <Clock className="text-amber-600" size={24} />
                        <div>
                            <p className="text-xs font-semibold text-amber-600 uppercase tracking-wider">Awaiting Triage</p>
                            <p className="text-2xl font-bold text-amber-700">5</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-100 px-4 py-3 rounded-xl min-w-fit">
                        <CheckCircle2 className="text-emerald-600" size={24} />
                        <div>
                            <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">Cleared Today</p>
                            <p className="text-2xl font-bold text-emerald-700">14</p>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Triage Board Area (to be implemented) */}
            <div className="flex-1 rounded-2xl border border-slate-200 bg-slate-50 p-6 flex items-center justify-center">
                <p className="text-slate-400">Triage columns will go here...</p>
            </div>
        </div>
    );
};

export default TriageBoard;
