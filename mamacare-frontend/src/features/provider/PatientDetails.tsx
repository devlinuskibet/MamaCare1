import { useParams, useNavigate } from 'react-router-dom';
import { Phone, CheckCircle, Calendar, Activity, Droplet, ArrowLeft, RefreshCw, AlertTriangle, Download } from 'lucide-react';
import { useState, useEffect } from 'react';
import { endpoints } from '../../api/endpoints';

const PatientDetails = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    
    const [patientData, setPatientData] = useState<{ profile: any, history: any[] } | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isResolving, setIsResolving] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);

    useEffect(() => {
        const fetchDetails = async () => {
            if (!id) return;
            try {
                const response = await endpoints.admin.getPatientDetails(id);
                setPatientData(response.data);
            } catch (err: any) {
                console.error("Failed to fetch patient details:", err);
                setError(err.response?.data?.detail || "Failed to load patient data.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchDetails();
    }, [id]);

    const formatTimestamp = (isoString: string) => {
        const utcString = isoString.endsWith('Z') || isoString.includes('+') ? isoString : `${isoString}Z`;
        const date = new Date(utcString);
        return new Intl.DateTimeFormat('en-US', {
            dateStyle: 'medium',
            timeStyle: 'short'
        }).format(date);
    };

    const handleResolve = async (recordId: number) => {
        setIsResolving(true);
        try {
            await endpoints.admin.resolveAlert(recordId);
            // On success, go back to the dashboard where this patient will inherently be cleared from the active queue.
            navigate('/provider');
        } catch (err: any) {
            console.error("Failed to resolve alert:", err);
            alert(err.response?.data?.detail || "Failed to resolve alert.");
            setIsResolving(false);
        }
    };

    const handleDownload = async () => {
        if (!patientData?.profile?.email) return;
        setIsDownloading(true);
        try {
            const response = await endpoints.reports.exportPatientReport(patientData.profile.email);
            // Convert to explicit Blob Object URL
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `Maternal_Health_Report_${patientData.profile.email}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (err: any) {
            console.error("Failed to download PDF:", err);
            alert("Failed to download PDF report. Ensure backend is running.");
        } finally {
            setIsDownloading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <RefreshCw size={32} className="animate-spin text-indigo-600" />
            </div>
        );
    }

    if (error || !patientData) {
        return (
            <div className="p-6 bg-red-50 text-red-700 rounded-2xl border border-red-200">
                <h2 className="text-xl font-bold mb-2">Error Loading Profile</h2>
                <p>{error || "Patient not found."}</p>
                <button onClick={() => navigate('/provider')} className="mt-4 flex items-center gap-2 text-indigo-600 hover:text-indigo-800">
                    <ArrowLeft size={16} /> Back to Dashboard
                </button>
            </div>
        );
    }

    const { profile, history } = patientData;
    
    // Find the newest active alert to bind the resolve button to
    const activeAlert = history.find(record => !record.is_resolved);

    return (
        <div className="space-y-6">
            <button onClick={() => navigate('/provider')} className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors font-medium">
                <ArrowLeft size={18} />
                Back to Triage
            </button>

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">{profile.full_name}</h1>
                    <div className="flex items-center gap-3 mt-1 text-slate-500 text-sm">
                        <span>{profile.email}</span>
                        <span>•</span>
                        <span>Patient #{profile.id}</span>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    {activeAlert && (
                        <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold bg-amber-50 text-amber-700 border border-amber-200">
                            Active Triage Required
                        </span>
                    )}

                    <div className="flex items-center gap-2">
                        <button 
                            onClick={handleDownload}
                            disabled={isDownloading}
                            className="flex items-center gap-2 px-4 py-2 bg-indigo-50 border border-indigo-200 text-indigo-700 font-semibold rounded-xl hover:bg-indigo-100 transition-colors shadow-sm disabled:opacity-50"
                        >
                            <Download size={18} />
                            {isDownloading ? 'Downloading...' : 'Download Medical Report'}
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition-colors">
                            <Phone size={18} />
                            Contact
                        </button>
                        {activeAlert && (
                            <button 
                                onClick={() => handleResolve(activeAlert.id)}
                                disabled={isResolving}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors shadow-sm shadow-blue-200 disabled:opacity-50"
                            >
                                <CheckCircle size={18} />
                                {isResolving ? 'Resolving...' : 'Resolve Alert'}
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: Stats */}
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                        <h2 className="font-bold text-slate-800 mb-4">Patient Stats</h2>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-white rounded-lg text-blue-600 shadow-sm">
                                        <Droplet size={20} />
                                    </div>
                                    <span className="text-sm font-medium text-slate-600">Blood Type</span>
                                </div>
                                <span className="font-bold text-slate-900">-</span>
                            </div>

                            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-white rounded-lg text-purple-600 shadow-sm">
                                        <Activity size={20} />
                                    </div>
                                    <span className="text-sm font-medium text-slate-600">Weight</span>
                                </div>
                                <span className="font-bold text-slate-900">-</span>
                            </div>

                            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-white rounded-lg text-emerald-600 shadow-sm">
                                        <Calendar size={20} />
                                    </div>
                                    <span className="text-sm font-medium text-slate-600">Total Records</span>
                                </div>
                                <span className="font-bold text-slate-900 text-right text-xs md:text-sm">{history.length}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Health History Timeline */}
                <div className="lg:col-span-2 space-y-4">
                    <h2 className="font-bold text-xl text-slate-800">Clinical History</h2>
                    {history.length === 0 ? (
                        <div className="p-6 bg-white rounded-2xl border border-slate-200 text-center text-slate-500">
                            No vitals recorded for this patient.
                        </div>
                    ) : (
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50 border-b border-slate-200 text-sm text-slate-500">
                                        <th className="p-4 font-semibold">Date</th>
                                        <th className="p-4 font-semibold">Vitals (BP, Sug, HR)</th>
                                        <th className="p-4 font-semibold">Assessment</th>
                                        <th className="p-4 font-semibold text-right">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {history.map((record) => (
                                        <tr key={record.id} className={`border-b border-slate-100 ${!record.is_resolved ? 'bg-red-50/30' : ''}`}>
                                            <td className="p-4 align-top whitespace-nowrap text-sm text-slate-600">
                                                {formatTimestamp(record.timestamp)}
                                            </td>
                                            <td className="p-4 align-top text-sm">
                                                <div className="flex flex-col gap-1">
                                                    <span className="font-medium text-slate-800">{record.systolic_bp}/{record.diastolic_bp} mmHg</span>
                                                    <span className="text-slate-500">BS: {record.blood_sugar} | HR: {record.heart_rate}</span>
                                                </div>
                                            </td>
                                            <td className="p-4 align-top">
                                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border
                                                    ${record.risk_prediction?.toLowerCase().includes('high') ? 'bg-red-50 text-red-700 border-red-200' :
                                                      record.risk_prediction?.toLowerCase().includes('mid') ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                                                      'bg-green-50 text-emerald-700 border-green-200'}
                                                `}>
                                                    {record.risk_prediction || 'Unknown'} ({(record.confidence_score * 100).toFixed(0)}%)
                                                </span>
                                            </td>
                                            <td className="p-4 align-top text-right">
                                                {!record.is_resolved ? (
                                                    <span className="inline-flex items-center gap-1 text-red-600 text-xs font-bold">
                                                        <AlertTriangle size={14} /> ACTIVE ALERT
                                                    </span>
                                                ) : (
                                                    <span className="text-slate-400 text-xs font-medium">Resolved</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PatientDetails;
