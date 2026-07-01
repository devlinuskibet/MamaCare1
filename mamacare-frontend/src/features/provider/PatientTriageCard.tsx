import React from 'react';
import { User, Activity, Clock, AlertTriangle } from 'lucide-react';

export interface PatientTriageData {
    id: string;
    name: string;
    age: number;
    risk_level: 'critical' | 'monitor' | 'stable';
    primary_flag: string;
    time_unattended: number; // in minutes
    gravida_parity: string; // e.g. "G2P1"
    status: 'waiting' | 'in_treatment' | 'cleared';
}

interface PatientTriageCardProps {
    patient: PatientTriageData;
    onClick: () => void;
    onAcknowledge?: (e: React.MouseEvent) => void;
}

const PatientTriageCard: React.FC<PatientTriageCardProps> = ({ patient, onClick, onAcknowledge }) => {
    
    // Style mappings based on risk level
    const riskStyles = {
        critical: 'border-red-300 bg-red-50 hover:bg-red-100/80 hover:shadow-red-500/20',
        monitor: 'border-amber-300 bg-amber-50 hover:bg-amber-100/80 hover:shadow-amber-500/20',
        stable: 'border-emerald-300 bg-emerald-50 hover:bg-emerald-100/80 hover:shadow-emerald-500/20'
    };
    
    const iconStyles = {
        critical: 'text-red-600 bg-red-100',
        monitor: 'text-amber-600 bg-amber-100',
        stable: 'text-emerald-600 bg-emerald-100'
    };

    const isCriticalTime = patient.risk_level === 'critical' && patient.time_unattended > 5 && patient.status === 'waiting';

    return (
        <div 
            onClick={onClick}
            className={`
                group p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 relative shadow-sm hover:shadow-md
                ${riskStyles[patient.risk_level]}
                ${isCriticalTime ? 'animate-[pulse_1s_ease-in-out_infinite] ring-4 ring-red-500/50 shadow-red-500/50' : ''}
            `}
        >
            <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${iconStyles[patient.risk_level]}`}>
                        <User size={20} />
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-900 text-base group-hover:text-indigo-700 transition-colors">
                            {patient.name}
                        </h3>
                        <p className="text-xs text-slate-500 font-medium">{patient.age} yrs • {patient.gravida_parity}</p>
                    </div>
                </div>
                
                <div className="flex flex-col items-end gap-1">
                    <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold
                        ${patient.time_unattended > 10 ? 'bg-slate-800 text-white' : 'bg-white text-slate-700 shadow-sm border border-slate-200'}
                    `}>
                        <Clock size={12} className={patient.time_unattended > 10 ? 'text-slate-300' : 'text-slate-400'} />
                        {patient.time_unattended} min
                    </div>
                    {isCriticalTime && (
                        <span className="text-[10px] font-bold text-red-600 uppercase flex items-center gap-1">
                            <AlertTriangle size={10} /> SLA Breach
                        </span>
                    )}
                </div>
            </div>

            <div className="bg-white/60 p-3 rounded-lg border border-white/50 backdrop-blur-sm mb-3">
                <div className="flex items-center gap-2">
                    <Activity size={16} className={iconStyles[patient.risk_level].split(' ')[0]} />
                    <span className="text-sm font-semibold text-slate-700">
                        {patient.primary_flag}
                    </span>
                </div>
            </div>

            {patient.status === 'waiting' && onAcknowledge && (
                <button 
                    onClick={onAcknowledge}
                    className="w-full mt-1 py-2.5 rounded-lg bg-indigo-600 text-white text-sm font-bold shadow-sm hover:bg-indigo-700 hover:shadow-md transition-all active:scale-[0.98]"
                >
                    Acknowledge & Treat
                </button>
            )}
        </div>
    );
};

export default PatientTriageCard;
