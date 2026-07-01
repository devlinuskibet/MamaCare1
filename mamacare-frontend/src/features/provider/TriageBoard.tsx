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
            
            {/* Triage Board Area */}
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* 1. Critical / High Risk */}
                <div className="bg-red-50/50 rounded-2xl border border-red-200 flex flex-col overflow-hidden">
                    <div className="bg-red-600 px-4 py-3 flex items-center justify-between shadow-sm">
                        <h2 className="text-white font-bold tracking-wide">Critical / High Risk</h2>
                        <span className="bg-white/20 text-white text-xs font-bold px-2 py-1 rounded-lg">2</span>
                    </div>
                    <div className="flex-1 p-4 flex flex-col gap-4 overflow-y-auto min-h-[400px]">
                        {/* Cards will go here */}
                        <div className="flex-1 border-2 border-dashed border-red-200 rounded-xl flex items-center justify-center">
                            <p className="text-red-400 font-medium">Empty</p>
                        </div>
                    </div>
                </div>

                {/* 2. Monitor / Mid Risk */}
                <div className="bg-amber-50/50 rounded-2xl border border-amber-200 flex flex-col overflow-hidden">
                    <div className="bg-amber-500 px-4 py-3 flex items-center justify-between shadow-sm">
                        <h2 className="text-white font-bold tracking-wide">Monitor / Mid Risk</h2>
                        <span className="bg-white/20 text-white text-xs font-bold px-2 py-1 rounded-lg">5</span>
                    </div>
                    <div className="flex-1 p-4 flex flex-col gap-4 overflow-y-auto min-h-[400px]">
                        {/* Cards will go here */}
                        <div className="flex-1 border-2 border-dashed border-amber-200 rounded-xl flex items-center justify-center">
                            <p className="text-amber-400 font-medium">Empty</p>
                        </div>
                    </div>
                </div>

                {/* 3. Stable */}
                <div className="bg-emerald-50/50 rounded-2xl border border-emerald-200 flex flex-col overflow-hidden">
                    <div className="bg-emerald-600 px-4 py-3 flex items-center justify-between shadow-sm">
                        <h2 className="text-white font-bold tracking-wide">Stable</h2>
                        <span className="bg-white/20 text-white text-xs font-bold px-2 py-1 rounded-lg">14</span>
                    </div>
                    <div className="flex-1 p-4 flex flex-col gap-4 overflow-y-auto min-h-[400px]">
                        {/* Cards will go here */}
                        <div className="flex-1 border-2 border-dashed border-emerald-200 rounded-xl flex items-center justify-center">
                            <p className="text-emerald-400 font-medium">Empty</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TriageBoard;
