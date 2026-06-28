import React, { useState } from 'react';
import GestationalOverview from './GestationalOverview';
import ScanGallery, { ScanData } from './ScanGallery';
import AddScanModal from './AddScanModal';
import KickCounter from './KickCounter';
import ScanLightbox from './ScanLightbox';
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
    const [selectedScan, setSelectedScan] = useState<ScanData | null>(null);

    const handleAddScan = (newScan: Omit<ScanData, 'id'>) => {
        const scan: ScanData = {
            ...newScan,
            id: Date.now().toString(),
        };
        setScans([scan, ...scans]);
    };

    return (
        <div className="space-y-6 md:space-y-8 pb-12">
            <div className="mb-6 md:mb-8 flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800">Baby's Portal</h1>
                    <p className="text-slate-500 mt-2 text-base md:text-lg">Track your baby's development and scans.</p>
                </div>
                <button 
                    onClick={() => setIsAddModalOpen(true)}
                    className="flex items-center justify-center gap-2 bg-pink-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-pink-700 transition-colors shadow-sm w-full sm:w-auto"
                >
                    <Plus size={20} />
                    Upload Scan
                </button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <GestationalOverview />
                </div>
                <div className="lg:col-span-1">
                    <KickCounter />
                </div>
            </div>
            
            <ScanGallery scans={scans} onScanClick={(scan) => setSelectedScan(scan)} />

            <AddScanModal 
                isOpen={isAddModalOpen} 
                onClose={() => setIsAddModalOpen(false)} 
                onAdd={handleAddScan} 
            />

            <ScanLightbox 
                scan={selectedScan} 
                onClose={() => setSelectedScan(null)} 
            />
        </div>
    );
};

export default FetalPortal;
