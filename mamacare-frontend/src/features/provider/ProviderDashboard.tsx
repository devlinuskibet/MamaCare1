import React, { useState, useEffect, useRef } from 'react';
import { Eye, AlertCircle, CheckCircle, AlertTriangle, RefreshCw, UploadCloud, PlusCircle, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { endpoints } from '../../api/endpoints';
import { useUserRole } from '../../contexts/UserContext';

interface Patient {
    id: number;
    user_id: number;
    full_name: string;
    systolic_bp: number;
    diastolic_bp: number;
    timestamp: string;
    risk_prediction: 'High Risk' | 'Medium Risk' | 'Moderate Risk' | 'Low Risk' | string;
}

const ProviderDashboard = () => {
    const { user } = useUserRole();
    const [patients, setPatients] = useState<Patient[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Upload State
    const [isUploading, setIsUploading] = useState(false);
    const [uploadMessage, setUploadMessage] = useState<string | null>(null);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Manual Triage State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmittingManual, setIsSubmittingManual] = useState(false);
    const [manualForm, setManualForm] = useState({
        patient_name: '',
        age: '',
        systolic_bp: '',
        diastolic_bp: '',
        blood_sugar: '',
        body_temp: '',
        heart_rate: ''
    });

    const fetchTriageRecords = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await endpoints.admin.getTriageRecords();
            setPatients(response.data);
        } catch (err: any) {
            console.error('Failed to fetch triage records:', err);
            setError(err.response?.data?.detail || 'Failed to load triage data. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchTriageRecords();
    }, []);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.name.endsWith('.csv')) {
            setUploadError('Please select a valid .csv file.');
            return;
        }

        setIsUploading(true);
        setUploadMessage(null);
        setUploadError(null);

        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await endpoints.admin.uploadCsv(formData);
            setUploadMessage(response.data.message);
            fetchTriageRecords(); // Refresh the table
        } catch (err: any) {
            console.error('Upload failed:', err);
            setUploadError(err.response?.data?.detail || 'Failed to upload CSV. Please try again.');
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = ''; // Reset input
            }
        }
    };

    const handleManualSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmittingManual(true);
        setUploadMessage(null);
        setUploadError(null);

        try {
            // Convert strings to numbers where necessary
            const payload = {
                patient_name: manualForm.patient_name,
                age: parseInt(manualForm.age) || 25,
                systolic_bp: parseInt(manualForm.systolic_bp) || 0,
                diastolic_bp: parseInt(manualForm.diastolic_bp) || 0,
                blood_sugar: parseFloat(manualForm.blood_sugar) || 0.0,
                body_temp: parseFloat(manualForm.body_temp) || 98.6,
                heart_rate: parseInt(manualForm.heart_rate) || 0
            };

            const response = await endpoints.admin.manualTriage(payload);
            setUploadMessage(response.data.message);
            setIsModalOpen(false);
            setManualForm({
                patient_name: '', age: '', systolic_bp: '', diastolic_bp: '', blood_sugar: '', body_temp: '', heart_rate: ''
            });
            fetchTriageRecords();
        } catch (err: any) {
             console.error('Manual triage failed:', err);
             setUploadError(err.response?.data?.detail || 'Failed to submit manual triage.');
        } finally {
            setIsSubmittingManual(false);
        }
    };

    const getRiskBadge = (level: string | null | undefined) => {
        if (!level) return (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-50 text-slate-700 border border-slate-200">
                Pending
            </span>
        );
        
        const normalizedLevel = level.toLowerCase().trim();
        
        if (normalizedLevel === 'high risk' || normalizedLevel === 'high') {
            return (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-600 border border-red-200">
                    <AlertCircle size={14} /> High Risk
                </span>
            );
        } else if (normalizedLevel === 'mid risk' || normalizedLevel === 'medium risk' || normalizedLevel === 'moderate risk' || normalizedLevel === 'medium') {
            return (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-yellow-100 text-yellow-600 border border-yellow-200">
                    <AlertTriangle size={14} /> Caution
                </span>
            );
        } else if (normalizedLevel === 'low risk' || normalizedLevel === 'stable' || normalizedLevel === 'low') {
            return (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-600 border border-green-200">
                    <CheckCircle size={14} /> Stable
                </span>
            );
        } else {
            return (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-50 text-slate-700 border border-slate-200">
                    Pending
                </span>
            );
        }
    };

    const formatTimestamp = (isoString: string) => {
        // If the backend sends a naive datetime string without a timezone, JS assumes it's local time.
        // We append 'Z' to explicitly parse it as UTC, so Javascript correctly shifts it to the user's local timezone.
        const utcString = isoString.endsWith('Z') || isoString.includes('+') ? isoString : `${isoString}Z`;
        const date = new Date(utcString);
        return new Intl.DateTimeFormat('en-US', {
            dateStyle: 'medium',
            timeStyle: 'short'
        }).format(date);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">MamaCare Provider Portal</h1>
                    <p className="text-sm text-slate-500">Welcome back, {user?.full_name || 'Dr. Provider'}</p>
                </div>
                <div className="flex items-center gap-3">
                    {/* Hidden file input */}
                    <input 
                        type="file" 
                        accept=".csv" 
                        className="hidden" 
                        ref={fileInputRef}
                        onChange={handleFileUpload}
                    />
                    
                    {/* Manual Triage Button */}
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-emerald-600 border border-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors shadow-sm"
                    >
                        <PlusCircle size={18} />
                        Manual Triage
                    </button>

                    {/* Import Button */}
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploading}
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 border border-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm disabled:opacity-50"
                    >
                        <UploadCloud size={18} className={isUploading ? 'animate-bounce' : ''} />
                        {isUploading ? 'Processing...' : 'Import Patient Data'}
                    </button>

                    {/* Refresh Button */}
                    <button
                        onClick={fetchTriageRecords}
                        disabled={isLoading || isUploading}
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50"
                    >
                        <RefreshCw size={18} className={isLoading ? 'animate-spin' : ''} />
                        Refresh
                    </button>
                </div>
            </div>

            {/* Error and Success Banners */}
            {uploadError && (
                <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex flex-col items-start shadow-sm">
                    <p className="font-semibold text-sm">Upload Failed</p>
                    <p className="text-sm">{uploadError}</p>
                </div>
            )}
            
            {uploadMessage && (
                <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-lg flex items-center justify-between shadow-sm">
                    <div className="flex items-center gap-2">
                        <CheckCircle size={18} />
                        <p className="font-semibold text-sm">{uploadMessage}</p>
                    </div>
                    <button onClick={() => setUploadMessage(null)} className="text-emerald-700 hover:text-emerald-900 text-sm">Dismiss</button>
                </div>
            )}

            {error && !uploadError && (
                <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex flex-col items-start shadow-sm">
                   <p className="font-semibold text-sm">Data Fetch Error</p>
                   <p className="text-sm">{error}</p>
                </div>
            )}

            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs uppercase tracking-wider">
                            <th className="p-4 font-semibold">Patient Name</th>
                            {/* <th className="p-4 font-semibold">Gestation</th> */}
                            <th className="p-4 font-semibold">Last Vitals</th>
                            <th className="p-4 font-semibold">Risk Status</th>
                            <th className="p-4 font-semibold text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 relative min-h-[200px]">
                        {isLoading && patients.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="p-8 text-center text-slate-500">
                                    Loading triage data...
                                </td>
                            </tr>
                        ) : patients.length === 0 && !error ? (
                            <tr>
                                <td colSpan={4} className="p-8 text-center text-slate-500">
                                    No patients found.
                                </td>
                            </tr>
                        ) : (
                            patients.map((patient) => (
                                <tr key={patient.id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="p-4 font-medium text-slate-900">{patient.full_name}</td>
                                    {/* <td className="p-4 text-slate-600">Week {patient.gestationWeek}</td> */}
                                    <td className="p-4">
                                        <div className="text-slate-900 font-medium">
                                            {patient.systolic_bp}/{patient.diastolic_bp}
                                        </div>
                                        <div className="text-xs text-slate-400">
                                            {formatTimestamp(patient.timestamp)}
                                        </div>
                                    </td>
                                    <td className="p-4">{getRiskBadge(patient.risk_prediction)}</td>
                                    <td className="p-4 text-right">
                                        <Link
                                            to={`/patient/${patient.user_id}`}
                                            className="text-blue-600 hover:text-blue-800 text-sm font-semibold inline-flex items-center gap-1"
                                        >
                                            View Details <Eye size={16} />
                                        </Link>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Manual Triage Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">
                        <div className="flex justify-between items-center p-6 border-b border-slate-100">
                            <h2 className="text-xl font-bold text-slate-800">Manual Triage Entry</h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                                <X size={20} />
                            </button>
                        </div>
                        
                        <div className="p-6 overflow-y-auto">
                            <form id="manual-triage-form" onSubmit={handleManualSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Patient Name</label>
                                    <input required type="text" value={manualForm.patient_name} onChange={(e) => setManualForm({...manualForm, patient_name: e.target.value})} className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="Jane Doe" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Age</label>
                                        <input required type="number" value={manualForm.age} onChange={(e) => setManualForm({...manualForm, age: e.target.value})} className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="28" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Heart Rate</label>
                                        <input required type="number" value={manualForm.heart_rate} onChange={(e) => setManualForm({...manualForm, heart_rate: e.target.value})} className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="bpm" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Systolic BP</label>
                                        <input required type="number" value={manualForm.systolic_bp} onChange={(e) => setManualForm({...manualForm, systolic_bp: e.target.value})} className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="mmHg" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Diastolic BP</label>
                                        <input required type="number" value={manualForm.diastolic_bp} onChange={(e) => setManualForm({...manualForm, diastolic_bp: e.target.value})} className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="mmHg" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Blood Sugar</label>
                                        <input required type="number" step="0.1" value={manualForm.blood_sugar} onChange={(e) => setManualForm({...manualForm, blood_sugar: e.target.value})} className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="mmol/L" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Body Temp</label>
                                        <input required type="number" step="0.1" value={manualForm.body_temp} onChange={(e) => setManualForm({...manualForm, body_temp: e.target.value})} className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="°F" />
                                    </div>
                                </div>
                            </form>
                        </div>

                        <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
                            <button onClick={() => setIsModalOpen(false)} type="button" className="px-5 py-2 text-slate-600 hover:text-slate-800 font-medium">Cancel</button>
                            <button form="manual-triage-form" disabled={isSubmittingManual} type="submit" className="px-5 py-2 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition disabled:opacity-50">
                                {isSubmittingManual ? 'Processing...' : 'Run Triage'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProviderDashboard;
