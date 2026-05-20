import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, ShieldCheck, RefreshCw } from 'lucide-react';
import { useUserRole } from '../../contexts/UserContext';

const OtpPage = () => {
    const navigate = useNavigate();
    const { pendingOtpEmail, verifyOtp } = useUserRole();

    const [digits, setDigits] = useState(['', '', '', '', '', '']);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [resendCooldown, setResendCooldown] = useState(60);
    const [isResending, setIsResending] = useState(false);
    const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

    // Start 60s cooldown on mount
    useEffect(() => {
        if (!pendingOtpEmail) {
            navigate('/login');
            return;
        }
        const timer = setInterval(() => {
            setResendCooldown(prev => {
                if (prev <= 1) { clearInterval(timer); return 0; }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [pendingOtpEmail, navigate]);

    const handleDigitChange = (index: number, value: string) => {
        if (!/^\d?$/.test(value)) return; // only digits
        const updated = [...digits];
        updated[index] = value;
        setDigits(updated);
        // Auto-advance
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === 'Backspace' && !digits[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
        const updated = [...digits];
        pasted.split('').forEach((char, i) => { updated[i] = char; });
        setDigits(updated);
        inputRefs.current[Math.min(pasted.length, 5)]?.focus();
    };

    const handleVerify = async () => {
        const code = digits.join('');
        if (code.length !== 6) {
            setError('Please enter all 6 digits.');
            return;
        }
        setLoading(true);
        setError('');
        try {
            const result = await verifyOtp(code);
            if (result === 'provider') {
                navigate('/provider');
            } else if (result === 'needs_profile') {
                navigate('/profile');   // profile page gated by requireProfile=false
            } else {
                navigate('/dashboard');
            }
        } catch (err: any) {
            setError(err.message || 'Invalid code. Please try again.');
            setDigits(['', '', '', '', '', '']);
            inputRefs.current[0]?.focus();
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        if (resendCooldown > 0 || !pendingOtpEmail) return;
        setIsResending(true);
        try {
            await fetch('http://localhost:8000/api/auth/resend-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: pendingOtpEmail })
            });
            setResendCooldown(60);
            const timer = setInterval(() => {
                setResendCooldown(prev => {
                    if (prev <= 1) { clearInterval(timer); return 0; }
                    return prev - 1;
                });
            }, 1000);
        } catch {
            setError('Failed to resend code.');
        } finally {
            setIsResending(false);
        }
    };

    return (
        <div className="min-h-screen bg-pink-50 flex flex-col items-center justify-center px-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-100 p-8">
                {/* Icon */}
                <div className="flex justify-center mb-6">
                    <div className="w-16 h-16 bg-pink-600 rounded-full flex items-center justify-center shadow-lg">
                        <ShieldCheck size={32} className="text-white" />
                    </div>
                </div>

                <h1 className="text-2xl font-extrabold text-slate-800 text-center">Verify Your Identity</h1>
                <p className="mt-2 text-sm text-slate-500 text-center">
                    A 6-digit code was sent to<br />
                    <span className="font-semibold text-slate-700">{pendingOtpEmail}</span>
                </p>

                {/* 6 Digit Inputs */}
                <div className="flex justify-center gap-3 mt-8" onPaste={handlePaste}>
                    {digits.map((d, i) => (
                        <input
                            key={i}
                            ref={el => { inputRefs.current[i] = el; }}
                            type="text"
                            inputMode="numeric"
                            maxLength={1}
                            value={d}
                            onChange={e => handleDigitChange(i, e.target.value)}
                            onKeyDown={e => handleKeyDown(i, e)}
                            className="w-12 h-14 text-center text-2xl font-bold border-2 rounded-xl outline-none transition-all
                                focus:border-pink-500 focus:ring-4 focus:ring-pink-100
                                border-slate-200 text-slate-800 bg-slate-50"
                        />
                    ))}
                </div>

                {/* Error */}
                {error && (
                    <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl text-center">
                        {error}
                    </div>
                )}

                {/* Verify Button */}
                <button
                    onClick={handleVerify}
                    disabled={loading || digits.join('').length !== 6}
                    className="mt-6 w-full py-3 bg-pink-600 text-white font-bold rounded-xl hover:bg-pink-700 transition-all shadow-sm disabled:opacity-50 flex items-center justify-center gap-2"
                >
                    {loading ? <RefreshCw size={18} className="animate-spin" /> : <ShieldCheck size={18} />}
                    {loading ? 'Verifying...' : 'Verify & Sign In'}
                </button>

                {/* Resend */}
                <div className="mt-4 flex flex-col items-center gap-1">
                    <p className="text-xs text-slate-400">Didn't receive the code?</p>
                    <button
                        onClick={handleResend}
                        disabled={resendCooldown > 0 || isResending}
                        className="text-sm font-semibold text-pink-600 hover:text-pink-800 disabled:text-slate-400 disabled:cursor-not-allowed transition-colors"
                    >
                        {resendCooldown > 0
                            ? `Resend Code (${resendCooldown}s)`
                            : isResending ? 'Sending...' : 'Resend Code'}
                    </button>
                </div>

                {/* Footer */}
                <div className="mt-8 flex justify-center">
                    <div className="flex items-center gap-2 text-slate-400 text-xs">
                        <Heart size={12} className="text-pink-400 fill-pink-400" />
                        <span>MamaCare Clinical Security</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OtpPage;
