import { Check } from 'lucide-react';

interface WeeklyCalendarProps {
    loggedDays: Record<string, boolean>;
    onToggleDay: (day: string) => void;
}

const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const WeeklyCalendar = ({ loggedDays, onToggleDay }: WeeklyCalendarProps) => {
    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 lg:col-span-2">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-6">This Week's Tracker</h3>
            
            <div className="flex justify-between items-center w-full max-w-2xl mx-auto">
                {daysOfWeek.map((day) => {
                    const isTaken = loggedDays[day];
                    
                    return (
                        <div key={day} className="flex flex-col items-center">
                            <span className="text-xs font-medium text-slate-400 mb-3">{day}</span>
                            <button
                                onClick={() => onToggleDay(day)}
                                className={`
                                    w-10 h-10 md:w-14 md:h-14 rounded-full flex items-center justify-center transition-all duration-300 shadow-sm
                                    ${isTaken 
                                        ? 'bg-pink-500 text-white shadow-pink-200' 
                                        : 'bg-slate-50 border-2 border-slate-200 text-transparent hover:border-pink-300'
                                    }
                                `}
                            >
                                <Check strokeWidth={3} className={isTaken ? 'opacity-100' : 'opacity-0'} />
                            </button>
                        </div>
                    );
                })}
            </div>
            
            <p className="text-slate-400 text-xs font-medium mt-6 text-center">Tap a day to mark your supplement as taken.</p>
        </div>
    );
};

export default WeeklyCalendar;
