import { useState, useEffect } from 'react';
import { RefreshCw, Activity, Heart, Clock } from 'lucide-react';
import { 
    PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
    LineChart, Line, XAxis, YAxis, CartesianGrid,
    BarChart, Bar
} from 'recharts';
import { endpoints } from '../../api/endpoints';

const ReportsDashboard = () => {
    const [dailyAlerts, setDailyAlerts] = useState<any[]>([]);
    const [vitalTrends, setVitalTrends] = useState<any[]>([]);
    const [usageHeatmap, setUsageHeatmap] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchReports = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const [alertsRes, trendsRes, heatmapRes] = await Promise.all([
                endpoints.reports.getDailyAlerts(),
                endpoints.reports.getVitalTrends(),
                endpoints.reports.getUsageHeatmap()
            ]);
            
            setDailyAlerts(alertsRes.data);
            setVitalTrends(trendsRes.data);
            setUsageHeatmap(heatmapRes.data);
        } catch (err: any) {
            console.error("Failed to fetch reports:", err);
            setError(err.response?.data?.detail || "Failed to load analytics data.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchReports();
    }, []);

    // Color definitions for PieChart
    const RISK_COLORS: { [key: string]: string } = {
        'High Risk': '#ef4444', // Red
        'Mid Risk': '#eab308',  // Yellow
        'Low Risk': '#10b981'   // Green
    };

    if (isLoading && dailyAlerts.length === 0) {
        return (
            <div className="flex justify-center items-center h-[60vh]">
                <RefreshCw size={40} className="animate-spin text-indigo-600" />
                <span className="ml-3 text-lg font-medium text-slate-600">Loading Analytics...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6 bg-red-50 text-red-700 rounded-2xl border border-red-200 shadow-sm max-w-2xl mx-auto mt-10">
                <h2 className="text-xl font-bold mb-2 flex items-center gap-2"><Activity size={24}/> Analytics Error</h2>
                <p>{error}</p>
                <button onClick={fetchReports} className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium">
                    Retry Connection
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in zoom-in duration-300">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Analytics Overview</h1>
                    <p className="text-slate-500 mt-1 text-sm font-medium">Real-time Maternal Health Intelligence</p>
                </div>
                <button 
                    onClick={fetchReports} 
                    disabled={isLoading}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition-colors shadow-sm disabled:opacity-50"
                >
                    <RefreshCw size={18} className={isLoading ? 'animate-spin' : ''} />
                    Refresh Data
                </button>
            </div>

            {/* Grid Layout: 2x2 or 3-column depending on screen size. We use a 2x2 style mapping for large charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* 1. Daily Risk Distribution (Pie Chart) */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center">
                    <div className="w-full flex items-center justify-between mb-2">
                        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                            <Activity className="text-indigo-500" size={20} /> Daily Risk Distribution
                        </h2>
                        <span className="text-xs font-semibold bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full border border-indigo-100">
                            Last 24 Hours
                        </span>
                    </div>
                    <div className="w-full h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={dailyAlerts}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={70}
                                    outerRadius={100}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {dailyAlerts.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={RISK_COLORS[entry.name] || '#94a3b8'} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(value: any) => [`${value} Patients`, 'Count']} />
                                <Legend verticalAlign="bottom" height={36} iconType="circle" />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* 2. 7-Day Vital Trends (Line Chart) */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
                    <div className="w-full flex items-center justify-between mb-4">
                        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                            <Heart className="text-pink-500" size={20} /> Vital Stability Trends
                        </h2>
                        <span className="text-xs font-semibold bg-pink-50 text-pink-700 px-3 py-1 rounded-full border border-pink-100">
                            7-Day Moving Avg
                        </span>
                    </div>
                    <div className="w-full h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={vitalTrends} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis dataKey="date" tick={{fontSize: 12, fill: '#64748b'}} axisLine={false} tickLine={false} />
                                <YAxis yAxisId="left" tick={{fontSize: 12, fill: '#64748b'}} axisLine={false} tickLine={false} domain={['auto', 'auto']} />
                                <YAxis yAxisId="right" orientation="right" tick={{fontSize: 12, fill: '#64748b'}} axisLine={false} tickLine={false} domain={[0, 'auto']} />
                                <Tooltip 
                                    contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Legend iconType="plainline" wrapperStyle={{ paddingTop: '20px' }} />
                                <Line yAxisId="left" type="monotone" name="Systolic BP (mmHg)" dataKey="avg_systolic" stroke="#6366f1" strokeWidth={3} dot={{r: 4, fill: '#6366f1', strokeWidth: 2, stroke: '#fff'}} activeDot={{ r: 6 }} />
                                <Line yAxisId="right" type="monotone" name="Glucose (mmol/L)" dataKey="avg_glucose" stroke="#0ea5e9" strokeWidth={3} dot={{r: 4, fill: '#0ea5e9', strokeWidth: 2, stroke: '#fff'}} activeDot={{ r: 6 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* 3. System Usage by Hour (Bar Chart) - Spans Full Width */}
                <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
                    <div className="w-full flex items-center justify-between mb-4">
                        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                            <Clock className="text-teal-500" size={20} /> System Usage by Hour
                        </h2>
                        <span className="text-xs font-semibold bg-teal-50 text-teal-700 px-3 py-1 rounded-full border border-teal-100">
                            Peak Activity Mapper
                        </span>
                    </div>
                    <div className="w-full h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={usageHeatmap} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis dataKey="hour" tick={{fontSize: 11, fill: '#64748b'}} axisLine={false} tickLine={false} />
                                <YAxis tick={{fontSize: 12, fill: '#64748b'}} axisLine={false} tickLine={false} />
                                <Tooltip 
                                    cursor={{fill: '#f8fafc'}}
                                    contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    formatter={(value: any) => [`${value} Scans`, 'Usage Count']}
                                />
                                <Bar dataKey="submissions" fill="#14b8a6" radius={[4, 4, 0, 0]} maxBarSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ReportsDashboard;
