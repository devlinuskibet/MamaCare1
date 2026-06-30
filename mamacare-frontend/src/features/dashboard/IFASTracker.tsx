import { useState } from 'react';
import ComplianceProgress from './ComplianceProgress';
import StreakCounter from './StreakCounter';
import WeeklyCalendar from './WeeklyCalendar';

const IFASTracker = () => {
    // Initial state with some mock data
    const [loggedDays, setLoggedDays] = useState<Record<string, boolean>>({
        'Mon': true,
        'Tue': true,
        'Wed': false,
        'Thu': false,
        'Fri': false,
        'Sat': false,
        'Sun': false
    });
    
    // Hardcoded mock data for now
    const compliancePercent = 85;
    const currentStreak = 5;
    
    const handleToggleDay = (day: string) => {
        setLoggedDays(prev => ({
            ...prev,
            [day]: !prev[day]
        }));
    };

    return (
        <div className="space-y-6 md:space-y-8 pb-12">
            <div className="mb-6 md:mb-8">
                <h1 className="text-3xl font-bold text-slate-800">Nutrition & IFAS Tracker</h1>
                <p className="text-slate-500 mt-2 text-base md:text-lg max-w-3xl">
                    Daily Iron and Folic Acid Supplementation (IFAS) is critical during pregnancy. It prevents maternal anemia, reduces the risk of low birth weight, and protects your baby's spinal development.
                </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <WeeklyCalendar 
                    loggedDays={loggedDays} 
                    onToggleDay={handleToggleDay} 
                />
                <ComplianceProgress percentage={compliancePercent} />
                <StreakCounter streak={currentStreak} />
            </div>
        </div>
    );
};

export default IFASTracker;
