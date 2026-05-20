import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Heart, Stethoscope, ArrowRight, Baby, ArrowLeft } from 'lucide-react';
import { useUserRole } from '../../contexts/UserContext';
import { GoogleLogin } from '@react-oauth/google';

const LoginPage = () => {
    const navigate = useNavigate();
    const { login, googleLogin } = useUserRole();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [role, setRole] = useState<'mother' | 'provider'>('mother');

    // Form State
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const result = await login({ username: formData.email, password: formData.password });
            if (result === 'needs_otp') {
                navigate('/otp');
            } else if (role === 'provider') {
                navigate('/provider');
            } else {
                navigate('/dashboard');
            }
        } catch (err) {
            console.error(err);
            setError('Invalid email or password. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSuccess = async (credentialResponse: any) => {
        setLoading(true);
        setError('');
        try {
            const result = await googleLogin(credentialResponse.credential);
            if (result === 'needs_otp') navigate('/otp');
        } catch (err: any) {
            setError(err.message || 'Google Sign-In failed.');
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
                <div className="mx-auto h-16 w-16 bg-pink-600 rounded-full flex items-center justify-center text-white shadow-lg animate-pulse">
                    {role === 'mother' ? <Heart size={32} /> : <Stethoscope size={32} />}
                </div>
                <h2 className="mt-6 text-3xl font-extrabold text-slate-800">
                    Welcome Back, {role === 'mother' ? 'Mama' : 'Doctor'}
                </h2>
                <p className="mt-2 text-sm text-slate-600">
                    Sign in to access your {role === 'mother' ? 'pregnancy journey' : 'patient records'}
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

                    <form className="space-y-6" onSubmit={handleLogin}>
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                                {error}
                            </div>
                        )}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-slate-700">
                                Email address
                            </label>
                            <div className="mt-1">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    className="appearance-none block w-full px-3 py-3 border border-slate-300 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-slate-700">
                                Password
                            </label>
                            <div className="mt-1">
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    className="appearance-none block w-full px-3 py-3 border border-slate-300 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                />
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all ${role === 'mother'
                                    ? 'bg-pink-600 hover:bg-pink-700 focus:ring-pink-500'
                                    : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
                                    }`}
                            >
                                {loading ? 'Signing in...' : 'Sign In'}
                                {!loading && <ArrowRight className="ml-2 h-4 w-4" />}
                            </button>
                        </div>
                    </form>

                    <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-slate-200" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-slate-500">Or continue with</span>
                            </div>
                        </div>

                        {/* Google Login Button */}
                        <div className="mt-4 flex justify-center">
                            <GoogleLogin
                                onSuccess={handleGoogleSuccess}
                                onError={() => setError('Google Sign-In was cancelled or failed.')}
                                theme="outline"
                                size="large"
                                text="signin_with"
                                shape="rectangular"
                            />
                        </div>

                        <div className="mt-4 text-center">
                            <span className="text-slate-500 text-sm">New to MamaCare? </span>
                            <Link to="/signup" className="text-pink-600 hover:text-pink-500 font-medium text-sm">
                                Create an account
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
