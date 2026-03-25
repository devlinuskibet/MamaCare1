import { useQuery } from '@tanstack/react-query';
import { Calendar, Activity, Heart, AlertTriangle, Droplet } from 'lucide-react';
import { healthApi } from '../../api/health';
import { 
    LineChart, 
    Line, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    ResponsiveContainer, 
    Legend 
} from 'recharts';

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        const data = payload[0]?.payload;
        if (!data) return null;

        const risk = data.risk_prediction || data.risk_level || 'N/A';
        const isHighRisk = String(risk).toLowerCase() === 'high risk';
        const confidence = typeof data.confidence_score === 'number' 
            ? `${(data.confidence_score * 100).toFixed(1)}%` 
            : 'N/A';

        return (
            <div className="bg-white p-4 shadow-xl border border-slate-100 rounded-2xl">
                <p className="text-xs text-slate-500 mb-1">
                    {label ? new Date(label).toLocaleString() : 'N/A'}
                </p>
                {payload.map((entry: any, index: number) => (
                    <p key={index} className="text-sm font-bold" style={{ color: entry.color }}>
                        {entry.name}: {entry.value ?? 'N/A'}
                    </p>
                ))}
                <div className="mt-2 pt-2 border-t border-slate-50">
                    <p className={`text-xs font-bold uppercase ${isHighRisk ? 'text-red-500' : 'text-green-500'}`}>
                        Risk: {risk}
                    </p>
                    <p className="text-[10px] text-slate-400">Confidence: {confidence}</p>
                </div>
            </div>
        );
    }
    return null;
};

const HealthHistory = () => {
    // Fetch Data
    const { data: history, isLoading, error } = useQuery({
        queryKey: ['healthHistory'],
        queryFn: healthApi.getHistory
    });

    if (isLoading) return <div className="p-8 text-center text-slate-500">Loading history...</div>;
    if (error) return <div className="p-8 text-center text-red-500">Failed to load history.</div>;

    // Fallback for empty state
    if (!history || history.length === 0) {
        return (
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 text-center">
                <h3 className="text-xl font-bold text-slate-800 mb-2">Health History</h3>
                <p className="text-slate-500">No records found yet. Start by checking your vitals!</p>
            </div>
        );
    }

    // Sort history by timestamp for the graph
    const sortedHistory = [...history].sort((a, b) => 
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );

    return (
        <div className="space-y-8">
            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Blood Pressure Chart */}
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
                    <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                        <Activity className="text-pink-500" size={20} />
                        Blood Pressure Trend
                    </h3>
                    <div className="h-[400px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={sortedHistory}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis 
                                    dataKey="timestamp" 
                                    hide 
                                />
                                <YAxis domain={['dataMin - 10', 'dataMax + 10']} />
                                <Tooltip content={<CustomTooltip />} />
                                <Legend />
                                <Line 
                                    type="monotone" 
                                    dataKey="systolic_bp" 
                                    name="Systolic" 
                                    stroke="#ec4899" 
                                    strokeWidth={3} 
                                    dot={{ r: 4, fill: '#ec4899' }}
                                    activeDot={{ r: 6 }} 
                                />
                                <Line 
                                    type="monotone" 
                                    dataKey="diastolic_bp" 
                                    name="Diastolic" 
                                    stroke="#6366f1" 
                                    strokeWidth={3} 
                                    dot={{ r: 4, fill: '#6366f1' }}
                                    activeDot={{ r: 6 }} 
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Blood Sugar Chart */}
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
                    <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                        <Droplet className="text-blue-500" size={20} />
                        Blood Sugar Trend
                    </h3>
                    <div className="h-[400px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={sortedHistory}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis 
                                    dataKey="timestamp" 
                                    hide 
                                />
                                <YAxis domain={['dataMin - 1', 'dataMax + 1']} />
                                <Tooltip content={<CustomTooltip />} />
                                <Line 
                                    type="monotone" 
                                    dataKey="blood_sugar" 
                                    name="Blood Sugar" 
                                    stroke="#3b82f6" 
                                    strokeWidth={3} 
                                    dot={{ r: 4, fill: '#3b82f6' }}
                                    activeDot={{ r: 6 }} 
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Table Section */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                    <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                        <Calendar className="text-pink-500" size={24} />
                        Detailed Records
                    </h3>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">Date</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">Blood Pressure</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">Blood Sugar</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">Heart Rate</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {[...history].reverse().map((record, index) => (
                                <tr key={index} className="hover:bg-slate-50 transition">
                                    <td className="px-6 py-4 text-sm text-slate-600">
                                        {new Date(record.timestamp).toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 text-slate-700 font-medium">
                                            <Activity size={16} className="text-slate-400" />
                                            {record.systolic_bp}/{record.diastolic_bp}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 text-slate-700 font-medium">
                                            <Droplet size={16} className="text-slate-400" />
                                            {record.blood_sugar}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 text-slate-700 font-medium">
                                            <Heart size={16} className="text-slate-400" />
                                            {record.heart_rate} bpm
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold
                                            ${record.risk_prediction.toLowerCase() === 'high risk'
                                                ? 'bg-red-100 text-red-700'
                                                : 'bg-green-100 text-green-700'
                                            }`}>
                                            {record.risk_prediction.toLowerCase() === 'high risk' && <AlertTriangle size={12} />}
                                            {record.risk_prediction || 'Normal'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default HealthHistory;
