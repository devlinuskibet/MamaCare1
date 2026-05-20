import { useState, useEffect } from 'react';
import { Play, Clock, Activity, X } from 'lucide-react';
import BreathingCircle from './BreathingCircle';
import { endpoints } from '../../api/endpoints';

const getTrimester = (week: number) => {
    if (week <= 12) return 1;
    if (week <= 27) return 2;
    return 3;
};

const ExercisesPage = () => {
    const [currentWeek, setCurrentWeek] = useState<number>(24); // default 24 for context demo
    const [activeVideo, setActiveVideo] = useState<string | null>(null);
    const [activeMinutes, setActiveMinutes] = useState<number>(0);
    const [videoStartTime, setVideoStartTime] = useState<number | null>(null);

    // Initial data load
    useEffect(() => {
        // Fetch Wellness
        endpoints.wellness.get().then(res => {
            setActiveMinutes(res.data.active_minutes || 0);
        }).catch(console.error);

        // Fetch User context
        endpoints.user.getMe().then(res => {
            const lmp = res.data.lmp;
            if (lmp) {
                const lmpDate = new Date(lmp);
                const today = new Date();
                const diffTime = Math.abs(today.getTime() - lmpDate.getTime());
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                const weeks = Math.floor(diffDays / 7);
                // Lock strictly to 1-42. If invalid or null, mock 24 for demo purposes.
                setCurrentWeek(weeks > 0 && weeks <= 42 ? weeks : 24);
            }
        }).catch(console.error);
    }, []);

    const trimester = getTrimester(currentWeek);

    // Dynamic Video Data driven by gestation progress
    const allExercises: any = {
        1: [
            {
                title: "Morning Energy Flow",
                description: "Gentle grounding poses to wake up your body and build morning energy.",
                duration: "17:27",
                category: "Yoga",
                color: "bg-orange-100 text-orange-600",
                imageColor: "bg-orange-200",
                videoId: "mdw4B4Y8IGw"
            },
            {
                title: "Nausea & Bloating Relief",
                description: "Settle the stomach and relieve early pregnancy sickness with this quick flow.",
                duration: "1:27",
                category: "Therapy",
                color: "bg-teal-100 text-teal-600",
                imageColor: "bg-teal-200",
                videoId: "aaP5lmyoi-E"
            },
            {
                title: "Full Body Exercise",
                description: "A complete full-body workout adapted for first trimester safety.",
                duration: "10:09",
                category: "Fitness",
                color: "bg-blue-100 text-blue-600",
                imageColor: "bg-blue-200",
                videoId: "4N4xUOwZVLM"
            }
        ],
        2: [
            {
                title: "Back Pain Relief",
                description: "Targeted movements to alleviate lower back pressure and sciatica associated with a growing bump.",
                duration: "10:00",
                category: "Therapy",
                color: "bg-blue-100 text-blue-600",
                imageColor: "bg-blue-200",
                videoId: "33LLeqyVbG0" 
            },
            {
                title: "Prenatal Yoga for Energy",
                description: "Boost your second trimester energy with this invigorating flow.",
                duration: "23:00",
                category: "Yoga",
                color: "bg-green-100 text-green-600",
                imageColor: "bg-green-200",
                videoId: "D75ClMK09TA"
            },
            {
                title: "Leg & Hip Strengthening",
                description: "Build lower body strength to support your changing center of gravity.",
                duration: "15:00",
                category: "Strength",
                color: "bg-indigo-100 text-indigo-600",
                imageColor: "bg-indigo-200",
                videoId: "8CNAW6pP46g"
            }
        ],
        3: [
            {
                title: "Preparing for Labour",
                description: "Breathing techniques and hip-opening exercises for birth preparation.",
                duration: "10:00",
                category: "Birth Prep",
                color: "bg-purple-100 text-purple-600",
                imageColor: "bg-purple-200",
                videoId: "G2C2qEf3y9A" 
            },
            {
                title: "Pelvic Floor (Kegels+)",
                description: "Essential deep core and pelvic floor training for labor and recovery.",
                duration: "13:00",
                category: "Therapy",
                color: "bg-teal-100 text-teal-600",
                imageColor: "bg-teal-200",
                videoId: "Ilg-gQY2Rxc"
            },
            {
                title: "Deep Bedtime Relaxation",
                description: "A calming routine to help you unwind and improve third-trimester sleep quality.",
                duration: "14:00",
                category: "Meditation",
                color: "bg-blue-100 text-blue-600",
                imageColor: "bg-blue-200",
                videoId: "g9ixc_cvKk0"
            }
        ]
    };

    const currentExercises = allExercises[trimester] || allExercises[2];

    return (
        <div className="space-y-8 animate-in fade-in duration-300">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Wellness & Movement</h1>
                    <p className="text-slate-500 mt-1">Curated classes tailored to <span className="font-bold text-indigo-600">Trimester {trimester}</span> (Week {currentWeek}).</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content - Video Library */}
                <div className="lg:col-span-2 space-y-6">
                    <h2 className="text-xl font-bold text-slate-800 border-b border-slate-100 pb-2">Recommended for your stage</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {currentExercises.map((exercise: any, index: number) => (
                            <div 
                                key={index} 
                                onClick={() => {
                                    setActiveVideo(exercise.videoId);
                                    setVideoStartTime(Date.now());
                                }}
                                className="bg-white rounded-3xl p-4 border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer group flex flex-col"
                            >
                                <div className={`aspect-video rounded-2xl mb-5 ${exercise.imageColor} flex items-center justify-center relative overflow-hidden shrink-0`}>
                                    <img src={`https://img.youtube.com/vi/${exercise.videoId}/mqdefault.jpg`} alt="Thumbnail" className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                                    <div className="absolute inset-0 bg-slate-900/20 group-hover:bg-slate-900/40 transition-colors duration-300" />
                                    <div className="w-16 h-16 bg-white/95 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 backdrop-blur-sm z-10">
                                        <Play size={24} className="text-pink-600 ml-1" fill="currentColor" />
                                    </div>
                                    {currentWeek === 24 && exercise.videoId === '33LLeqyVbG0' && (
                                        <div className="absolute top-3 left-3 bg-amber-500 text-white font-bold text-[10px] uppercase px-3 py-1.5 rounded-full shadow-lg border-2 border-amber-400/50 backdrop-blur-md">
                                            Recommended for your stage (Week 24)
                                        </div>
                                    )}
                                </div>
                                <div className="space-y-3 flex-1 flex flex-col">
                                    <div className="flex items-center justify-between">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${exercise.color}`}>
                                            {exercise.category}
                                        </span>
                                        <div className="flex items-center gap-1.5 text-xs text-slate-500 font-bold bg-slate-50 px-2 py-1 rounded-lg">
                                            <Clock size={14} className="text-slate-400" />
                                            {exercise.duration}
                                        </div>
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors leading-tight">
                                        {exercise.title}
                                    </h3>
                                    <p className="text-sm text-slate-500 leading-relaxed max-w-sm flex-1">
                                        {exercise.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Dynamic Context Card (Ear of Corn) */}
                    {currentWeek === 24 ? (
                        <div className="bg-amber-50 rounded-3xl p-6 border border-amber-200 relative overflow-hidden shadow-sm animate-in zoom-in-95 duration-500">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-100 rounded-bl-full -z-10 opacity-50" />
                            <div className="text-4xl mb-4 drop-shadow-sm">🌽</div>
                            <h3 className="font-bold text-amber-900 text-lg mb-2">
                                Week 24: Growing with your Ear of Corn
                            </h3>
                            <p className="text-sm text-amber-800/90 leading-relaxed font-medium">
                                Your baby is developing fast! This stage often causes back strain. Try our curated therapy session to the left to strengthen your core and relieve the pressure.
                            </p>
                        </div>
                    ) : null}

                    {/* Progress Tracker with Gold State */}
                    {activeMinutes >= 120 ? (
                        <div className="bg-amber-50 p-6 rounded-3xl border border-amber-200 shadow-sm animate-in fade-in duration-500">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2.5 bg-amber-200 rounded-xl text-amber-700 shadow-inner">
                                    <Activity size={20} />
                                </div>
                                <h3 className="font-bold text-amber-900">Goal Reached!</h3>
                            </div>
                            <div className="space-y-4">
                                <p className="text-sm text-amber-800/90 leading-relaxed font-medium">
                                    Your Ear of Corn 🌽 is getting stronger by the day! Over 120 minutes of activity logged.
                                </p>
                                <div className="flex justify-between text-sm mt-2">
                                    <span className="text-amber-700/80 font-medium">Total Active Time</span>
                                    <span className="font-bold text-amber-900">{Math.floor(activeMinutes)} min</span>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 shadow-sm transition-all duration-300">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2.5 bg-indigo-100 rounded-xl text-indigo-600">
                                    <Activity size={20} />
                                </div>
                                <h3 className="font-bold text-slate-900">Weekly Goal</h3>
                            </div>
                            <div className="space-y-4">
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-600 font-medium">Active Minutes</span>
                                    <span className="font-bold text-indigo-900 transition-all">{Math.floor(activeMinutes)} / 120 min</span>
                                </div>
                                <div className="h-2.5 bg-slate-200 rounded-full overflow-hidden">
                                    <div 
                                        className="h-full bg-indigo-500 transition-all duration-1000 ease-out" 
                                        style={{ width: `${Math.min((activeMinutes / 120) * 100, 100)}%` }} 
                                    />
                                </div>
                                <p className="text-xs text-slate-500 text-center">
                                    You're doing great, mama! Keep moving.
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Interactive 4-4-4 Breathing Component */}
                    <BreathingCircle />
                </div>
            </div>

            {/* YouTube Modal popup */}
            {activeVideo && (() => {
                const handleCloseModal = () => {
                    setActiveVideo(null);
                    if (videoStartTime) {
                        const elapsedMins = (Date.now() - videoStartTime) / 60000;
                        if (elapsedMins > 0.5) {
                            // Optimistic update
                            setActiveMinutes(prev => prev + elapsedMins);
                            endpoints.wellness.sync({ minutes_added: elapsedMins }).catch(console.error);
                        }
                        setVideoStartTime(null);
                    }
                };
                
                return (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 animate-in fade-in zoom-in-95 duration-200">
                    <div className="absolute inset-0 bg-slate-900/95 backdrop-blur-sm" onClick={handleCloseModal} />
                    <div className="relative w-full max-w-5xl bg-black rounded-3xl overflow-hidden shadow-2xl border border-slate-700 max-h-[90vh] flex flex-col">
                        <div className="absolute -top-14 right-0 z-10 hidden sm:block">
                            <button onClick={handleCloseModal} className="p-3 bg-white/10 hover:bg-white text-white hover:text-slate-900 rounded-full transition-colors backdrop-blur-md">
                                <X size={24} />
                            </button>
                        </div>
                        <div className="aspect-video w-full bg-slate-900">
                            <iframe 
                                className="w-full h-full"
                                src={`https://www.youtube.com/embed/${activeVideo}?autoplay=1&rel=0&modestbranding=1`} 
                                title="YouTube video player" 
                                frameBorder="0" 
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                allowFullScreen
                            ></iframe>
                        </div>
                        {/* Mobile close bar */}
                        <div className="bg-slate-900 p-4 sm:hidden flex justify-end">
                            <button onClick={handleCloseModal} className="px-6 py-3 bg-slate-800 text-white font-bold rounded-xl w-full">Close Video</button>
                        </div>
                    </div>
                </div>
                );
            })()}
        </div>
    );
};

export default ExercisesPage;
