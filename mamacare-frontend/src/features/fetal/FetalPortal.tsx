import React, { useState } from 'react';
import GestationalOverview from './GestationalOverview';
import ScanGallery from './ScanGallery';
import type { ScanData } from './ScanGallery';
import AddScanModal from './AddScanModal';
import KickCounter from './KickCounter';
import ScanLightbox from './ScanLightbox';
import { Plus, Activity, Ruler, Book, Image as ImageIcon } from 'lucide-react';

type Tab = 'overview' | 'contractions' | 'size' | 'journal';

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
    const [activeTab, setActiveTab] = useState<Tab>('overview');

    const handleAddScan = (newScan: Omit<ScanData, 'id'>) => {
        const scan: ScanData = {
            ...newScan,
            id: Date.now().toString(),
        };
        setScans([scan, ...scans]);
    };

    const tabs = [
        { id: 'overview', label: 'Overview & Scans', icon: <ImageIcon size={18} /> },
        { id: 'contractions', label: 'Contraction Timer', icon: <Activity size={18} /> },
        { id: 'size', label: 'Size Visualizer', icon: <Ruler size={18} /> },
        { id: 'journal', label: 'Journal', icon: <Book size={18} /> },
    ];

    return (
        <div className="space-y-6 md:space-y-8 pb-12">
            <div className="mb-2 flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800">Baby's Portal</h1>
                    <p className="text-slate-500 mt-2 text-base md:text-lg">Track your baby's development and scans.</p>
                </div>
                {activeTab === 'overview' && (
                    <button 
                        onClick={() => setIsAddModalOpen(true)}
                        className="flex items-center justify-center gap-2 bg-pink-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-pink-700 transition-colors shadow-sm w-full sm:w-auto"
                    >
                        <Plus size={20} />
                        Upload Scan
                    </button>
                )}
            </div>

            <div className="flex overflow-x-auto space-x-2 sm:space-x-4 border-b border-slate-200 mb-6 pb-px">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as Tab)}
                        className={`flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2.5 text-sm sm:text-base font-medium whitespace-nowrap rounded-t-xl transition-all border-b-2
                            ${activeTab === tab.id 
                                ? 'text-pink-600 border-pink-600 bg-pink-50' 
                                : 'text-slate-500 border-transparent hover:text-slate-800 hover:bg-slate-50'
                            }`}
                    >
                        {tab.icon}
                        {tab.label}
                    </button>
                ))}
            </div>
            
            {activeTab === 'overview' && (
                <>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2">
                            <GestationalOverview />
                        </div>
                        <div className="lg:col-span-1">
                            <KickCounter />
                        </div>
                    </div>
                    
                    <ScanGallery scans={scans} onScanClick={(scan) => setSelectedScan(scan)} />
                </>
            )}

            {activeTab === 'contractions' && (
                <div className="p-8 text-center text-slate-500 bg-white rounded-xl shadow-sm border border-slate-100">
                    Contraction Timer Component (Coming Next)
                </div>
            )}

            {activeTab === 'size' && (
                <div className="p-8 text-center text-slate-500 bg-white rounded-xl shadow-sm border border-slate-100">
                    Fetal Size Visualizer Component (Coming Soon)
                </div>
            )}

            {activeTab === 'journal' && (
                <div className="p-8 text-center text-slate-500 bg-white rounded-xl shadow-sm border border-slate-100">
                    Fetal Journal Component (Coming Soon)
                </div>
            )}

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
