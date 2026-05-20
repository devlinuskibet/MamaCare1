import { useState, useEffect } from 'react';
import { Search, Filter, ChevronRight, User, FileText, RefreshCw, Plus, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { endpoints } from '../../api/endpoints';

const PatientDirectory = () => {
    const navigate = useNavigate();
    
    // Directory State
    const [searchTerm, setSearchTerm] = useState('');
    const [patients, setPatients] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [downloadingEmail, setDownloadingEmail] = useState<string | null>(null);

    // Client-side Filter State
    const [filterRisk, setFilterRisk] = useState<string>('All');
    const [showRiskFilter, setShowRiskFilter] = useState(false);

    // Add Patient Modal State
    const [showAddModal, setShowAddModal] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [newPatient, setNewPatient] = useState({
        full_name: '', email: '', age: '', blood_group: 'O+',
        gravida: '1', parity: '0', living_children: '0',
        height_cm: '', pre_pregnancy_weight_kg: '',
        systolic_bp: '', diastolic_bp: '', blood_sugar: '', body_temp: '', heart_rate: ''
    });

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

    const handleAddPatient = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const payload = {
                ...newPatient,
                age: Number(newPatient.age),
                gravida: Number(newPatient.gravida),
                parity: Number(newPatient.parity),
                living_children: Number(newPatient.living_children),
                height_cm: newPatient.height_cm ? Number(newPatient.height_cm) : null,
                pre_pregnancy_weight_kg: newPatient.pre_pregnancy_weight_kg ? Number(newPatient.pre_pregnancy_weight_kg) : null,
                systolic_bp: newPatient.systolic_bp ? Number(newPatient.systolic_bp) : null,
                diastolic_bp: newPatient.diastolic_bp ? Number(newPatient.diastolic_bp) : null,
                blood_sugar: newPatient.blood_sugar ? Number(newPatient.blood_sugar) : null,
                body_temp: newPatient.body_temp ? Number(newPatient.body_temp) : null,
                heart_rate: newPatient.heart_rate ? Number(newPatient.heart_rate) : null,
            };
            await endpoints.admin.addPatient(payload);
            setShowAddModal(false);
            setNewPatient({
                full_name: '', email: '', age: '', blood_group: 'O+',
                gravida: '1', parity: '0', living_children: '0',
                height_cm: '', pre_pregnancy_weight_kg: '',
                systolic_bp: '', diastolic_bp: '', blood_sugar: '', body_temp: '', heart_rate: ''
            });
            fetchDirectory();
        } catch (err: any) {
            console.error("Failed to add patient", err);
            alert("Failed to add patient. Check if email is unique or inputs are valid.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const filteredPatients = patients.filter(patient => {
        const matchesSearch = patient.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRisk = filterRisk === 'All' || 
            (patient.status && patient.status.toLowerCase().includes(filterRisk.toLowerCase()));
        return matchesSearch && matchesRisk;
    });

    const getStatusColor = (status: string) => {
        const val = status.toLowerCase();
        if (val.includes('high')) return 'bg-red-100 text-red-600 border border-red-200';
        if (val.includes('mid') || val.includes('medium') || val.includes('moderate')) return 'bg-yellow-100 text-yellow-600 border border-yellow-200';
        return 'bg-green-100 text-green-600 border border-green-200';
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Patient Directory</h1>
                    <p className="text-slate-500">Manage and track maternal health records</p>
                </div>
                <button 
                    onClick={() => setShowAddModal(true)}
                    className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-xl font-medium hover:bg-indigo-700 transition-colors"
                >
                    <Plus size={20} />
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
                
                <div className="relative">
                    <button 
                        onClick={() => setShowRiskFilter(!showRiskFilter)}
                        className="flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
                    >
                        <Filter size={20} />
                        Risk: {filterRisk}
                    </button>
                    {showRiskFilter && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-slate-100 py-1 z-10">
                            {['All', 'High Risk', 'Medium Risk', 'Low Risk'].map(risk => (
                                <button
                                    key={risk}
                                    onClick={() => {
                                        setFilterRisk(risk);
                                        setShowRiskFilter(false);
                                    }}
                                    className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-50 ${
                                        filterRisk === risk ? 'text-indigo-600 font-medium' : 'text-slate-700'
                                    }`}
                                >
                                    {risk}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
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

            {/* Registration Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center sticky top-0 bg-white z-10">
                            <h2 className="text-xl font-bold text-slate-900">Add New Patient</h2>
                            <button 
                                onClick={() => setShowAddModal(false)}
                                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        
                        <form onSubmit={handleAddPatient} className="p-6 space-y-6">
                            {/* Personal Details */}
                            <div>
                                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Personal Details</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                                        <input required type="text" value={newPatient.full_name} onChange={e => setNewPatient({...newPatient, full_name: e.target.value})} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                                        <input required type="email" value={newPatient.email} onChange={e => setNewPatient({...newPatient, email: e.target.value})} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Age</label>
                                        <input required type="number" value={newPatient.age} onChange={e => setNewPatient({...newPatient, age: e.target.value})} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Blood Group</label>
                                        <select value={newPatient.blood_group} onChange={e => setNewPatient({...newPatient, blood_group: e.target.value})} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20">
                                            <option value="A+">A+</option><option value="A-">A-</option>
                                            <option value="B+">B+</option><option value="B-">B-</option>
                                            <option value="O+">O+</option><option value="O-">O-</option>
                                            <option value="AB+">AB+</option><option value="AB-">AB-</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Obstetric History */}
                            <div>
                                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Obstetric Baselines</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Gravida</label>
                                        <input required type="number" min="1" value={newPatient.gravida} onChange={e => setNewPatient({...newPatient, gravida: e.target.value})} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Parity</label>
                                        <input required type="number" min="0" value={newPatient.parity} onChange={e => setNewPatient({...newPatient, parity: e.target.value})} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Living Children</label>
                                        <input required type="number" min="0" value={newPatient.living_children} onChange={e => setNewPatient({...newPatient, living_children: e.target.value})} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Height (cm)</label>
                                        <input type="number" step="0.1" value={newPatient.height_cm} onChange={e => setNewPatient({...newPatient, height_cm: e.target.value})} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Pre-Preg Weight (kg)</label>
                                        <input type="number" step="0.1" value={newPatient.pre_pregnancy_weight_kg} onChange={e => setNewPatient({...newPatient, pre_pregnancy_weight_kg: e.target.value})} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20" />
                                    </div>
                                </div>
                            </div>

                            {/* Optional Initial Vitals */}
                            <div>
                                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Initial Vitals (Optional)</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Systolic BP</label>
                                        <input type="number" placeholder="e.g. 120" value={newPatient.systolic_bp} onChange={e => setNewPatient({...newPatient, systolic_bp: e.target.value})} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Diastolic BP</label>
                                        <input type="number" placeholder="e.g. 80" value={newPatient.diastolic_bp} onChange={e => setNewPatient({...newPatient, diastolic_bp: e.target.value})} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Blood Sugar</label>
                                        <input type="number" step="0.1" placeholder="e.g. 90" value={newPatient.blood_sugar} onChange={e => setNewPatient({...newPatient, blood_sugar: e.target.value})} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Heart Rate</label>
                                        <input type="number" placeholder="e.g. 75" value={newPatient.heart_rate} onChange={e => setNewPatient({...newPatient, heart_rate: e.target.value})} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Body Temp (°F)</label>
                                        <input type="number" step="0.1" placeholder="e.g. 98.6" value={newPatient.body_temp} onChange={e => setNewPatient({...newPatient, body_temp: e.target.value})} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20" />
                                    </div>
                                </div>
                                <p className="text-xs text-slate-500 mt-2">Providing all vitals will instantly trigger triage and risk assessment.</p>
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                                <button
                                    type="button"
                                    onClick={() => setShowAddModal(false)}
                                    className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-50 rounded-xl transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                                >
                                    {isSubmitting ? <RefreshCw size={16} className="animate-spin" /> : <Plus size={16} />}
                                    Save Patient
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PatientDirectory;
