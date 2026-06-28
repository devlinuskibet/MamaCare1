import React, { useState } from 'react';
import GestationalOverview from './GestationalOverview';
import ScanGallery, { ScanData } from './ScanGallery';
import AddScanModal from './AddScanModal';
import { Plus } from 'lucide-react';

const FetalPortal = () => {
    const [scans, setScans] = useState<ScanData[]>([
        {
            id: '1',
            date: '2026-06-15',
            type: '12-Week Dating Scan',
            clinic: 'City Hospital',
            notes: 'Baby is measuring perfectly on track.',
            imageUrl: ''
        }
    ]);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    const handleAddScan = (newScan: Omit<ScanData, 'id'>) => {
        const scan: ScanData = {
            ...newScan,
            id: Date.now().toString(),
        };
        setScans([scan, ...scans]);
    };

    return (
        <div className="space-y-8 pb-12">
            <div className="mb-8 flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800">Baby's Portal</h1>
                    <p className="text-slate-500 mt-2 text-lg">Track your baby's development and scans.</p>
                </div>
                <button 
                    onClick={() => setIsAddModalOpen(true)}
                    className="flex items-center gap-2 bg-pink-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-pink-700 transition-colors shadow-sm"
                >
                    <Plus size={20} />
                    Upload Scan
                </button>
            </div>
            
            <GestationalOverview />
            
            <ScanGallery scans={scans} onScanClick={(scan) => console.log('Clicked', scan)} />

            <AddScanModal 
                isOpen={isAddModalOpen} 
                onClose={() => setIsAddModalOpen(false)} 
                onAdd={handleAddScan} 
            />
        </div>
    );
};

export default FetalPortal;
