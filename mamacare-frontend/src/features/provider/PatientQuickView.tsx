import React from 'react';
import { X, HeartPulse, Activity, Calendar, History, ShieldAlert } from 'lucide-react';
import { PatientTriageData } from './PatientTriageCard';

interface PatientQuickViewProps {
    patient: PatientTriageData | null;
    onClose: () => void;
}

const PatientQuickView: React.FC<PatientQuickViewProps> = ({ patient, onClose }) => {
    if (!patient) return null;

    return (
        <div className="fixed inset-0 z-50 flex justify-end">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Drawer */}
            <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900">{patient.name}</h2>
                        <p className="text-sm text-slate-500">Age: {patient.age} • {patient.gravida_parity}</p>
                    </div>
                    <button 
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-slate-200 text-slate-500 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {/* Active Alert */}
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-xl">
                        <div className="flex items-start gap-3">
                            <ShieldAlert className="text-red-500 shrink-0 mt-0.5" size={20} />
                            <div>
                                <h3 className="font-bold text-red-800 text-sm">Primary Complaint</h3>
                                <p className="text-red-600 mt-1">{patient.primary_flag}</p>
                                <p className="text-red-500 text-xs mt-2 font-medium">
                                    Time Waiting: {patient.time_unattended} mins
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Vitals Snapshot */}
                    <div>
                        <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                            <Activity size={18} className="text-indigo-600" />
                            Latest Vitals
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                                <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-1">Blood Pressure</p>
                                <p className="text-xl font-bold text-slate-800">160/110</p>
                            </div>
                            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                                <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-1">Heart Rate</p>
                                <p className="text-xl font-bold text-slate-800 flex items-center gap-2">
                                    95 <HeartPulse size={16} className="text-red-500 animate-pulse" />
                                </p>
                            </div>
                            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                                <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-1">SpO2</p>
                                <p className="text-xl font-bold text-slate-800">98%</p>
                            </div>
                            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                                <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-1">Temperature</p>
                                <p className="text-xl font-bold text-slate-800">37.2°C</p>
                            </div>
                        </div>
                    </div>

                    {/* Brief History */}
                    <div>
                        <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                            <History size={18} className="text-indigo-600" />
                            Recent Notes
                        </h3>
                        <div className="space-y-4 relative before:absolute before:inset-0 before:ml-2 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
                            
                            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                                <div className="flex items-center justify-center w-5 h-5 rounded-full border-2 border-white bg-indigo-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10"></div>
                                <div className="w-[calc(100%-2.5rem)] md:w-[calc(50%-1.25rem)] bg-white p-3 rounded-xl border border-slate-100 shadow-sm ml-4 md:ml-0">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="font-bold text-slate-800 text-sm">Admitted</span>
                                        <span className="text-xs text-slate-500">Just now</span>
                                    </div>
                                    <p className="text-sm text-slate-600">Patient arrived at triage desk reporting severe headache.</p>
                                </div>
                            </div>
                            
                        </div>
                    </div>

                </div>
                
                <div className="p-6 border-t border-slate-100 bg-white">
                    <button className="w-full py-3 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition-colors shadow-sm">
                        View Full Medical Record
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PatientQuickView;
