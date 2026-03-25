import { useState, useEffect } from 'react';
import { useUserRole } from '../../contexts/UserContext';
import { User, Calendar, Phone, Heart, FileText, Building, BadgeCheck, Save, Edit3, RefreshCw } from 'lucide-react';
import { endpoints } from '../../api/endpoints';

const ProfilePage = () => {
    const { userRole } = useUserRole();
    const [profile, setProfile] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    
    const [formData, setFormData] = useState({
        phone: '',
        location: '',
        emergency_contact: '',
        hospital_name: '',
        specialization: '',
        lmp: ''
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
                lmp: res.data.lmp || ''
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
            if (!payload.lmp) {
                delete (payload as any).lmp;
            }
            await endpoints.user.updateProfile(payload);
            setIsEditing(false);
            await fetchProfile();
            alert("Profile updated successfully!");
        } catch (err) {
            console.error(err);
            alert("Failed to update profile.");
        } finally {
            setIsSaving(false);
        }
    };
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    if (isLoading || !profile) {
        return (
            <div className="flex justify-center items-center h-[60vh]">
                <RefreshCw size={40} className="animate-spin text-indigo-600" />
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-300">
            <h1 className="text-3xl font-bold text-slate-900">
                {userRole === 'provider' ? 'Doctor Profile' : 'My Profile'}
            </h1>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                {/* Header Banner */}
                <div className={`h-32 ${userRole === 'provider' ? 'bg-gradient-to-r from-slate-700 to-slate-900' : 'bg-gradient-to-r from-pink-400 to-rose-400'}`} />

                <div className="px-8 pb-8">
                    <div className="relative flex items-end -mt-12 mb-6">
                        <div className="p-1.5 bg-white rounded-full">
                            <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center border border-slate-200">
                                <User size={40} className="text-slate-400" />
                            </div>
                        </div>
                        <div className="ml-6 mb-2">
                            <h2 className="text-2xl font-bold text-slate-900">
                                {profile.full_name}
                            </h2>
                            <p className="text-slate-500">
                                {profile.email} {userRole === 'provider' && profile.specialization ? `• ${profile.specialization}` : ''}
                            </p>
                        </div>
                        
                        <div className="ml-auto mb-4">
                            {!isEditing ? (
                                <button 
                                    onClick={() => setIsEditing(true)}
                                    className="flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-lg text-slate-600 font-medium hover:bg-slate-50 transition-colors"
                                >
                                    <Edit3 size={18} /> Edit Details
                                </button>
                            ) : (
                                <div className="flex gap-2">
                                    <button 
                                        onClick={() => setIsEditing(false)}
                                        className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-50 rounded-lg transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        onClick={handleSave}
                                        disabled={isSaving}
                                        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50"
                                    >
                                        {isSaving ? <RefreshCw size={18} className="animate-spin" /> : <Save size={18} />}
                                        Save Changes
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Left Column */}
                        <div className="space-y-6">
                            <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                                {userRole === 'provider' ? <BadgeCheck className="text-indigo-500" size={20} /> : <Heart className="text-pink-500" size={20} />}
                                {userRole === 'provider' ? 'Practice Details' : 'Maternal Details'}
                            </h3>

                            <div className="space-y-4">
                                {userRole === 'mother' ? (
                                    <>
                                        <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
                                            <Calendar className="text-slate-400" size={20} />
                                            <div className="flex-1">
                                                <p className="text-sm text-slate-500">Last Menstrual Period (LMP)</p>
                                                {isEditing ? (
                                                    <input type="date" name="lmp" value={formData.lmp} onChange={handleChange} className="mt-1 w-full px-3 py-1.5 border rounded-lg focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 outline-none" />
                                                ) : (
                                                    <p className="font-medium text-slate-900">{profile.lmp || 'Not Specified'}</p>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
                                            <Building className="text-slate-400" size={20} />
                                            <div className="flex-1">
                                                <p className="text-sm text-slate-500">Location</p>
                                                {isEditing ? (
                                                    <input type="text" name="location" value={formData.location} onChange={handleChange} className="mt-1 w-full px-3 py-1.5 border rounded-lg focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 outline-none" placeholder="e.g. Nairobi" />
                                                ) : (
                                                    <p className="font-medium text-slate-900">{profile.location || 'Not Specified'}</p>
                                                )}
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
                                            <FileText className="text-slate-400" size={20} />
                                            <div className="flex-1">
                                                <p className="text-sm text-slate-500">Specialization</p>
                                                {isEditing ? (
                                                    <input type="text" name="specialization" value={formData.specialization} onChange={handleChange} className="mt-1 w-full px-3 py-1.5 border rounded-lg focus:ring-2 focus:ring-indigo-500/20 outline-none" placeholder="e.g. OBGYN" />
                                                ) : (
                                                    <p className="font-medium text-slate-900">{profile.specialization || 'Not Specified'}</p>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
                                            <Building className="text-slate-400" size={20} />
                                            <div className="flex-1">
                                                <p className="text-sm text-slate-500">Hospital Affiliation</p>
                                                {isEditing ? (
                                                    <input type="text" name="hospital_name" value={formData.hospital_name} onChange={handleChange} className="mt-1 w-full px-3 py-1.5 border rounded-lg focus:ring-2 focus:ring-indigo-500/20 outline-none" placeholder="e.g. City General Hospital" />
                                                ) : (
                                                    <p className="font-medium text-slate-900">{profile.hospital_name || 'Not Specified'}</p>
                                                )}
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Right Column */}
                        <div className="space-y-6">
                            <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                                <Phone className={userRole === 'provider' ? 'text-indigo-500' : 'text-pink-500'} size={20} />
                                Contact Details
                            </h3>

                            <div className="space-y-4">
                                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                                    <p className="text-sm text-slate-500 mb-1">Personal Phone</p>
                                    {isEditing ? (
                                        <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className={`w-full px-3 py-1.5 border rounded-lg focus:ring-2 outline-none ${userRole === 'provider' ? 'focus:ring-indigo-500/20 focus:border-indigo-500' : 'focus:ring-pink-500/20 focus:border-pink-500'}`} placeholder="+254 700 000000" />
                                    ) : (
                                        <p className="font-medium text-slate-900">{profile.phone || 'Not Specified'}</p>
                                    )}
                                </div>
                                
                                {userRole === 'mother' && (
                                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                                        <p className="text-sm text-slate-500 mb-1">Emergency Contact</p>
                                        {isEditing ? (
                                            <input type="text" name="emergency_contact" value={formData.emergency_contact} onChange={handleChange} className="w-full px-3 py-1.5 border rounded-lg focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 outline-none" placeholder="Name & Phone" />
                                        ) : (
                                            <p className="font-medium text-slate-900">{profile.emergency_contact || 'Not Specified'}</p>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
