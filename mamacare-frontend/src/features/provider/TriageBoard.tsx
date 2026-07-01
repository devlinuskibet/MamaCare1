import React, { useState } from 'react';
import { AlertCircle, Clock, CheckCircle2 } from 'lucide-react';
import PatientTriageCard from './PatientTriageCard';
import type { PatientTriageData } from './PatientTriageCard';

import PatientQuickView from './PatientQuickView';

const mockPatients: PatientTriageData[] = [
    {
        id: '1', name: 'Sarah Jenkins', age: 28, risk_level: 'critical',
        primary_flag: 'BP 160/110, Severe Headache', time_unattended: 6,
        gravida_parity: 'G1P0', status: 'waiting'
    },
    {
        id: '2', name: 'Maria Garcia', age: 34, risk_level: 'monitor',
        primary_flag: 'Decreased Fetal Movement', time_unattended: 12,
        gravida_parity: 'G3P2', status: 'waiting'
    },
    {
        id: '3', name: 'Emily Chen', age: 31, risk_level: 'stable',
        primary_flag: 'Routine Checkup, Mild Nausea', time_unattended: 25,
        gravida_parity: 'G2P1', status: 'waiting'
    },
    {
        id: '4', name: 'Aisha Patel', age: 25, risk_level: 'monitor',
        primary_flag: 'Spotting, Mild Cramps', time_unattended: 4,
        gravida_parity: 'G1P0', status: 'waiting'
    },
    {
        id: '5', name: 'Chloe Dubois', age: 30, risk_level: 'critical',
        primary_flag: 'Contractions 3 mins apart', time_unattended: 2,
        gravida_parity: 'G2P1', status: 'waiting'
    }
];

const TriageBoard = () => {
    const [patients, setPatients] = useState<PatientTriageData[]>(mockPatients);
    const [selectedPatient, setSelectedPatient] = useState<PatientTriageData | null>(null);

    const handleAcknowledge = (e: React.MouseEvent, patientId: string) => {
        e.stopPropagation();
        setPatients(prev => prev.map(p => 
            p.id === patientId ? { ...p, status: 'in_treatment' } : p
        ));
        if (selectedPatient?.id === patientId) setSelectedPatient(null);
    };

    const criticalPatients = patients
        .filter(p => p.risk_level === 'critical' && p.status === 'waiting')
        .sort((a, b) => b.time_unattended - a.time_unattended);
        
    const monitorPatients = patients
        .filter(p => p.risk_level === 'monitor' && p.status === 'waiting')
        .sort((a, b) => b.time_unattended - a.time_unattended);
        
    const stablePatients = patients
        .filter(p => p.risk_level === 'stable' && p.status === 'waiting')
        .sort((a, b) => b.time_unattended - a.time_unattended);

    return (
        <div className="space-y-6 animate-in fade-in duration-300 h-full flex flex-col relative overflow-hidden">
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
                            <p className="text-2xl font-bold text-red-700">{criticalPatients.length}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 bg-amber-50 border border-amber-100 px-4 py-3 rounded-xl min-w-fit">
                        <Clock className="text-amber-600" size={24} />
                        <div>
                            <p className="text-xs font-semibold text-amber-600 uppercase tracking-wider">Awaiting Triage</p>
                            <p className="text-2xl font-bold text-amber-700">{patients.filter(p => p.status === 'waiting').length}</p>
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
            <div className="flex-1 flex lg:grid lg:grid-cols-3 gap-6 overflow-x-auto lg:overflow-visible pb-4 lg:pb-0 snap-x snap-mandatory">
                
                {/* 1. Critical / High Risk */}
                <div className="min-w-[320px] w-full lg:min-w-0 lg:w-auto shrink-0 snap-center bg-red-50/50 rounded-2xl border border-red-200 flex flex-col overflow-hidden transition-all duration-300">
                    <div className="bg-red-600 px-4 py-3 flex items-center justify-between shadow-sm">
                        <h2 className="text-white font-bold tracking-wide">Critical / High Risk</h2>
                        <span className="bg-white/20 text-white text-xs font-bold px-2 py-1 rounded-lg">{criticalPatients.length}</span>
                    </div>
                    <div className="flex-1 p-4 flex flex-col gap-4 overflow-y-auto min-h-[400px]">
                        {criticalPatients.length > 0 ? (
                            criticalPatients.map(patient => (
                                <PatientTriageCard 
                                    key={patient.id} 
                                    patient={patient} 
                                    onClick={() => setSelectedPatient(patient)}
                                    onAcknowledge={(e) => handleAcknowledge(e, patient.id)}
                                />
                            ))
                        ) : (
                            <div className="flex-1 rounded-xl flex flex-col items-center justify-center text-center p-6 border-2 border-dashed border-red-200/50">
                                <CheckCircle2 className="text-red-300 mb-2" size={32} />
                                <p className="text-red-400 font-medium">No Active Emergencies</p>
                                <p className="text-red-300 text-sm mt-1">All critical patients are in treatment.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* 2. Monitor / Mid Risk */}
                <div className="min-w-[320px] w-full lg:min-w-0 lg:w-auto shrink-0 snap-center bg-amber-50/50 rounded-2xl border border-amber-200 flex flex-col overflow-hidden transition-all duration-300">
                    <div className="bg-amber-500 px-4 py-3 flex items-center justify-between shadow-sm">
                        <h2 className="text-white font-bold tracking-wide">Monitor / Mid Risk</h2>
                        <span className="bg-white/20 text-white text-xs font-bold px-2 py-1 rounded-lg">{monitorPatients.length}</span>
                    </div>
                    <div className="flex-1 p-4 flex flex-col gap-4 overflow-y-auto min-h-[400px]">
                        {monitorPatients.length > 0 ? (
                            monitorPatients.map(patient => (
                                <PatientTriageCard 
                                    key={patient.id} 
                                    patient={patient} 
                                    onClick={() => setSelectedPatient(patient)}
                                    onAcknowledge={(e) => handleAcknowledge(e, patient.id)}
                                />
                            ))
                        ) : (
                            <div className="flex-1 rounded-xl flex flex-col items-center justify-center text-center p-6 border-2 border-dashed border-amber-200/50">
                                <CheckCircle2 className="text-amber-300 mb-2" size={32} />
                                <p className="text-amber-400 font-medium">No Patients to Monitor</p>
                                <p className="text-amber-300 text-sm mt-1">Queue is clear.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* 3. Stable */}
                <div className="min-w-[320px] w-full lg:min-w-0 lg:w-auto shrink-0 snap-center bg-emerald-50/50 rounded-2xl border border-emerald-200 flex flex-col overflow-hidden transition-all duration-300">
                    <div className="bg-emerald-600 px-4 py-3 flex items-center justify-between shadow-sm">
                        <h2 className="text-white font-bold tracking-wide">Stable</h2>
                        <span className="bg-white/20 text-white text-xs font-bold px-2 py-1 rounded-lg">{stablePatients.length}</span>
                    </div>
                    <div className="flex-1 p-4 flex flex-col gap-4 overflow-y-auto min-h-[400px]">
                        {stablePatients.length > 0 ? (
                            stablePatients.map(patient => (
                                <PatientTriageCard 
                                    key={patient.id} 
                                    patient={patient} 
                                    onClick={() => setSelectedPatient(patient)}
                                    onAcknowledge={(e) => handleAcknowledge(e, patient.id)}
                                />
                            ))
                        ) : (
                            <div className="flex-1 rounded-xl flex flex-col items-center justify-center text-center p-6 border-2 border-dashed border-emerald-200/50">
                                <CheckCircle2 className="text-emerald-300 mb-2" size={32} />
                                <p className="text-emerald-400 font-medium">No Stable Patients</p>
                                <p className="text-emerald-300 text-sm mt-1">Queue is clear.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <PatientQuickView 
                patient={selectedPatient} 
                onClose={() => setSelectedPatient(null)} 
            />
        </div>
    );
};

export default TriageBoard;
