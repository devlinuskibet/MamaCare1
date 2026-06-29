import React, { useState } from 'react';

// For simplicity, we just use some mock sizes for standard comparison
const STANDARD_SIZES: Record<number, { name: string, detail: string }> = {
    4: { name: 'Poppy Seed', detail: 'Your baby is the size of a poppy seed. The neural tube is forming.' },
    12: { name: 'Plum', detail: 'Your baby is the size of a plum. All vital organs are formed.' },
    24: { name: 'Cantaloupe', detail: 'Your baby is the size of a cantaloupe. The lungs are developing rapidly.' },
    40: { name: 'Watermelon', detail: 'Your baby is the size of a small watermelon and ready to meet the world!' },
};

const FetalSizeVisualizer = () => {
    const [week, setWeek] = useState<number>(12);

    // Get closest mock data
    const getComparison = () => {
        if (week >= 40) return STANDARD_SIZES[40];
        if (week >= 24) return STANDARD_SIZES[24];
        if (week >= 12) return STANDARD_SIZES[12];
        return STANDARD_SIZES[4];
    };

    const currentComparison = getComparison();

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-2">How Big is Baby?</h2>
            <p className="text-slate-500 mb-8">Slide to see how your baby is growing week by week.</p>
            
            <div className="mb-10">
                <div className="flex justify-between text-slate-500 font-medium mb-2">
                    <span>Week 4</span>
                    <span className="text-pink-600 font-bold text-lg">Week {week}</span>
                    <span>Week 40</span>
                </div>
                <input 
                    type="range" 
                    min="4" 
                    max="40" 
                    value={week} 
                    onChange={(e) => setWeek(parseInt(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-pink-600"
                />
            </div>
            
            <div className="bg-pink-50 rounded-xl p-8 text-center border border-pink-100">
                <div className="text-6xl mb-4">🌱</div>
                <h3 className="text-2xl font-bold text-slate-800 mb-2">The size of a {currentComparison.name}</h3>
                <p className="text-slate-600">{currentComparison.detail}</p>
            </div>
        </div>
    );
};

export default FetalSizeVisualizer;
