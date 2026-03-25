import { useState, useEffect } from 'react';
import { Search, Filter, ChevronRight, User, FileText, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { endpoints } from '../../api/endpoints';

const PatientDirectory = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [patients, setPatients] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [downloadingEmail, setDownloadingEmail] = useState<string | null>(null);

    useEffect(() => {
        fetchDirectory();
    }, []);

    const fetchDirectory = async () => {
        try {
            const res = await endpoints.admin.getDirectory();
            setPatients(res.data);
        } catch (err: any) {
            console.error("Failed to load directory:", err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleExport = async (email: string) => {
        if (!email) return;
        setDownloadingEmail(email);
        try {
            const res = await endpoints.reports.exportPatientReport(email);
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `Maternal_Health_Report_${email}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (err) {
            console.error("Failed to download report", err);
            alert("Failed to export PDF.");
        } finally {
            setDownloadingEmail(null);
        }
    };

    const filteredPatients = patients.filter(patient =>
        patient.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusColor = (status: string) => {
        const val = status.toLowerCase();
        if (val.includes('high')) return 'bg-red-100 text-red-700 border-red-200';
        if (val.includes('mid')) return 'bg-yellow-100 text-yellow-700 border-yellow-200';
        return 'bg-emerald-100 text-emerald-700 border-emerald-200';
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Patient Directory</h1>
                    <p className="text-slate-500">Manage and track maternal health records</p>
                </div>
                <button className="bg-indigo-600 text-white px-4 py-2 rounded-xl font-medium hover:bg-indigo-700 transition-colors">
                    Add Patient
                </button>
            </div>

            {/* Search and Filter */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search by name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                    />
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors">
                    <Filter size={20} />
                    Filters
                </button>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-4 font-semibold text-slate-600">Patient Name</th>
                                <th className="px-6 py-4 font-semibold text-slate-600">Age</th>
                                <th className="px-6 py-4 font-semibold text-slate-600">Gestation</th>
                                <th className="px-6 py-4 font-semibold text-slate-600">Status</th>
                                <th className="px-6 py-4 font-semibold text-slate-600">Last Visit</th>
                                <th className="px-6 py-4 font-semibold text-slate-600">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                                        <RefreshCw size={24} className="animate-spin mx-auto text-indigo-500 mb-2" />
                                        Loading Patient Directory...
                                    </td>
                                </tr>
                            ) : filteredPatients.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                                        No patients found.
                                    </td>
                                </tr>
                            ) : filteredPatients.map((patient) => (
                                <tr key={patient.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
                                                <User size={20} />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="font-medium text-slate-900">{patient.name}</span>
                                                <span className="text-xs text-slate-500">{patient.email}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-slate-600">{patient.age}</td>
                                    <td className="px-6 py-4 text-slate-600">{patient.gestation}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(patient.status)}`}>
                                            {patient.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-slate-500 text-sm font-medium">{patient.lastVisit}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => handleExport(patient.email)}
                                                disabled={downloadingEmail === patient.email}
                                                title="Download Medical Report"
                                                className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors disabled:opacity-50"
                                            >
                                                {downloadingEmail === patient.email ? <RefreshCw size={20} className="animate-spin" /> : <FileText size={20} />}
                                            </button>
                                            <button
                                                onClick={() => navigate(`/patient/${patient.id}`)}
                                                title="View Details"
                                                className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors font-medium border border-transparent hover:border-indigo-100 flex items-center gap-1"
                                            >
                                                Details <ChevronRight size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default PatientDirectory;
