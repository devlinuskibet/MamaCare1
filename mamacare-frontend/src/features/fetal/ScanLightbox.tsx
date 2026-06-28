import React from 'react';
import { X, Calendar, MapPin, Image as ImageIcon } from 'lucide-react';
import { ScanData } from './ScanGallery';

interface ScanLightboxProps {
    scan: ScanData | null;
    onClose: () => void;
}

const ScanLightbox: React.FC<ScanLightboxProps> = ({ scan, onClose }) => {
    if (!scan) return null;

    return (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 md:p-8">
            <button onClick={onClose} className="absolute top-6 right-6 text-white hover:text-slate-300 transition-colors">
                <X size={32} />
            </button>
            
            <div className="bg-white w-full max-w-5xl max-h-[90vh] rounded-3xl overflow-hidden flex flex-col md:flex-row shadow-2xl">
                {/* Image Section */}
                <div className="flex-1 bg-slate-100 flex items-center justify-center min-h-[300px] md:min-h-0 relative">
                    {scan.imageUrl ? (
                        <img src={scan.imageUrl} alt={scan.type} className="w-full h-full object-contain" />
                    ) : (
                        <div className="text-slate-400 flex flex-col items-center">
                            <ImageIcon size={64} className="mb-4 opacity-50" />
                            <p className="font-medium">No image uploaded</p>
                        </div>
                    )}
                </div>

                {/* Details Section */}
                <div className="w-full md:w-96 bg-white p-8 overflow-y-auto flex flex-col border-l border-slate-100">
                    <h2 className="text-2xl font-bold text-slate-800">{scan.type}</h2>
                    
                    <div className="mt-6 space-y-4">
                        <div className="flex items-center gap-3 text-slate-600">
                            <Calendar className="text-indigo-500" size={20} />
                            <span className="font-medium">{scan.date}</span>
                        </div>
                        <div className="flex items-center gap-3 text-slate-600">
                            <MapPin className="text-pink-500" size={20} />
                            <span className="font-medium">{scan.clinic}</span>
                        </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-slate-100 flex-1">
                        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">Doctor's Notes</h3>
                        <p className="text-slate-700 leading-relaxed bg-slate-50 p-5 rounded-2xl border border-slate-100">
                            {scan.notes || 'No notes provided for this scan.'}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ScanLightbox;
