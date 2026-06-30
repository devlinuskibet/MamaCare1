import { Flame } from 'lucide-react';

interface StreakCounterProps {
    streak: number;
}

const StreakCounter = ({ streak }: StreakCounterProps) => {
    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col items-center justify-center">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Current Streak</h3>
            
            <div className="w-32 h-32 rounded-full bg-orange-50 border-8 border-orange-100 flex flex-col items-center justify-center mb-2">
                <Flame className="text-orange-500 mb-1" size={40} />
                <span className="text-3xl font-black text-slate-800 leading-none">{streak}</span>
            </div>
            
            <p className="text-slate-400 text-xs font-medium mt-4 text-center">
                {streak > 0 ? "You're on fire! Keep it up!" : "Take your IFAS today to start a streak!"}
            </p>
        </div>
    );
};

export default StreakCounter;
