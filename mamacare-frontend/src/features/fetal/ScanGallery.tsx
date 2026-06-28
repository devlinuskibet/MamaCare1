import React from 'react';
import { Image as ImageIcon, MapPin, Calendar } from 'lucide-react';

export interface ScanData {
    id: string;
    date: string;
    type: string;
    clinic: string;
    notes: string;
    imageUrl: string;
}

interface ScanGalleryProps {
    scans: ScanData[];
    onScanClick: (scan: ScanData) => void;
}

const ScanGallery: React.FC<ScanGalleryProps> = ({ scans, onScanClick }) => {
    if (scans.length === 0) {
        return null; // Handled by empty state later
    }

    return (
        <div className="mt-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">Ultrasound & Scan Gallery</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {scans.map((scan) => (
                    <div 
                        key={scan.id} 
                        onClick={() => onScanClick(scan)}
                        className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer group"
                    >
                        {/* Thumbnail */}
                        <div className="h-48 bg-slate-100 flex items-center justify-center relative overflow-hidden">
                            {scan.imageUrl ? (
                                <img src={scan.imageUrl} alt={scan.type} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                            ) : (
                                <ImageIcon className="text-slate-300" size={48} />
                            )}
                        </div>
                        
                        {/* Details */}
                        <div className="p-4">
                            <h3 className="font-bold text-slate-800 text-lg">{scan.type}</h3>
                            <div className="flex items-center gap-2 text-slate-500 mt-2 text-sm">
                                <Calendar size={16} />
                                <span>{scan.date}</span>
                            </div>
                            <div className="flex items-center gap-2 text-slate-500 mt-1 text-sm">
                                <MapPin size={16} />
                                <span>{scan.clinic}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ScanGallery;
