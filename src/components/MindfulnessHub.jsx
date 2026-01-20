import React, { useState, useEffect } from 'react';
import MeditationCard from './MeditationCard';
import AffirmationWidget from './AffirmationWidget';
import { mindfulnessData } from '../data/mindfulnessData';
import localStorageService from '../services/localStorageService';
import { Brain, Calendar, Trophy } from 'lucide-react';

export default function MindfulnessHub() {
    const [logs, setLogs] = useState([]);
    const [activeCategory, setActiveCategory] = useState('all');

    useEffect(() => {
        const fetchLogs = async () => {
            const history = await localStorageService.getMindfulnessLogs();
            setLogs(history);
        };
        fetchLogs();
    }, []);

    const handleComplete = async (meditation) => {
        const log = {
            meditationId: meditation.id,
            title: meditation.title,
            duration: meditation.duration,
            date: new Date().toISOString(),
        };
        await localStorageService.logMindfulnessSession(log);
        const history = await localStorageService.getMindfulnessLogs();
        setLogs(history);
    };

    const totalMinutes = logs.reduce((acc, curr) => acc + curr.duration, 0);
    const totalSessions = logs.length;

    const filteredMeditations = activeCategory === 'all'
        ? mindfulnessData.meditations
        : mindfulnessData.meditations.filter(m => m.category === activeCategory);

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-dark-900 transition-colors p-6 md:p-8">
            <div className="max-w-7xl mx-auto space-y-8">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row gap-6 mb-8">
                    <div className="flex-1">
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Mindfulness Hub</h1>
                        <p className="text-gray-600 dark:text-gray-400">Center your mind and find your focus.</p>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white dark:bg-dark-800 p-4 rounded-xl shadow-sm flex items-center gap-3">
                            <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-full">
                                <ClockIcon className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 uppercase font-bold">Minutes</p>
                                <p className="text-xl font-bold text-gray-900 dark:text-white">{totalMinutes}</p>
                            </div>
                        </div>
                        <div className="bg-white dark:bg-dark-800 p-4 rounded-xl shadow-sm flex items-center gap-3">
                            <div className="p-3 bg-teal-100 dark:bg-teal-900/30 rounded-full">
                                <Brain className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 uppercase font-bold">Sessions</p>
                                <p className="text-xl font-bold text-gray-900 dark:text-white">{totalSessions}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Affirmation & Filter */}
                    <div className="space-y-6">
                        <AffirmationWidget />

                        <div className="bg-white dark:bg-dark-800 p-6 rounded-xl shadow-sm">
                            <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">Categories</h3>
                            <div className="space-y-2">
                                <button
                                    onClick={() => setActiveCategory('all')}
                                    className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${activeCategory === 'all'
                                        ? 'bg-gray-100 dark:bg-dark-700 text-emerald-600 dark:text-emerald-400 font-medium'
                                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-dark-700/50'
                                        }`}
                                >
                                    All Meditations
                                </button>
                                {mindfulnessData.categories.map(cat => (
                                    <button
                                        key={cat.id}
                                        onClick={() => setActiveCategory(cat.id)}
                                        className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${activeCategory === cat.id
                                            ? 'bg-gray-100 dark:bg-dark-700 text-emerald-600 dark:text-emerald-400 font-medium'
                                            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-dark-700/50'
                                            }`}
                                    >
                                        {cat.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Meditation Grid */}
                    <div className="lg:col-span-2">
                        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
                            {activeCategory === 'all' ? 'All Sessions' : mindfulnessData.categories.find(c => c.id === activeCategory)?.name}
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {filteredMeditations.map(med => (
                                <MeditationCard key={med.id} meditation={med} onComplete={handleComplete} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function ClockIcon({ className }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    );
}
