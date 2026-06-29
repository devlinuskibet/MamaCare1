import React from 'react';

const mockData = [
    { hour: '8am', count: 2 },
    { hour: '12pm', count: 5 },
    { hour: '4pm', count: 12 },
    { hour: '8pm', count: 18 },
    { hour: '12am', count: 8 },
];

const AnalyticsTab = () => {
    const maxCount = Math.max(...mockData.map(d => d.count));

    return (
        <div className="w-full mt-6">
            <h4 className="text-sm font-bold text-slate-700 mb-4 text-left">Most Active Hours</h4>
            <div className="flex items-end justify-between h-32 gap-2">
                {mockData.map((data, idx) => {
                    const heightPercent = (data.count / maxCount) * 100;
                    return (
                        <div key={idx} className="flex flex-col items-center flex-1 group">
                            <div className="w-full relative flex justify-center h-full items-end">
                                <div 
                                    className="w-full max-w-[2rem] bg-indigo-100 group-hover:bg-indigo-300 rounded-t-md transition-all relative"
                                    style={{ height: `${heightPercent}%` }}
                                >
                                    <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs py-1 px-2 rounded font-medium transition-opacity">
                                        {data.count}
                                    </div>
                                </div>
                            </div>
                            <span className="text-xs text-slate-500 mt-2 font-medium">{data.hour}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default AnalyticsTab;
