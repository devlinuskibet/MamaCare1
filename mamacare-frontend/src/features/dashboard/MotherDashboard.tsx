
import { useState, useEffect } from 'react';
import GestationRing from './GestationRing';
import { Activity, Calendar, FileText, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import TrendAnalysis from './TrendAnalysis';
import { endpoints } from '../../api/endpoints';
import ClinicalPassport from '../../components/ClinicalPassport';
import { healthApi } from '../../api/health';
import type { HealthHistoryItem } from '../../api/health';
const BABY_SIZE_MAP: Record<number, string> = {
    4: 'Poppy Seed',
    8: 'Raspberry',
    12: 'Plum',
    16: 'Avocado',
    20: 'Banana',
    24: 'Ear of Corn',
    28: 'Eggplant',
    32: 'Squash',
    36: 'Papaya',
    40: 'Watermelon'
};

const getBabySize = (week: number): string => {
    if (!week) return 'Waiting for Sync...';
    const weeks = Object.keys(BABY_SIZE_MAP).map(Number).sort((a,b)=>a-b);
    let size = 'A little miracle';
    for (const w of weeks) {
        if (week >= w) size = BABY_SIZE_MAP[w];
    }
    return size;
};

const MotherDashboard = () => {
    const [profile, setProfile] = useState<any>(null);
    const [history, setHistory] = useState<HealthHistoryItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [resProfile, resHistory] = await Promise.all([
                    endpoints.user.getMe(),
                    healthApi.getHistory()
                ]);
                setProfile(resProfile.data);
                setHistory(resHistory || []);
            } catch (err) {
                console.error("Failed to load dashboard data.", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-[60vh]">
                <RefreshCw size={40} className="animate-spin text-pink-600" />
            </div>
        );
    }

    const currentWeek = profile?.current_week || 0;
    const daysPregnant = profile?.days_pregnant || 0;
    const trimester = profile?.trimester || 1;
    const babySize = getBabySize(currentWeek);

    return (
        <div className="space-y-8">
            {/* 1. Header Section */}
            <div>
                <h1 className="text-2xl font-bold text-slate-800">My Pregnancy Journey</h1>
                {profile?.lmp ? (
                    <p className="text-slate-500">Day {daysPregnant} • Trimester {trimester} • Great job, Mama! Your journey looks stable.</p>
                ) : (
                    <p className="text-amber-600 font-medium">Please update your LMP in your Profile to unlock your journey timeline!</p>
                )}
            </div>

            {/* 2. The Visual Centerpiece */}
            <GestationRing
                week={currentWeek}
                babySize={babySize}
                riskLevel={'low'} // Can dynamically tie into latest HealthRecord risk later!
            />

            {/* 3. Action Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Card 1: Vitals */}
                <Link to="/vitals" className="p-4 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-md transition-all flex flex-col items-center gap-3 group">
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-full group-hover:bg-blue-100 transition-colors">
                        <Activity size={24} />
                    </div>
                    <div className="text-center">
                        <h3 className="font-bold text-slate-700">Log Vitals</h3>
                        <p className="text-xs text-slate-400">BP, Heart Rate, Glucose</p>
                    </div>
                </Link>
                {/* Card 2: History */}
                <button className="p-4 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-md transition-all flex flex-col items-center gap-3 group">
                    <div className="p-3 bg-purple-50 text-purple-600 rounded-full group-hover:bg-purple-100 transition-colors">
                        <FileText size={24} />
                    </div>
                    <div className="text-center">
                        <h3 className="font-bold text-slate-700">Health History</h3>
                        <p className="text-xs text-slate-400">View your trends</p>
                    </div>
                </button>

                {/* Card 3: Appointments */}
                <button className="p-4 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-md transition-all flex flex-col items-center gap-3 group">
                    <div className="p-3 bg-pink-50 text-pink-600 rounded-full group-hover:bg-pink-100 transition-colors">
                        <Calendar size={24} />
                    </div>
                    <div className="text-center">
                        <h3 className="font-bold text-slate-700">Appointments</h3>
                        <p className="text-xs text-slate-400">Next: Feb 12th</p>
                    </div>
                </button>
            </div>

            {/* 4. Trends Section */}
            <div className="bg-slate-50 p-6 rounded-3xl">
                <TrendAnalysis />
            </div>

            {/* 5. Clinical Passport */}
            {profile && (
                <div className="mt-12 pt-8 border-t border-slate-200">
                    <div className="mb-4">
                        <h2 className="text-xl font-bold text-slate-800">Clinical Passport</h2>
                        <p className="text-slate-500">Easily generate and download your medical records.</p>
                    </div>
                    <ClinicalPassport 
                        patientData={{
                            full_name: profile.full_name || profile.name || "N/A",
                            age: profile.age || "N/A",
                            blood_group: profile.blood_group || "N/A",
                            location: profile.location || profile.address || "N/A",
                            gravida: profile.gravida || 0,
                            parity: profile.parity || 0,
                            bmi: profile.bmi || "N/A"
                        }}
                        latestVitals={history && history.length > 0 ? {
                            systolic: history[0].systolic_bp,
                            diastolic: history[0].diastolic_bp,
                            bs: history[0].blood_sugar,
                            heart_rate: history[0].heart_rate,
                            risk_status: history[0].risk_prediction || "Unknown"
                        } : {
                            systolic: "N/A",
                            diastolic: "N/A",
                            bs: "N/A",
                            heart_rate: "N/A",
                            risk_status: "No vitals recorded yet"
                        }}
                    />
                </div>
            )}
        </div>
    );
};

export default MotherDashboard;