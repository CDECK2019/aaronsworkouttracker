import React, { useState, useEffect } from 'react';
import { Play, Pause, Clock } from 'lucide-react';

export default function MeditationCard({ meditation, onComplete }) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [timeLeft, setTimeLeft] = useState(meditation.duration * 60); // minutes to seconds

    useEffect(() => {
        let interval;
        if (isPlaying && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            setIsPlaying(false);
            if (onComplete) onComplete(meditation);
            setTimeLeft(meditation.duration * 60); // Reset after completion
        }
        return () => clearInterval(interval);
    }, [isPlaying, timeLeft, meditation, onComplete]);

    const togglePlay = () => setIsPlaying(!isPlaying);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const getCategoryColor = (cat) => {
        switch (cat) {
            case 'morning_focus': return 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400';
            case 'sleep': return 'bg-sky-100 text-sky-600 dark:bg-sky-900/30 dark:text-sky-400';
            case 'stress_relief': return 'bg-teal-100 text-teal-600 dark:bg-teal-900/30 dark:text-teal-400';
            default: return 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400';
        }
    };

    return (
        <div className="bg-white dark:bg-dark-800 rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(meditation.category)}`}>
                    {meditation.category.replace('_', ' ')}
                </span>
                <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm">
                    <Clock className="w-4 h-4 mr-1" />
                    {meditation.duration} min
                </div>
            </div>

            <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2">{meditation.title}</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">{meditation.description}</p>

            <div className="flex items-center justify-between mt-auto">
                <div className="text-2xl font-mono text-gray-700 dark:text-gray-200">
                    {formatTime(timeLeft)}
                </div>
                <button
                    onClick={togglePlay}
                    className={`p-3 rounded-full transition-colors ${isPlaying
                        ? 'bg-amber-100 text-amber-600 hover:bg-amber-200 dark:bg-amber-900/50 dark:text-amber-400'
                        : 'bg-emerald-100 text-emerald-600 hover:bg-emerald-200 dark:bg-emerald-900/50 dark:text-emerald-400'
                        }`}
                >
                    {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
                </button>
            </div>
        </div>
    );
}
