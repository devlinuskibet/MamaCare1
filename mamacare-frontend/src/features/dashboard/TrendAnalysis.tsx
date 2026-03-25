import { useQuery } from '@tanstack/react-query';
import { TrendingUp, ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';
import { healthApi } from '../../api/health';

const TrendAnalysis = () => {
    const { data, isLoading } = useQuery({
        queryKey: ['healthTrends'],
        queryFn: healthApi.getTrends
    });

    if (isLoading) return <div className="p-4 text-center text-sm text-slate-500">Analyzing trends...</div>;

    // Handle empty data/state
    if (!data || !data.trends || data.trends.length === 0) {
        return (
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm h-full">
                <div className="flex items-center gap-2 mb-4">
                    <div className="p-2 bg-purple-100 rounded-lg text-purple-600">
                        <TrendingUp size={20} />
                    </div>
                    <h3 className="font-bold text-slate-800">Health Trends</h3>
                </div>
                <p className="text-sm text-slate-500">Not enough data to analyze trends yet.</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm h-full">
            <div className="flex items-center gap-2 mb-6">
                <div className="p-2 bg-purple-100 rounded-lg text-purple-600">
                    <TrendingUp size={20} />
                </div>
                <div>
                    <h3 className="font-bold text-slate-800">Health Trends</h3>
                    <p className="text-xs text-slate-500">AI-Powered Analysis</p>
                </div>
            </div>

            <div className="mb-6 p-4 bg-slate-50 rounded-xl border border-slate-100">
                <p className="text-sm font-medium text-slate-600">Overall Status</p>
                <p className="text-lg font-bold text-slate-800 mt-1">{data.overall_status}</p>
            </div>

            <div className="space-y-4">
                {data.trends.map((trend, index) => (
                    <div key={index} className="flex items-center justify-between pb-4 border-b border-slate-50 last:border-0 last:pb-0">
                        <div>
                            <p className="text-sm font-medium text-slate-700 capitalize">{trend.metric.replace('_', ' ')}</p>
                            <p className="text-xs text-slate-500">{trend.data_points} records analyzed</p>
                        </div>
                        <div className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold
                            ${trend.interpretation.includes('Risk') || trend.interpretation.includes('Rising')
                                ? 'bg-red-50 text-red-600'
                                : trend.interpretation === 'Decreasing' ? 'bg-blue-50 text-blue-600'
                                    : 'bg-green-50 text-green-600'
                            }`}>
                            {trend.interpretation.includes('Increasing') ? <ArrowUpRight size={14} />
                                : trend.interpretation.includes('Decreasing') ? <ArrowDownRight size={14} />
                                    : <Minus size={14} />}
                            {trend.interpretation}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TrendAnalysis;
