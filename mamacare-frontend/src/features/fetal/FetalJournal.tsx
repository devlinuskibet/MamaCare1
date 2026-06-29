import React, { useState } from 'react';
import { Send, Clock } from 'lucide-react';

interface JournalEntry {
    id: string;
    text: string;
    date: Date;
}

const FetalJournal = () => {
    const [entries, setEntries] = useState<JournalEntry[]>([
        {
            id: '1',
            text: 'We found out we are having a girl! 💖',
            date: new Date(Date.now() - 86400000 * 5) // 5 days ago
        },
        {
            id: '2',
            text: 'Felt the first little flutters today. So magical.',
            date: new Date(Date.now() - 86400000 * 12) // 12 days ago
        }
    ]);
    const [newEntry, setNewEntry] = useState('');

    const handleAddEntry = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newEntry.trim()) return;

        const entry: JournalEntry = {
            id: Date.now().toString(),
            text: newEntry,
            date: new Date()
        };

        setEntries([entry, ...entries]);
        setNewEntry('');
    };

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-6 md:p-8 border-b border-slate-100 bg-slate-50">
                <h2 className="text-2xl font-bold text-slate-800 mb-2">Pregnancy Journal</h2>
                <p className="text-slate-500 mb-6">Document the little moments and big milestones of your journey.</p>
                
                <form onSubmit={handleAddEntry} className="flex gap-3">
                    <input 
                        type="text"
                        value={newEntry}
                        onChange={(e) => setNewEntry(e.target.value)}
                        placeholder="What's on your mind? (e.g. Felt a kick!)"
                        className="flex-1 px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all"
                    />
                    <button 
                        type="submit"
                        disabled={!newEntry.trim()}
                        className="bg-pink-600 hover:bg-pink-700 disabled:opacity-50 disabled:hover:bg-pink-600 text-white px-5 py-3 rounded-xl font-bold flex items-center justify-center transition-colors shadow-sm"
                    >
                        <Send size={18} />
                    </button>
                </form>
            </div>
            
            <div className="p-6 md:p-8">
                {entries.length === 0 ? (
                    <div className="text-center text-slate-500 py-12">
                        No memories recorded yet. Start journaling above!
                    </div>
                ) : (
                    <div className="relative border-l-2 border-pink-100 ml-4 space-y-8 pb-4 mt-2">
                        {entries.map((entry) => (
                            <div key={entry.id} className="relative pl-8">
                                {/* Timeline Dot */}
                                <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-pink-500 ring-4 ring-white" />
                                
                                <div className="bg-slate-50 rounded-xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                                    <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold mb-2 uppercase tracking-wider">
                                        <Clock size={14} />
                                        {formatDate(entry.date)}
                                    </div>
                                    <p className="text-slate-700 text-lg leading-relaxed">{entry.text}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default FetalJournal;
