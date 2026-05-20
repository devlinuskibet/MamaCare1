import { useState, useEffect } from 'react';
import { useUserRole } from '../../contexts/UserContext';
import { User, Calendar, Phone, FileText, Building, BadgeCheck, Save, Edit3, RefreshCw, Activity, AlertTriangle, Droplet, Info } from 'lucide-react';
import { endpoints } from '../../api/endpoints';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
    const { userRole, setIsProfileComplete } = useUserRole();
    const navigate = useNavigate();
    const [profile, setProfile] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    
    // Auto-edit mode if profile is incomplete
    useEffect(() => {
        if (profile && userRole === 'mother' && !profile.is_profile_complete) {
            setIsEditing(true);
        }
    }, [profile, userRole]);

    const [formData, setFormData] = useState<any>({
        phone: '', location: '', emergency_contact: '', hospital_name: '', specialization: '', lmp: '',
        age: '', gravida: '', parity: '', living_children: '', blood_group: 'O+', height_cm: '', pre_pregnancy_weight_kg: '',
        has_diabetes: false, has_hypertension: false, has_asthma: false, has_epilepsy: false, prev_csection: false
    });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        setIsLoading(true);
        try {
            const res = await endpoints.user.getMe();
            setProfile(res.data);
            setFormData({
                phone: res.data.phone || '',
                location: res.data.location || '',
                emergency_contact: res.data.emergency_contact || '',
                hospital_name: res.data.hospital_name || '',
                specialization: res.data.specialization || '',
                lmp: res.data.lmp || '',
                age: res.data.age || '',
                gravida: res.data.gravida !== null ? res.data.gravida : '',
                parity: res.data.parity !== null ? res.data.parity : '',
                living_children: res.data.living_children !== null ? res.data.living_children : '',
                blood_group: res.data.blood_group || 'O+',
                height_cm: res.data.height_cm || '',
                pre_pregnancy_weight_kg: res.data.pre_pregnancy_weight_kg || '',
                has_diabetes: res.data.has_diabetes || false,
                has_hypertension: res.data.has_hypertension || false,
                has_asthma: res.data.has_asthma || false,
                has_epilepsy: res.data.has_epilepsy || false,
                prev_csection: res.data.prev_csection || false
            });
        } catch (err) {
            console.error("Failed to load profile", err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const payload = { ...formData };
            if (!payload.lmp) delete payload.lmp;
            
            // Clean numbers before sending
            payload.age = payload.age ? Number(payload.age) : undefined;
            payload.gravida = payload.gravida !== '' ? Number(payload.gravida) : undefined;
            payload.parity = payload.parity !== '' ? Number(payload.parity) : undefined;
            payload.living_children = payload.living_children !== '' ? Number(payload.living_children) : undefined;
            payload.height_cm = payload.height_cm ? Number(payload.height_cm) : undefined;
            payload.pre_pregnancy_weight_kg = payload.pre_pregnancy_weight_kg ? Number(payload.pre_pregnancy_weight_kg) : undefined;
            
            // Explicitly set gatekeeper flag
            if (userRole === 'mother') {
                payload.is_profile_complete = true;
            }

            await endpoints.user.updateProfile(payload);
            setIsEditing(false);
            await fetchProfile();
            
            if (userRole === 'mother') {
                setIsProfileComplete(true);
                navigate('/dashboard');
            }
        } catch (err) {
            console.error(err);
            alert("Failed to update profile. Please ensure all required fields are filled correctly.");
        } finally {
            setIsSaving(false);
        }
    };
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
        setFormData({ ...formData, [e.target.name]: value });
    };

    if (isLoading || !profile) {
        return (
            <div className="flex justify-center items-center h-[60vh]">
                <RefreshCw size={40} className="animate-spin text-indigo-600" />
            </div>
        );
    }

    // --- DOCTOR RENDER ---
    if (userRole === 'provider') {
        return (
            <div className="space-y-6 animate-in fade-in duration-300">
                <h1 className="text-3xl font-bold text-slate-900">Doctor Profile</h1>
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="h-32 bg-gradient-to-r from-slate-700 to-slate-900" />
                    <div className="px-8 pb-8">
                        <div className="relative flex items-end -mt-12 mb-6">
                            <div className="p-1.5 bg-white rounded-full">
                                <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center border border-slate-200">
                                    <User size={40} className="text-slate-400" />
                                </div>
                            </div>
                            <div className="ml-6 mb-2">
                                <h2 className="text-2xl font-bold text-slate-900">{profile.full_name}</h2>
                                <p className="text-slate-500">{profile.email} {profile.specialization ? `• ${profile.specialization}` : ''}</p>
                            </div>
                            <div className="ml-auto mb-4">
                                {!isEditing ? (
                                    <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-lg text-slate-600 font-medium hover:bg-slate-50 transition-colors">
                                        <Edit3 size={18} /> Edit Details
                                    </button>
                                ) : (
                                    <div className="flex gap-2">
                                        <button onClick={() => setIsEditing(false)} className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-50 rounded-lg">Cancel</button>
                                        <button onClick={handleSave} disabled={isSaving} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50">
                                            {isSaving ? <RefreshCw size={18} className="animate-spin" /> : <Save size={18} />} Save Changes
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-6">
                                <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2"><BadgeCheck className="text-indigo-500" size={20} /> Practice Details</h3>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
                                        <FileText className="text-slate-400" size={20} />
                                        <div className="flex-1">
                                            <p className="text-sm text-slate-500">Specialization</p>
                                            {isEditing ? <input type="text" name="specialization" value={formData.specialization} onChange={handleChange} className="mt-1 w-full px-3 py-1.5 border rounded-lg focus:ring-2 focus:ring-indigo-500/20 outline-none" /> : <p className="font-medium text-slate-900">{profile.specialization || 'Not Specified'}</p>}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
                                        <Building className="text-slate-400" size={20} />
                                        <div className="flex-1">
                                            <p className="text-sm text-slate-500">Hospital Affiliation</p>
                                            {isEditing ? <input type="text" name="hospital_name" value={formData.hospital_name} onChange={handleChange} className="mt-1 w-full px-3 py-1.5 border rounded-lg focus:ring-2 focus:ring-indigo-500/20 outline-none" /> : <p className="font-medium text-slate-900">{profile.hospital_name || 'Not Specified'}</p>}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-6">
                                <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2"><Phone className="text-indigo-500" size={20} /> Contact Details</h3>
                                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                                    <p className="text-sm text-slate-500 mb-1">Personal Phone</p>
                                    {isEditing ? <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full px-3 py-1.5 border rounded-lg focus:ring-2 outline-none focus:ring-indigo-500/20 focus:border-indigo-500" /> : <p className="font-medium text-slate-900">{profile.phone || 'Not Specified'}</p>}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // --- MOTHER RENDER (Antenatal Card Layout) ---
    return (
        <div className="space-y-8 animate-in fade-in duration-300 max-w-5xl mx-auto">
            {/* Header / Intro */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Clinical Profile</h1>
                    <p className="text-slate-500 mt-1">Please complete your Antenatal Card to access the dashboard and precision AI insights.</p>
                </div>
                <div>
                    {!isEditing ? (
                        <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 px-6 py-2.5 border-2 border-slate-200 rounded-xl text-slate-700 font-bold hover:bg-slate-50 transition-colors">
                            <Edit3 size={18} /> Update Card
                        </button>
                    ) : (
                        <div className="flex gap-3">
                            {profile.is_profile_complete && <button onClick={() => setIsEditing(false)} className="px-6 py-2.5 text-slate-600 font-bold hover:bg-slate-50 rounded-xl">Cancel</button>}
                            
                            <button onClick={handleSave} disabled={isSaving} className="flex items-center gap-2 px-8 py-2.5 bg-pink-600 text-white rounded-xl font-bold hover:bg-pink-700 hover:shadow-lg hover:shadow-pink-500/20 transition-all disabled:opacity-50">
                                {isSaving ? <RefreshCw size={18} className="animate-spin" /> : <Save size={18} />} Save & Continue
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Profile Gatekeeper Warning */}
            {(!profile.is_profile_complete) && (
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-4 text-amber-800">
                    <AlertTriangle className="shrink-0 mt-0.5" />
                    <div>
                        <h4 className="font-bold">Mandated Onboarding</h4>
                        <p className="text-sm opacity-90 mt-1">You must fill out your clinical baselines (Age, Blood Group, Obstetric History) before generating predictions or talking to the chatbot.</p>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* 1. PERSONAL HEADER */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-pink-50 rounded-bl-full -z-10 opacity-50" />
                    <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
                        <User className="text-pink-500" size={20} /> Personal Information
                    </h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-slate-600 mb-1">Full Name</label>
                            <input type="text" disabled value={profile.full_name} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-500 cursor-not-allowed" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-slate-600 mb-1">Phone</label>
                                {isEditing ? <input name="phone" value={formData.phone} onChange={handleChange} className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 outline-none" /> : <p className="font-medium text-slate-900 px-4 py-2 bg-slate-50 rounded-xl border border-transparent">{profile.phone || '—'}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-600 mb-1">Location / Zone</label>
                                {isEditing ? <input name="location" value={formData.location} onChange={handleChange} className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 outline-none" /> : <p className="font-medium text-slate-900 px-4 py-2 bg-slate-50 rounded-xl border border-transparent">{profile.location || '—'}</p>}
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-600 mb-1">Emergency Contact</label>
                            {isEditing ? <input name="emergency_contact" value={formData.emergency_contact} onChange={handleChange} placeholder="Name & Phone" className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 outline-none" /> : <p className="font-medium text-slate-900 px-4 py-2 bg-slate-50 rounded-xl border border-transparent">{profile.emergency_contact || '—'}</p>}
                        </div>
                    </div>
                </div>

                {/* 2. CLINICAL VITALS BASELINE */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-full -z-10 opacity-50" />
                    <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
                        <Activity className="text-blue-500" size={20} /> Clinical Vitals Baseline
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-slate-600 mb-1">Age</label>
                            {isEditing ? <input type="number" name="age" value={formData.age} onChange={handleChange} placeholder="Required" className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none" /> : <p className="font-medium text-slate-900 px-4 py-2 bg-slate-50 rounded-xl border border-transparent">{profile.age || '—'}</p>}
                        </div>
                        <div>
                            <label className="text-sm font-semibold text-slate-600 mb-1 flex items-center gap-1 group relative cursor-help w-max">
                                Blood Group <Info size={14} className="text-slate-400" />
                                <span className="absolute bottom-full mb-2 left-0 w-64 bg-slate-800 text-white text-xs p-2.5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 shadow-xl">
                                    Your blood type (A, B, AB, or O) and Rhesus factor (+ or -). Essential for emergency safety.
                                </span>
                            </label>
                            {isEditing ? (
                                <select name="blood_group" value={formData.blood_group} onChange={handleChange} className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none bg-white">
                                    <option value="A+">A+</option>
                                    <option value="A-">A-</option>
                                    <option value="B+">B+</option>
                                    <option value="B-">B-</option>
                                    <option value="AB+">AB+</option>
                                    <option value="AB-">AB-</option>
                                    <option value="O+">O+</option>
                                    <option value="O-">O-</option>
                                    <option value="Unknown">Unknown</option>
                                </select>
                            ) : <p className="font-medium text-slate-900 px-4 py-2 bg-slate-50 rounded-xl border border-transparent">{profile.blood_group || 'O+'}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-600 mb-1">Height (cm)</label>
                            {isEditing ? <input type="number" step="0.1" name="height_cm" value={formData.height_cm} onChange={handleChange} className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none" /> : <p className="font-medium text-slate-900 px-4 py-2 bg-slate-50 rounded-xl border border-transparent">{profile.height_cm ? `${profile.height_cm} cm` : '—'}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-600 mb-1">Weight (kg)</label>
                            {isEditing ? <input type="number" step="0.1" name="pre_pregnancy_weight_kg" value={formData.pre_pregnancy_weight_kg} onChange={handleChange} placeholder="Pre-pregnancy" className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none" /> : <p className="font-medium text-slate-900 px-4 py-2 bg-slate-50 rounded-xl border border-transparent">{profile.pre_pregnancy_weight_kg ? `${profile.pre_pregnancy_weight_kg} kg` : '—'}</p>}
                        </div>
                    </div>
                </div>

                {/* 3. OBSTETRIC SUMMARY */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-purple-50 rounded-bl-full -z-10 opacity-50" />
                    <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
                        <Calendar className="text-purple-500" size={20} /> Obstetric Summary
                    </h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-slate-600 mb-1">Last Menstrual Period (LMP)</label>
                            {isEditing ? <input type="date" name="lmp" value={formData.lmp} onChange={handleChange} className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none" /> : <p className="font-medium text-slate-900 px-4 py-2 bg-slate-50 rounded-xl border border-transparent">{profile.lmp || '—'}</p>}
                            <p className="text-xs text-slate-400 mt-1 pl-1">Identifies current gestation weeks.</p>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-4 border-t border-slate-100 pt-4">
                            <div>
                                <label className="text-sm font-semibold text-slate-600 mb-1 flex items-center gap-1 group relative cursor-help w-max">
                                    Gravida <Info size={14} className="text-slate-400" />
                                    <span className="absolute bottom-full mb-2 -left-4 w-48 bg-slate-800 text-white text-xs p-2.5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 shadow-xl">
                                        Total number of pregnancies you have ever had (including this one).
                                    </span>
                                </label>
                                {isEditing ? <input type="number" name="gravida" value={formData.gravida} onChange={handleChange} placeholder="Total" className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none" /> : <p className="font-medium text-slate-900 px-4 py-2 bg-slate-50 rounded-xl border border-transparent">{profile.gravida !== null ? profile.gravida : '—'}</p>}
                            </div>
                            <div>
                                <label className="text-sm font-semibold text-slate-600 mb-1 flex items-center gap-1 group relative cursor-help w-max">
                                    Parity <Info size={14} className="text-slate-400" />
                                    <span className="absolute bottom-full mb-2 -left-12 w-48 bg-slate-800 text-white text-xs p-2.5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 shadow-xl">
                                        Number of pregnancies that lasted at least 20 weeks.
                                    </span>
                                </label>
                                {isEditing ? <input type="number" name="parity" value={formData.parity} onChange={handleChange} placeholder="> 20wks" className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none" /> : <p className="font-medium text-slate-900 px-4 py-2 bg-slate-50 rounded-xl border border-transparent">{profile.parity !== null ? profile.parity : '—'}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-600 mb-1">Living</label>
                                {isEditing ? <input type="number" name="living_children" value={formData.living_children} onChange={handleChange} placeholder="Kids" className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none" /> : <p className="font-medium text-slate-900 px-4 py-2 bg-slate-50 rounded-xl border border-transparent">{profile.living_children !== null ? profile.living_children : '—'}</p>}
                            </div>
                        </div>
                    </div>
                </div>

                {/* 4. MEDICAL HISTORY */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-bl-full -z-10 opacity-50" />
                    <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
                        <Droplet className="text-emerald-500" size={20} /> Medical History Flags
                    </h3>
                    
                    <div className="space-y-3">
                        {[
                            { id: 'has_diabetes', label: 'Pre-existing Diabetes' },
                            { id: 'has_hypertension', label: 'Chronic Hypertension' },
                            { id: 'has_asthma', label: 'Asthma' },
                            { id: 'has_epilepsy', label: 'Epilepsy' },
                            { id: 'prev_csection', label: 'Previous Caesarean Section' }
                        ].map((condition) => (
                            <label key={condition.id} className={`flex items-center justify-between p-3 rounded-xl border transition-colors ${isEditing ? 'cursor-pointer hover:bg-slate-50 border-slate-200' : 'border-transparent bg-slate-50'}`}>
                                <span className={`font-medium ${formData[condition.id] ? 'text-emerald-700' : 'text-slate-600'}`}>{condition.label}</span>
                                {isEditing ? (
                                    <input 
                                        type="checkbox" 
                                        name={condition.id} 
                                        checked={formData[condition.id]} 
                                        onChange={handleChange}
                                        className="w-5 h-5 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
                                    />
                                ) : (
                                    <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${formData[condition.id] ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-500'}`}>
                                        {formData[condition.id] ? 'Yes' : 'No'}
                                    </div>
                                )}
                            </label>
                        ))}
                    </div>
                </div>
            </div>
            
        </div>
    );
};

export default ProfilePage;
