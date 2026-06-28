import React from 'react';
import GestationalOverview from './GestationalOverview';

const FetalPortal = () => {
    return (
        <div className="space-y-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-800">Baby's Portal</h1>
                <p className="text-slate-500 mt-2 text-lg">Track your baby's development and scans.</p>
            </div>
            
            <GestationalOverview />
            
            {/* Components will go here */}
        </div>
    );
};

export default FetalPortal;
