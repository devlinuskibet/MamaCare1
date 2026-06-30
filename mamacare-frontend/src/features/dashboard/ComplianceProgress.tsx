interface ComplianceProgressProps {
    percentage: number;
}

const ComplianceProgress = ({ percentage }: ComplianceProgressProps) => {
    const radius = 40;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col items-center justify-center">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Current Month Compliance</h3>
            <div className="relative w-32 h-32 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle
                        className="text-slate-100 stroke-current"
                        strokeWidth="8"
                        cx="50"
                        cy="50"
                        r={radius}
                        fill="transparent"
                    />
                    <circle
                        className="text-pink-500 stroke-current transition-all duration-1000 ease-in-out"
                        strokeWidth="8"
                        strokeLinecap="round"
                        cx="50"
                        cy="50"
                        r={radius}
                        fill="transparent"
                        style={{
                            strokeDasharray: circumference,
                            strokeDashoffset: strokeDashoffset,
                        }}
                    />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-black text-slate-800">{percentage}%</span>
                </div>
            </div>
            <p className="text-slate-400 text-xs font-medium mt-4 text-center">Great job! Keep taking your IFAS to prevent anemia.</p>
        </div>
    );
};

export default ComplianceProgress;
