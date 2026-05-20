import { Link } from 'react-router-dom';
import {
    Activity,
    ChevronRight,
    BrainCircuit,
    Stethoscope,
    ShieldCheck,
    MessageCircle,
    Siren,
    Lock,
    Heart
} from 'lucide-react';

const LandingPage = () => {
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
            {/* Navigation */}
            <nav className="fixed w-full bg-white/80 backdrop-blur-md border-b border-slate-100 z-50">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="bg-pink-600 p-2 rounded-lg text-white">
                            <Activity size={20} />
                        </div>
                        <span className="text-xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                            MamaCare
                        </span>
                    </div>

                    <div className="flex items-center gap-4">
                        <Link to="/login" className="text-slate-600 font-semibold hover:text-slate-900 transition-colors">
                            Login
                        </Link>
                        <Link to="/signup" className="px-5 py-2.5 bg-slate-900 text-white font-semibold rounded-full hover:bg-slate-800 transition-all shadow-lg shadow-slate-200">
                            Get Started
                        </Link>
                    </div>
                </div>
            </nav>

            {/* 1. Hero Section */}
            <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden">
                <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" />
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-50 text-pink-700 text-sm font-semibold border border-pink-100 mb-8 animate-fade-in-up">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-pink-500"></span>
                        </span>
                        AI-Powered Maternal Health
                    </div>

                    <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight mb-8">
                        Intelligent Care for<br />
                        <span className="bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">Every Step of Your Pregnancy.</span>
                    </h1>

                    <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed">
                        MamaCare uses advanced AI to monitor your vitals, predict risks like pre-eclampsia, and keep you connected to your doctor 24/7.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link to="/login" className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-pink-600 to-purple-600 text-white font-bold rounded-2xl hover:shadow-xl hover:shadow-pink-200 transition-all hover:-translate-y-1 flex items-center justify-center gap-2">
                            Login to Portal
                            <ChevronRight size={20} />
                        </Link>
                        <Link to="/signup" className="w-full sm:w-auto px-8 py-4 bg-white text-slate-700 font-bold rounded-2xl border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all">
                            Get Started
                        </Link>
                    </div>
                </div>
            </section>

            {/* 2. How It Works Section */}
            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Proactive Care in 3 Simple Steps</h2>
                        <p className="text-slate-500 text-lg max-w-2xl mx-auto">From home monitoring to clinical intervention, we bridge the gap between you and your provider.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Card 1 */}
                        <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100 hover:shadow-lg transition-all duration-300 group">
                            <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center text-pink-600 mb-6 group-hover:scale-110 transition-transform">
                                <Activity size={28} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">1. Log Your Vitals</h3>
                            <p className="text-slate-600 leading-relaxed">
                                Easily record your Blood Pressure, Heart Rate, and Glucose from home in under 30 seconds.
                            </p>
                        </div>

                        {/* Card 2 */}
                        <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100 hover:shadow-lg transition-all duration-300 group">
                            <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center text-purple-600 mb-6 group-hover:scale-110 transition-transform">
                                <BrainCircuit size={28} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">2. AI Analysis</h3>
                            <p className="text-slate-600 leading-relaxed">
                                Our Machine Learning algorithms analyze your trends instantly to detect hidden risks.
                            </p>
                        </div>

                        {/* Card 3 */}
                        <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100 hover:shadow-lg transition-all duration-300 group">
                            <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center text-indigo-600 mb-6 group-hover:scale-110 transition-transform">
                                <Stethoscope size={28} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">3. Doctor Alerts</h3>
                            <p className="text-slate-600 leading-relaxed">
                                If a risk is detected, your provider is notified immediately for rapid intervention.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. Feature Deep-Dive (Zig-Zag) */}
            <section className="py-24 bg-slate-50 overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 space-y-24">

                    {/* Feature A: Traffic Light System */}
                    <div className="flex flex-col md:flex-row items-center gap-12 lg:gap-20">
                        <div className="flex-1 space-y-6">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-100 text-red-700 text-sm font-semibold">
                                <Siren size={14} />
                                Clinical Triage
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">Clinical Triage, Simplified.</h2>
                            <p className="text-lg text-slate-600 leading-relaxed">
                                No more guessing if your symptoms are normal. Our "Traffic Light" system gives you clear, immediate feedback: Green for safe, Red for urgent attention.
                            </p>
                            <ul className="space-y-3">
                                <li className="flex items-center gap-3 text-slate-700">
                                    <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-green-600"><ShieldCheck size={14} /></div>
                                    <span className="font-medium">Green: Normal Vitals</span>
                                </li>
                                <li className="flex items-center gap-3 text-slate-700">
                                    <div className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center text-amber-600"><Activity size={14} /></div>
                                    <span className="font-medium">Amber: Monitor Closely</span>
                                </li>
                                <li className="flex items-center gap-3 text-slate-700">
                                    <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center text-red-600"><Siren size={14} /></div>
                                    <span className="font-medium">Red: Immediate Care Required</span>
                                </li>
                            </ul>
                        </div>
                        <div className="flex-1 relative">
                            {/* Visual Placeholder for Traffic Light System */}
                            <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8 relative z-10">
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl border border-green-100">
                                        <div className="flex items-center gap-3">
                                            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                                            <span className="font-semibold text-green-900">Blood Pressure Normal</span>
                                        </div>
                                        <span className="text-green-700 font-bold">118/72</span>
                                    </div>
                                    <div className="flex items-center justify-between p-4 bg-red-50 rounded-xl border border-red-100 opacity-90">
                                        <div className="flex items-center gap-3">
                                            <div className="w-3 h-3 bg-red-500 rounded-full animate-ping" />
                                            <span className="font-semibold text-red-900">High Risk Alert</span>
                                        </div>
                                        <span className="text-red-700 font-bold">Notify Doctor</span>
                                    </div>
                                </div>
                            </div>
                            <div className="absolute top-10 -right-10 w-full h-full bg-pink-200/50 rounded-3xl -z-10 blur-3xl opacity-50" />
                        </div>
                    </div>

                    {/* Feature B: MamaAI */}
                    <div className="flex flex-col md:flex-row-reverse items-center gap-12 lg:gap-20">
                        <div className="flex-1 space-y-6">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-sm font-semibold">
                                <MessageCircle size={14} />
                                24/7 Support
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">Your 24/7 Health Companion.</h2>
                            <p className="text-lg text-slate-600 leading-relaxed">
                                Anxiety doesn't wait for office hours. Chat with MamaAI to get instant, medically-grounded answers to your pregnancy questions.
                            </p>
                            <div className="flex flex-wrap gap-3">
                                <span className="px-4 py-2 bg-white rounded-full border border-slate-200 text-slate-600 text-sm font-medium">"Is this cramp normal?"</span>
                                <span className="px-4 py-2 bg-white rounded-full border border-slate-200 text-slate-600 text-sm font-medium">"What can I eat?"</span>
                                <span className="px-4 py-2 bg-white rounded-full border border-slate-200 text-slate-600 text-sm font-medium">"Track my kicks"</span>
                            </div>
                        </div>
                        <div className="flex-1 relative">
                            {/* Visual Placeholder for Chat Interface */}
                            <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-6 relative z-10 max-w-sm mx-auto">
                                <div className="space-y-4">
                                    <div className="flex gap-3">
                                        <div className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center text-pink-600 flex-shrink-0"><MessageCircle size={16} /></div>
                                        <div className="bg-slate-100 rounded-2xl rounded-tl-none p-3 text-sm text-slate-700">
                                            Hello! How are you feeling today?
                                        </div>
                                    </div>
                                    <div className="flex gap-3 flex-row-reverse">
                                        <div className="w-8 h-8 rounded-full bg-slate-200 flex-shrink-0" />
                                        <div className="bg-pink-600 text-white rounded-2xl rounded-tr-none p-3 text-sm">
                                            I'm feeling a bit dizzy.
                                        </div>
                                    </div>
                                    <div className="flex gap-3">
                                        <div className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center text-pink-600 flex-shrink-0"><Activity size={16} /></div>
                                        <div className="bg-slate-100 rounded-2xl rounded-tl-none p-3 text-sm text-slate-700">
                                            Please sit down and drink some water. I recommend checking your blood pressure now.
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="absolute top-10 -left-10 w-full h-full bg-purple-200/50 rounded-3xl -z-10 blur-3xl opacity-50" />
                        </div>
                    </div>

                </div>
            </section>

            {/* 4. Trust & Security Section (Dark Mode) */}
            <section className="bg-slate-900 py-24 text-white">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <div className="flex justify-center mb-8">
                        <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-sm">
                            <Lock size={32} className="text-pink-400" />
                        </div>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">Built with Privacy First.</h2>
                    <p className="text-slate-400 text-lg max-w-2xl mx-auto mb-12">
                        We understand the sensitivity of your health data. That's why MamaCare is built with bank-grade security standards.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="p-6 rounded-2xl bg-slate-800/50 border border-slate-700">
                            <ShieldCheck className="mx-auto mb-4 text-emerald-400" size={32} />
                            <h3 className="font-semibold text-lg mb-2">HIPAA Compliant</h3>
                            <p className="text-slate-400 text-sm">Adhering to strict medical data privacy standards.</p>
                        </div>
                        <div className="p-6 rounded-2xl bg-slate-800/50 border border-slate-700">
                            <Lock className="mx-auto mb-4 text-purple-400" size={32} />
                            <h3 className="font-semibold text-lg mb-2">End-to-End Encryption</h3>
                            <p className="text-slate-400 text-sm">Secure encryption for all maternal health records.</p>
                        </div>
                        <div className="p-6 rounded-2xl bg-slate-800/50 border border-slate-700">
                            <Heart className="mx-auto mb-4 text-pink-400" size={32} />
                            <h3 className="font-semibold text-lg mb-2">Trustworthy</h3>
                            <p className="text-slate-400 text-sm">Developed at Murang’a University of Technology.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 5. Footer */}
            <footer className="bg-white border-t border-slate-100 py-12">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-2">
                        <div className="bg-slate-900 p-1.5 rounded-lg text-white">
                            <Activity size={16} />
                        </div>
                        <span className="text-lg font-bold text-slate-900">MamaCare</span>
                    </div>

                    <div className="flex gap-8 text-slate-600 text-sm font-medium">
                        <a href="#" className="hover:text-pink-600 transition-colors">Home</a>
                        <Link to="/login" className="hover:text-pink-600 transition-colors">Login</Link>
                        <a href="#" className="hover:text-pink-600 transition-colors">Contact</a>
                    </div>

                    <p className="text-slate-400 text-sm">
                        © 2026 MamaCare. Dev Linus Kibet.
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
