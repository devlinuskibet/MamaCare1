import { useState } from 'react';
import { useUserRole } from '../../contexts/UserContext';
import { endpoints } from '../../api/endpoints';
import { ShieldAlert, CheckCircle2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const ConsentOverlay = () => {
    const { setHasConsented } = useUserRole();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleConsent = async () => {
        setLoading(true);
        try {
            await endpoints.user.updateProfile({ has_consented: true });
            setHasConsented(true);
            navigate('/profile');
        } catch (error) {
            console.error(error);
            alert("Failed to save consent.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4 animate-in fade-in zoom-in-95 duration-300">
            <div className="bg-white max-w-lg w-full rounded-3xl shadow-2xl p-8 space-y-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-bl-full -z-10 opacity-50" />
                <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white shadow-sm">
                    <ShieldAlert size={32} />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 text-center">Data Privacy & Consent</h2>
                
                <div className="text-slate-600 space-y-4 text-sm leading-relaxed bg-slate-50 p-6 rounded-2xl border border-slate-100">
                    <p>
                        Welcome to MamaCare! Before you proceed, we need your consent to process your clinical information.
                    </p>
                    <p>
                        Your health baselines (Age, BP, Glucose, etc) will be analyzed by our AI triage models to provide precise risk predictions and generate personalized obstetric reports.
                    </p>
                    <p>
                        By continuing, you confirm that you have read and agree to our{' '}
                        <Link to="/terms" target="_blank" className="text-indigo-600 font-bold hover:underline">
                            Terms & Conditions
                        </Link>.
                    </p>
                </div>
                
                <button 
                    onClick={handleConsent} 
                    disabled={loading}
                    className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                    {loading ? 'Processing...' : <><CheckCircle2 size={20} /> I Consent & Continue</>}
                </button>
            </div>
        </div>
    );
};

export default ConsentOverlay;
