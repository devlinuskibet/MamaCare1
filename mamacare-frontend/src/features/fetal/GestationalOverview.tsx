import React from 'react';
import { Calendar, Baby, Ruler } from 'lucide-react';

const GestationalOverview = () => {
    // Mock Data
    const currentWeek = 24;
    const edd = "October 12, 2026";
    const babySize = "Ear of Corn";

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row gap-6 md:items-center justify-between">
            <div className="flex items-center gap-4">
                <div className="p-4 bg-pink-100 text-pink-600 rounded-full">
                    <Baby size={32} />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-slate-800">Week {currentWeek}</h2>
                    <p className="text-slate-500">Second Trimester</p>
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-6">
                <div className="flex items-center gap-3 bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <Calendar className="text-indigo-500" size={24} />
                    <div>
                        <p className="text-xs text-slate-500 font-medium uppercase">Estimated Due Date</p>
                        <p className="text-sm font-bold text-slate-700">{edd}</p>
                    </div>
                </div>

                <div className="flex items-center gap-3 bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <Ruler className="text-emerald-500" size={24} />
                    <div>
                        <p className="text-xs text-slate-500 font-medium uppercase">Baby's Size</p>
                        <p className="text-sm font-bold text-slate-700">{babySize}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GestationalOverview;
