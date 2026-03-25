import { useState } from 'react';
import { Activity, Heart, Droplet, ArrowRight, Thermometer, User } from 'lucide-react';
import { healthApi, type PredictionInput, type PredictionOutput } from '../../api/health';

const VitalsForm = () => {

    const [formData, setFormData] = useState({
        systolic: '',
        diastolic: '',
        heartRate: '',
        glucose: '',
        temp: '',
        age: '30' // Added Age as it is required by backend model
    });

    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<PredictionOutput | null>(null);
    const [saveMessage, setSaveMessage] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setSaveMessage(null);

        const inputData: PredictionInput = {
            Age: Number(formData.age),
            SystolicBP: Number(formData.systolic),
            DiastolicBP: Number(formData.diastolic),
            BS: Number(formData.glucose),
            BodyTemp: Number(formData.temp) || 37.0,
            HeartRate: Number(formData.heartRate)
        };

        try {
            // 1. Get Prediction
            const prediction = await healthApi.predictRisk(inputData);
            setResult(prediction);

            // 2. Automatically save record to database
            await healthApi.addHealthRecord({
                systolic_bp: inputData.SystolicBP,
                diastolic_bp: inputData.DiastolicBP,
                blood_sugar: inputData.BS,
                body_temp: inputData.BodyTemp,
                heart_rate: inputData.HeartRate,
                risk_prediction: prediction.risk_level,
                confidence_score: prediction.confidence_score
            });
            
            setSaveMessage("Record Saved!");
            
            // Clear form after successful auto-save
            setFormData({ ...formData, systolic: '', diastolic: '', heartRate: '', glucose: '', temp: '' });

        } catch (error) {
            console.error("Analysis failed:", error);
            alert("Failed to analyze or save vitals. Please check connection.");
        } finally {
            setLoading(false);
        }
    };

    // If we have a result, show the Result Card
    if (result) {
        const isHighRisk = result.risk_level.toLowerCase() === 'high risk';
        const colorClass = isHighRisk ? 'bg-red-50 border-red-200 text-red-800' : 'bg-green-50 border-green-200 text-green-800';

        return (
            <div className="max-w-lg mx-auto mt-10 text-center space-y-6 animate-in fade-in zoom-in duration-300">
                <div className={`p-8 rounded-3xl border-2 ${colorClass}`}>
                    <h2 className="text-3xl font-bold mb-2 uppercase">
                        {result.risk_level}
                    </h2>
                    <p className="text-lg opacity-90">Confidence: {(result.confidence_score * 100).toFixed(1)}%</p>
                    
                    {saveMessage && (
                        <div className="mt-4 inline-flex items-center gap-2 bg-white/50 px-4 py-1 rounded-full text-sm font-bold border border-current animate-pulse">
                             <Activity size={14} /> {saveMessage}
                        </div>
                    )}
                </div>
                
                <div className="flex flex-col gap-3">
                    <button
                        onClick={() => setResult(null)}
                        className="w-full bg-slate-900 text-white px-8 py-3 rounded-xl hover:bg-slate-800 transition font-bold"
                    >
                        Check Another Reading
                    </button>
                    <p className="text-xs text-slate-400">
                        This reading has been automatically synchronized with your health history.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto">
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-slate-800">Check Your Vitals</h2>
                <p className="text-slate-500">Enter your latest readings below.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Age */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Age</label>
                        <div className="relative">
                            <User className="absolute left-3 top-3 text-slate-400" size={20} />
                            <input
                                type="number"
                                required
                                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition"
                                placeholder="30"
                                value={formData.age}
                                onChange={e => setFormData({ ...formData, age: e.target.value })}
                            />
                        </div>
                    </div>

                    {/* BP Systolic */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Systolic BP (Top)</label>
                        <div className="relative">
                            <Activity className="absolute left-3 top-3 text-slate-400" size={20} />
                            <input
                                type="number"
                                required
                                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition"
                                placeholder="120"
                                value={formData.systolic}
                                onChange={e => setFormData({ ...formData, systolic: e.target.value })}
                            />
                        </div>
                    </div>

                    {/* BP Diastolic */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Diastolic BP (Bottom)</label>
                        <div className="relative">
                            <Activity className="absolute left-3 top-3 text-slate-400" size={20} />
                            <input
                                type="number"
                                required
                                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition"
                                placeholder="80"
                                value={formData.diastolic}
                                onChange={e => setFormData({ ...formData, diastolic: e.target.value })}
                            />
                        </div>
                    </div>

                    {/* Heart Rate */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Heart Rate</label>
                        <div className="relative">
                            <Heart className="absolute left-3 top-3 text-slate-400" size={20} />
                            <input
                                type="number"
                                required
                                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition"
                                placeholder="72"
                                value={formData.heartRate}
                                onChange={e => setFormData({ ...formData, heartRate: e.target.value })}
                            />
                        </div>
                    </div>

                    {/* Glucose */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Glucose Level</label>
                        <div className="relative">
                            <Droplet className="absolute left-3 top-3 text-slate-400" size={20} />
                            <input
                                type="number"
                                required
                                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition"
                                placeholder="5.5"
                                value={formData.glucose}
                                onChange={e => setFormData({ ...formData, glucose: e.target.value })}
                            />
                        </div>
                    </div>

                    {/* Body Temp */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Body Temperature (°C)</label>
                        <div className="relative">
                            <Thermometer className="absolute left-3 top-3 text-slate-400" size={20} />
                            <input
                                type="number"
                                required
                                step="0.1"
                                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition"
                                placeholder="37.0"
                                value={formData.temp}
                                onChange={e => setFormData({ ...formData, temp: e.target.value })}
                            />
                        </div>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-pink-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-pink-700 transition flex items-center justify-center gap-2"
                >
                    {loading ? 'Analyzing...' : <>Analyze Risk <ArrowRight /></>}
                </button>
            </form>
        </div>
    );
};

export default VitalsForm;