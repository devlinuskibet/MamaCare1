import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, Home, Activity, MessageCircle, LogOut, Flower2, TrendingUp, User, Stethoscope, Users, FileText } from 'lucide-react';
import { useUserRole } from '../../contexts/UserContext';

interface MainLayoutProps {
    children: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const { userRole, setUserRole } = useUserRole();

    const navigate = useNavigate();
    const location = useLocation();

    // Auto-switch role based on path (Simulated Logic)
    useEffect(() => {
        if (location.pathname.startsWith('/provider')) {
            setUserRole('provider');
        } else if (['/dashboard', '/vitals', '/chatbot', '/history', '/exercises'].some(path => location.pathname.startsWith(path))) {
            setUserRole('mother');
        }
    }, [location.pathname, setUserRole]);

    // Mother Navigation Items
    const motherNavItems = [
        { label: 'Dashboard', path: '/dashboard', icon: <Home size={20} /> },
        { label: 'Check Vitals', path: '/vitals', icon: <Activity size={20} /> },
        { label: 'MamaBot', path: '/chatbot', icon: <MessageCircle size={20} /> },
        { label: 'My History', path: '/history', icon: <TrendingUp size={20} /> },
        { label: 'Wellness', path: '/exercises', icon: <Flower2 size={20} /> },
        { label: 'My Profile', path: '/profile', icon: <User size={20} /> },
    ];

    // Provider Navigation Items
    const providerNavItems = [
        { label: 'Triage Dashboard', path: '/provider', icon: <Home size={20} /> },
        { label: 'Patient Directory', path: '/provider/patients', icon: <Users size={20} /> },
        { label: 'Reports', path: '/provider/reports', icon: <FileText size={20} /> }, // Placeholder route
        { label: 'Doctor Profile', path: '/profile', icon: <Stethoscope size={20} /> },
    ];

    const navItems = userRole === 'mother' ? motherNavItems : providerNavItems;
    const isProvider = userRole === 'provider';

    return (
        <div className={`min-h-screen flex ${isProvider ? 'bg-slate-100' : 'bg-slate-50'}`}>
            {/* 1. Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-20 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* 2. Sidebar Navigation */}
            <aside className={`
                fixed lg:static inset-y-0 left-0 z-30
                w-64 transform transition-all duration-200 ease-in-out
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                ${isProvider ? 'bg-slate-900 border-r border-slate-800 text-white' : 'bg-white border-r border-slate-200'}
            `}>
                <div className={`h-16 flex items-center px-6 border-b ${isProvider ? 'border-slate-800' : 'border-slate-100'}`}>
                    <span className={`text-2xl font-bold ${isProvider ? 'text-white' : 'text-pink-600'}`}>
                        {isProvider ? 'MamaCare Pro' : 'MamaCare'}
                    </span>
                </div>

                <nav className="p-4 space-y-2">
                    {navItems.map((item) => (
                        <button
                            key={item.label}
                            onClick={() => {
                                navigate(item.path);
                                setIsSidebarOpen(false);
                            }}
                            className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-colors
                                ${location.pathname === item.path
                                    ? (isProvider ? 'bg-indigo-600 text-white font-medium' : 'bg-pink-50 text-pink-700 font-medium')
                                    : (isProvider ? 'text-slate-400 hover:bg-slate-800 hover:text-white' : 'text-slate-600 hover:bg-slate-50')
                                }`}
                        >
                            {item.icon}
                            {item.label}
                        </button>
                    ))}
                </nav>

                <div className={`absolute bottom-0 w-full p-4 border-t ${isProvider ? 'border-slate-800' : 'border-slate-100'}`}>
                    <button
                        onClick={() => navigate('/login')}
                        className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-colors
                            ${isProvider
                                ? 'text-slate-400 hover:text-red-400 hover:bg-slate-800'
                                : 'text-slate-600 hover:text-red-600 hover:bg-red-50'
                            }`}
                    >
                        <LogOut size={20} />
                        Logout
                    </button>
                </div>
            </aside>

            {/* 3. Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Mobile Header */}
                <header className={`lg:hidden h-16 border-b flex items-center px-4 justify-between
                    ${isProvider ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200'}`}>
                    <span className={`font-bold text-xl ${isProvider ? 'text-white' : 'text-pink-600'}`}>
                        {isProvider ? 'MamaCare Pro' : 'MamaCare'}
                    </span>
                    <button onClick={() => setIsSidebarOpen(true)} className={`p-2 ${isProvider ? 'text-slate-300' : 'text-slate-600'}`}>
                        <Menu size={24} />
                    </button>
                </header>

                {/* Navbar with Role Switcher (Temporary) */}
                <div className={`hidden lg:flex justify-end p-4 ${isProvider ? 'bg-slate-100' : 'bg-slate-50'}`}>
                    <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full shadow-sm border border-slate-200">
                        <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Simulate Role:</span>
                        <div className="flex bg-slate-100 rounded-full p-1">
                            <button
                                onClick={() => setUserRole('mother')}
                                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${userRole === 'mother' ? 'bg-pink-500 text-white shadow-sm' : 'text-slate-600 hover:text-slate-800'
                                    }`}
                            >
                                Mother
                            </button>
                            <button
                                onClick={() => setUserRole('provider')}
                                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${userRole === 'provider' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-600 hover:text-slate-800'
                                    }`}
                            >
                                Provider
                            </button>
                        </div>
                    </div>
                </div>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto p-4 lg:p-8 pt-0 lg:pt-0">
                    <div className="max-w-5xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default MainLayout;