import React, { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { Download } from 'lucide-react';

export interface PatientData {
    full_name: string;
    age: number;
    blood_group: string;
    location: string;
    gravida: number;
    parity: number;
    bmi: number;
}

export interface VitalSigns {
    systolic: number;
    diastolic: number;
    bs: number;
    heart_rate: number;
    risk_status: "Normal" | "Mid Risk" | "High Risk";
}

interface ClinicalPassportProps {
    patientData: PatientData;
    latestVitals: VitalSigns;
}

const ClinicalPassport: React.FC<ClinicalPassportProps> = ({ patientData, latestVitals }) => {
    const componentRef = useRef<HTMLDivElement>(null);
    
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: `MamaCare_Passport_${patientData.full_name.replace(/\s+/g, '_')}`,
    });

    const getStatusColor = (status: string) => {
        switch(status) {
            case 'High Risk': return 'text-red-600 font-bold';
            case 'Mid Risk': return 'text-orange-500 font-bold';
            case 'Normal': return 'text-green-600 font-bold';
            default: return 'text-slate-700';
        }
    };

    return (
        <div className="flex flex-col items-center w-full my-8">
            {/* Action Bar */}
            <div className="w-full max-w-4xl flex justify-end mb-4">
                <button 
                    onClick={handlePrint}
                    className="flex items-center gap-2 bg-pink-600 hover:bg-pink-700 text-white px-5 py-2.5 rounded-lg shadow transition-colors font-medium"
                >
                    <Download size={20} />
                    Download Clinical Passport
                </button>
            </div>

            {/* Printable Area (The A4 Document) */}
            <div className="bg-slate-100 p-8 rounded-xl shadow-lg w-full max-w-4xl overflow-auto flex justify-center">
                <div 
                    ref={componentRef} 
                    className="bg-white text-black w-[210mm] min-h-[297mm] p-10 shadow-sm mx-auto border border-gray-200"
                >
                    {/* Header */}
                    <div className="border-b-2 border-black pb-6 mb-8">
                        <h1 className="text-3xl font-bold text-center uppercase tracking-wider">
                            MamaCare Official Clinical Passport
                        </h1>
                        <p className="text-center text-sm text-gray-500 mt-2">
                            Generated on: {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
                        </p>
                    </div>

                    {/* Section 1 - Demographics */}
                    <div className="mb-8">
                        <h2 className="text-xl font-bold border-b border-gray-300 pb-2 mb-4 uppercase tracking-wide">
                            Demographics
                        </h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <span className="font-semibold text-gray-600 uppercase text-xs">Name</span>
                                <p className="text-lg font-medium">{patientData.full_name}</p>
                            </div>
                            <div>
                                <span className="font-semibold text-gray-600 uppercase text-xs">Age</span>
                                <p className="text-lg font-medium">{patientData.age} years</p>
                            </div>
                            <div>
                                <span className="font-semibold text-gray-600 uppercase text-xs">Blood Group</span>
                                <p className="text-lg font-medium">{patientData.blood_group}</p>
                            </div>
                            <div>
                                <span className="font-semibold text-gray-600 uppercase text-xs">Location</span>
                                <p className="text-lg font-medium">{patientData.location}</p>
                            </div>
                        </div>
                    </div>

                    {/* Section 2 - Obstetric History */}
                    <div className="mb-8">
                        <h2 className="text-xl font-bold border-b border-gray-300 pb-2 mb-4 uppercase tracking-wide">
                            Obstetric History (Patient 360)
                        </h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <span className="font-semibold text-gray-600 uppercase text-xs">Gravida</span>
                                <p className="text-lg font-medium">{patientData.gravida}</p>
                            </div>
                            <div>
                                <span className="font-semibold text-gray-600 uppercase text-xs">Parity</span>
                                <p className="text-lg font-medium">{patientData.parity}</p>
                            </div>
                            <div>
                                <span className="font-semibold text-gray-600 uppercase text-xs">BMI</span>
                                <p className="text-lg font-medium">{patientData.bmi}</p>
                            </div>
                            <div>
                                <span className="font-semibold text-gray-600 uppercase text-xs">Obstetric Shorthand</span>
                                <p className="text-lg font-medium">G{patientData.gravida} P{patientData.parity}</p>
                            </div>
                        </div>
                    </div>

                    {/* Section 3 - Latest Triage Vitals */}
                    <div className="mb-12">
                        <h2 className="text-xl font-bold border-b border-gray-300 pb-2 mb-4 uppercase tracking-wide">
                            Latest Triage Vitals
                        </h2>
                        <table className="w-full text-left border-collapse mt-4">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="border border-gray-300 p-3 font-semibold uppercase text-sm">Vital Sign</th>
                                    <th className="border border-gray-300 p-3 font-semibold uppercase text-sm">Measurement</th>
                                    <th className="border border-gray-300 p-3 font-semibold uppercase text-sm">Clinical Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className="border border-gray-300 p-3">Blood Pressure</td>
                                    <td className="border border-gray-300 p-3">{latestVitals.systolic}/{latestVitals.diastolic} mmHg</td>
                                    <td className={`border border-gray-300 p-3 ${getStatusColor(latestVitals.risk_status)}`}>
                                        {latestVitals.risk_status}
                                    </td>
                                </tr>
                                <tr>
                                    <td className="border border-gray-300 p-3">Blood Sugar</td>
                                    <td className="border border-gray-300 p-3">{latestVitals.bs} mg/dL</td>
                                    <td className="border border-gray-300 p-3 text-slate-700 font-medium">--</td>
                                </tr>
                                <tr>
                                    <td className="border border-gray-300 p-3">Heart Rate</td>
                                    <td className="border border-gray-300 p-3">{latestVitals.heart_rate} bpm</td>
                                    <td className="border border-gray-300 p-3 text-slate-700 font-medium">--</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {/* Footer */}
                    <div className="mt-auto pt-16 border-t border-gray-200">
                        <p className="text-center text-xs text-gray-500 italic">
                            Securely generated by the MamaCare Predictive Triage System for authorized clinical review.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClinicalPassport;
