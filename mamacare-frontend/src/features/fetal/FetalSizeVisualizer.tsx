import { useState } from 'react';

// For simplicity, we just use some mock sizes for standard comparison
const STANDARD_SIZES: Record<number, { name: string, detail: string, icon: string }> = {
    4: { name: 'Poppy Seed', detail: 'Your baby is the size of a poppy seed. The neural tube is forming.', icon: '🌱' },
    12: { name: 'Plum', detail: 'Your baby is the size of a plum. All vital organs are formed.', icon: '🍑' },
    24: { name: 'Cantaloupe', detail: 'Your baby is the size of a cantaloupe. The lungs are developing rapidly.', icon: '🍈' },
    40: { name: 'Watermelon', detail: 'Your baby is the size of a small watermelon and ready to meet the world!', icon: '🍉' },
};

const LOCALIZED_SIZES: Record<number, { name: string, detail: string, icon: string }> = {
    4: { name: 'Millet Seed', detail: 'Your baby is the size of a millet seed. The neural tube is forming.', icon: '🌾' },
    12: { name: 'Passion Fruit', detail: 'Your baby is the size of a passion fruit. All vital organs are formed.', icon: '🟠' },
    24: { name: 'Mango', detail: 'Your baby is the size of a large mango. The lungs are developing rapidly.', icon: '🥭' },
    40: { name: 'Maize Cob', detail: 'Your baby is the size of a mature maize cob and ready to meet the world!', icon: '🌽' },
};

const FetalSizeVisualizer = () => {
    const [week, setWeek] = useState<number>(12);
    const [isLocalized, setIsLocalized] = useState<boolean>(false);

    // Get closest mock data
    const getComparison = () => {
        const dataSet = isLocalized ? LOCALIZED_SIZES : STANDARD_SIZES;
        if (week >= 40) return dataSet[40];
        if (week >= 24) return dataSet[24];
        if (week >= 12) return dataSet[12];
        return dataSet[4];
    };

    const currentComparison = getComparison();

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 sm:p-6 md:p-8">
            <div className="flex flex-col md:flex-row md:items-start justify-between mb-8 gap-4">
                <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mb-1 sm:mb-2">How Big is Baby?</h2>
                    <p className="text-sm sm:text-base text-slate-500">Slide to see how your baby is growing week by week.</p>
                </div>
                
                <div className="flex flex-wrap items-center bg-slate-100 p-1 rounded-lg w-full sm:w-auto">
                    <button 
                        onClick={() => setIsLocalized(false)}
                        className={`flex-1 sm:flex-none px-3 py-2 sm:px-4 rounded-md text-xs sm:text-sm font-medium transition-colors ${!isLocalized ? 'bg-white shadow-sm text-pink-600' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        Standard
                    </button>
                    <button 
                        onClick={() => setIsLocalized(true)}
                        className={`flex-1 sm:flex-none px-3 py-2 sm:px-4 rounded-md text-xs sm:text-sm font-medium transition-colors ${isLocalized ? 'bg-white shadow-sm text-pink-600' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        Localized Kenya
                    </button>
                </div>
            </div>
            
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
                <div className="text-6xl mb-4">{currentComparison.icon}</div>
                <h3 className="text-2xl font-bold text-slate-800 mb-2">The size of a {currentComparison.name}</h3>
                <p className="text-slate-600">{currentComparison.detail}</p>
            </div>
        </div>
    );
};

export default FetalSizeVisualizer;
