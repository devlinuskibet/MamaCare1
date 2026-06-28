import React, { useState } from 'react';
import { X, UploadCloud } from 'lucide-react';
import type { ScanData } from './ScanGallery';

interface AddScanModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (scan: Omit<ScanData, 'id'>) => void;
}

const AddScanModal: React.FC<AddScanModalProps> = ({ isOpen, onClose, onAdd }) => {
    const [date, setDate] = useState('');
    const [type, setType] = useState('20-Week Anomaly Scan');
    const [clinic, setClinic] = useState('');
    const [notes, setNotes] = useState('');

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onAdd({
            date,
            type,
            clinic,
            notes,
            imageUrl: '' // Mock image
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl w-full max-w-md shadow-xl overflow-hidden">
                <div className="flex justify-between items-center p-6 border-b border-slate-100">
                    <h2 className="text-xl font-bold text-slate-800">Upload New Scan</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Scan Date</label>
                        <input type="date" required value={date} onChange={e => setDate(e.target.value)} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-pink-500" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Scan Type</label>
                        <select value={type} onChange={e => setType(e.target.value)} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-pink-500">
                            <option>12-Week Dating Scan</option>
                            <option>20-Week Anomaly Scan</option>
                            <option>Growth Scan</option>
                            <option>3D/4D Ultrasound</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Clinic Name</label>
                        <input type="text" placeholder="e.g. City Hospital" required value={clinic} onChange={e => setClinic(e.target.value)} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-pink-500" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Doctor's Notes</label>
                        <textarea rows={3} placeholder="Everything looks great..." value={notes} onChange={e => setNotes(e.target.value)} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-pink-500"></textarea>
                    </div>

                    {/* Drag and drop zone UI */}
                    <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 flex flex-col items-center justify-center text-slate-500 hover:bg-slate-50 transition-colors cursor-pointer">
                        <UploadCloud size={32} className="mb-2 text-indigo-500" />
                        <p className="text-sm font-medium">Click to upload or drag and drop</p>
                        <p className="text-xs mt-1">SVG, PNG, JPG or GIF (max. 5MB)</p>
                    </div>

                    <div className="pt-4 flex gap-3">
                        <button type="button" onClick={onClose} className="flex-1 py-3 px-4 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-colors">Cancel</button>
                        <button type="submit" className="flex-1 py-3 px-4 bg-pink-600 text-white font-bold rounded-xl hover:bg-pink-700 transition-colors">Upload Scan</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddScanModal;
