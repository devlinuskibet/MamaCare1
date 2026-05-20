import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Heart, User, Calendar, Lock, Mail, ArrowRight, Stethoscope, Baby, ArrowLeft } from 'lucide-react';
import { useUserRole } from '../../contexts/UserContext';

const SignupPage = () => {
    const navigate = useNavigate();
    const { signup } = useUserRole();
    const [loading, setLoading] = useState(false);
    const [role, setRole] = useState<'mother' | 'provider'>('mother');
    const [error, setError] = useState('');

    // Form State
    const [formData, setFormData] = useState({
        full_name: '',
        email: '',
        password: '',
        lmp: '' // Last Menstrual Period
    });

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await signup({
                email: formData.email,
                password: formData.password,
                full_name: formData.full_name,
                role: role,
                ...(role === 'mother' && formData.lmp ? { lmp: formData.lmp } : {})
            });
            navigate('/login'); // Redirect to login after signup
        } catch (err) {
            console.error(err);
            setError('Signup failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-pink-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative">
            
            {/* Minimal Navigation Bar */}
            <div className="absolute top-0 left-0 w-full p-4 lg:p-8 flex justify-between items-center z-10">
                <Link to="/" className="flex items-center gap-2 group">
                    <div className="bg-white p-2 rounded-xl shadow-sm border border-pink-100 group-hover:shadow-md transition-shadow">
                        <Heart size={24} className="text-pink-600 fill-pink-600" />
                    </div>
                    <span className="text-xl font-bold bg-gradient-to-r from-pink-600 to-rose-500 bg-clip-text text-transparent hidden sm:block">
                        MamaCare
                    </span>
                </Link>

                <Link to="/" className="flex items-center gap-2 px-4 py-2 bg-white/60 hover:bg-white text-slate-600 font-medium text-sm rounded-full backdrop-blur-sm border border-slate-200 transition-all hover:shadow-sm hover:text-pink-600">
                    <ArrowLeft size={16} />
                    Back to Website
                </Link>
            </div>

            <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
                <Heart size={48} className="mx-auto text-pink-600" />
                <h2 className="mt-6 text-3xl font-extrabold text-slate-800">
                    Join MamaCare
                </h2>
                <p className="mt-2 text-sm text-slate-600">
                    Start your personalized journey today
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow-xl sm:rounded-2xl sm:px-10 border border-slate-100">
                    {/* Role Toggles */}
                    <div className="flex bg-slate-100 p-1 rounded-xl mb-6">
                        <button
                            type="button"
                            onClick={() => setRole('mother')}
                            className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all flex items-center justify-center gap-2 ${role === 'mother'
                                ? 'bg-white text-pink-600 shadow-sm'
                                : 'text-slate-500 hover:text-slate-700'
                                }`}
                        >
                            <Baby size={18} />
                            I'm a Mother
                        </button>
                        <button
                            type="button"
                            onClick={() => setRole('provider')}
                            className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all flex items-center justify-center gap-2 ${role === 'provider'
                                ? 'bg-white text-blue-600 shadow-sm'
                                : 'text-slate-500 hover:text-slate-700'
                                }`}
                        >
                            <Stethoscope size={18} />
                            I'm a Provider
                        </button>
                    </div>

                    <form className="space-y-6" onSubmit={handleSignup}>
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                                {error}
                            </div>
                        )}
                        {/* Full Name */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700">Full Name</label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <User className="h-5 w-5 text-slate-400" />
                                </div>
                                <input
                                    type="text"
                                    required
                                    className="block w-full pl-10 px-3 py-3 border border-slate-300 rounded-xl focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
                                    placeholder="Jane Doe"
                                    value={formData.full_name}
                                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700">Email Address</label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-slate-400" />
                                </div>
                                <input
                                    type="email"
                                    required
                                    className="block w-full pl-10 px-3 py-3 border border-slate-300 rounded-xl focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
                                    placeholder="jane@example.com"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700">Password</label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-slate-400" />
                                </div>
                                <input
                                    type="password"
                                    required
                                    className="block w-full pl-10 px-3 py-3 border border-slate-300 rounded-xl focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                />
                            </div>
                        </div>

                        {/* Conditional LMP Field for Mothers */}
                        {role === 'mother' && (
                            <div className="animate-in fade-in slide-in-from-top-4 duration-500">
                                <label className="block text-sm font-medium text-slate-700">
                                    Last Menstrual Period (LMP)
                                </label>
                                <p className="text-xs text-slate-500 mb-2">We use this to calculate your gestation week.</p>
                                <div className="mt-1 relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Calendar className="h-5 w-5 text-slate-400" />
                                    </div>
                                    <input
                                        type="date"
                                        required={role === 'mother'}
                                        className="block w-full pl-10 px-3 py-3 border border-slate-300 rounded-xl focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
                                        value={formData.lmp}
                                        onChange={(e) => setFormData({ ...formData, lmp: e.target.value })}
                                    />
                                </div>
                            </div>
                        )}

                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 transition-all"
                            >
                                {loading ? 'Creating Account...' : 'Get Started'}
                                {!loading && <ArrowRight className="ml-2 h-4 w-4" />}
                            </button>
                        </div>
                    </form>

                    <div className="mt-6 text-center">
                        <Link to="/login" className="text-gray-500 hover:text-gray-700 font-medium text-sm">
                            Already have an account? Sign in
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignupPage;
