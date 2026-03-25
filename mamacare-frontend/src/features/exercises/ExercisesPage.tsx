import { Play, Clock, Activity, Wind } from 'lucide-react';

const ExercisesPage = () => {
    const exercises = [
        {
            title: "Morning Flow - 1st Trimester",
            description: "Gentle stretches to wake up your body and reduce morning stiffness.",
            duration: "15 min",
            level: "Beginner",
            category: "Yoga",
            color: "bg-orange-100 text-orange-600",
            imageColor: "bg-orange-200"
        },
        {
            title: "Back Pain Relief",
            description: "Targeted movements to alleviate lower back pressure and improve posture.",
            duration: "20 min",
            level: "All Levels",
            category: "Therapy",
            color: "bg-blue-100 text-blue-600",
            imageColor: "bg-blue-200"
        },
        {
            title: "Preparing for Labor",
            description: "Breathing techniques and hip-opening exercises for birth preparation.",
            duration: "30 min",
            level: "Intermediate",
            category: "Birth Prep",
            color: "bg-purple-100 text-purple-600",
            imageColor: "bg-purple-200"
        },
        {
            title: "Bedtime Relaxation",
            description: "Calming routine to help you unwind and improve sleep quality.",
            duration: "10 min",
            level: "Beginner",
            category: "Meditation",
            color: "bg-indigo-100 text-indigo-600",
            imageColor: "bg-indigo-200"
        }
    ];

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-slate-800">Wellness & Movement</h1>
                <p className="text-slate-500">Curated exercises for a healthy pregnancy journey.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content - Video Library */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {exercises.map((exercise, index) => (
                            <div key={index} className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer group">
                                <div className={`aspect-video rounded-xl mb-4 ${exercise.imageColor} flex items-center justify-center relative overflow-hidden`}>
                                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors" />
                                    <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                                        <Play size={20} className="text-slate-900 ml-1" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${exercise.color}`}>
                                            {exercise.category}
                                        </span>
                                        <div className="flex items-center gap-1 text-xs text-slate-500 font-medium">
                                            <Clock size={14} />
                                            {exercise.duration}
                                        </div>
                                    </div>
                                    <h3 className="font-bold text-slate-800 group-hover:text-pink-600 transition-colors">
                                        {exercise.title}
                                    </h3>
                                    <p className="text-sm text-slate-500 line-clamp-2">
                                        {exercise.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Sidebar - Daily Zen */}
                <div className="space-y-6">
                    <div className="bg-gradient-to-br from-teal-50 to-emerald-50 p-6 rounded-2xl border border-teal-100 text-center">
                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 text-teal-600 shadow-sm animate-breathe">
                            <Wind size={32} />
                        </div>
                        <h3 className="font-bold text-teal-900 text-lg mb-2">Daily Zen</h3>
                        <p className="text-sm text-teal-800/80 mb-6">
                            Take a moment to breathe. Inhale for 4, hold for 4, exhale for 4.
                        </p>
                        <button className="w-full py-3 bg-white text-teal-700 font-bold rounded-xl shadow-sm hover:shadow hover:bg-teal-50 transition-all">
                            Start Breathing Session
                        </button>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-pink-50 rounded-lg text-pink-600">
                                <Activity size={20} />
                            </div>
                            <h3 className="font-bold text-slate-800">Weekly Goal</h3>
                        </div>
                        <div className="space-y-4">
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-600">Active Minutes</span>
                                <span className="font-bold text-slate-900">45 / 120 min</span>
                            </div>
                            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                <div className="h-full bg-pink-500 w-[37%]" />
                            </div>
                            <p className="text-xs text-slate-500 text-center">
                                You're doing great, mama! Keep moving.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ExercisesPage;
