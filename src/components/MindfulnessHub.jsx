import React, { useState, useEffect } from 'react';
import {
    Brain, Calendar, RefreshCw, Quote, Clock, Plus, X,
    Edit2, CheckCircle, Check, Sparkles
} from 'lucide-react';
import { toast } from 'react-toastify';
import localStorageService from '../services/localStorageService';
import {
    affirmationCategories,
    getRandomAffirmation,
    colorClasses
} from '../data/affirmationsData';

const PREFERENCES_KEY = 'fitness_affirmation_preferences';

export default function MindfulnessHub() {
    const [logs, setLogs] = useState([]);
    const [affirmation, setAffirmation] = useState(null);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [sessionDuration, setSessionDuration] = useState('');
    const [editingSession, setEditingSession] = useState(null);
    const [editDuration, setEditDuration] = useState(0);
    const [showAllCategories, setShowAllCategories] = useState(false);

    // Load data on mount
    useEffect(() => {
        const fetchData = async () => {
            // Load mindfulness logs
            const history = await localStorageService.getMindfulnessLogs();
            setLogs(history);

            // Load preferences
            const saved = localStorage.getItem(PREFERENCES_KEY);
            if (saved) {
                const prefs = JSON.parse(saved);
                setSelectedCategories(prefs.selectedCategories || []);
            }

            // Get initial affirmation
            const savedPrefs = saved ? JSON.parse(saved) : null;
            setAffirmation(getRandomAffirmation(savedPrefs?.selectedCategories || []));
        };
        fetchData();
    }, []);

    // Save preferences when categories change
    useEffect(() => {
        localStorage.setItem(PREFERENCES_KEY, JSON.stringify({
            selectedCategories,
            lastUpdated: new Date().toISOString()
        }));
    }, [selectedCategories]);

    const refreshAffirmation = () => {
        setAffirmation(getRandomAffirmation(selectedCategories));
    };

    const toggleCategory = (categoryId) => {
        setSelectedCategories(prev => {
            const newCategories = prev.includes(categoryId)
                ? prev.filter(id => id !== categoryId)
                : [...prev, categoryId];

            // Get new affirmation with updated categories
            setTimeout(() => {
                setAffirmation(getRandomAffirmation(newCategories));
            }, 100);

            return newCategories;
        });
    };

    const handleLogSession = async () => {
        const duration = parseInt(sessionDuration);
        if (!duration || duration <= 0) {
            toast.error('Please enter a valid duration');
            return;
        }

        const log = {
            title: 'Mindfulness Session',
            duration,
            date: new Date().toISOString(),
        };

        await localStorageService.logMindfulnessSession(log);
        const history = await localStorageService.getMindfulnessLogs();
        setLogs(history);
        setSessionDuration('');
        toast.success(`${duration} minute session logged!`);
    };

    const handleDeleteSession = async (sessionId) => {
        await localStorageService.deleteMindfulnessSession(sessionId);
        const history = await localStorageService.getMindfulnessLogs();
        setLogs(history);
        toast.info('Session removed');
    };

    const handleEditSession = (session) => {
        setEditingSession(session.$id);
        setEditDuration(session.duration);
    };

    const handleSaveEdit = async (sessionId) => {
        if (editDuration <= 0) return;
        await localStorageService.updateMindfulnessSession(sessionId, { duration: editDuration });
        const history = await localStorageService.getMindfulnessLogs();
        setLogs(history);
        setEditingSession(null);
        toast.success('Session updated');
    };

    const totalMinutes = logs.reduce((acc, curr) => acc + curr.duration, 0);
    const totalSessions = logs.length;
    const sortedLogs = [...logs].sort((a, b) => new Date(b.date) - new Date(a.date));

    // Show first 6 categories, or all if expanded
    const visibleCategories = showAllCategories
        ? affirmationCategories
        : affirmationCategories.slice(0, 6);

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-dark-900 transition-colors p-6 md:p-8">
            <div className="max-w-7xl mx-auto space-y-8">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row gap-6 mb-8">
                    <div className="flex-1">
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Mindfulness Hub</h1>
                        <p className="text-gray-600 dark:text-gray-400">Center your mind with daily affirmations and track your practice.</p>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white dark:bg-dark-800 p-4 rounded-xl shadow-sm flex items-center gap-3">
                            <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-full">
                                <Clock className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
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

                {/* Featured Affirmation */}
                {affirmation && (
                    <div className={`bg-gradient-to-br ${colorClasses[affirmation.categoryColor]?.gradient || 'from-emerald-500 to-teal-600'} rounded-2xl p-8 text-white relative overflow-hidden`}>
                        <div className="absolute top-0 right-0 p-32 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16"></div>

                        <div className="relative z-10">
                            <div className="flex justify-between items-center mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="bg-white/20 p-2 rounded-lg">
                                        <Quote className="w-6 h-6 text-white" />
                                    </div>
                                    <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium">
                                        {affirmation.categoryIcon} {affirmation.categoryName}
                                    </span>
                                </div>
                                <button
                                    onClick={refreshAffirmation}
                                    className="p-2 hover:bg-white/10 rounded-full transition-colors"
                                    title="New affirmation"
                                >
                                    <RefreshCw className="w-5 h-5 text-white/80" />
                                </button>
                            </div>

                            <blockquote className="text-2xl md:text-3xl font-medium leading-relaxed mb-4">
                                "{affirmation.text}"
                            </blockquote>

                            <p className="text-white/70 text-sm font-medium uppercase tracking-wider">
                                Daily Affirmation
                            </p>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Session Logger & History */}
                    <div className="space-y-6">
                        {/* Quick Session Logger */}
                        <div className="bg-white dark:bg-dark-800 p-6 rounded-xl shadow-sm">
                            <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                                <Sparkles className="w-5 h-5 text-teal-500" />
                                Log Session
                            </h3>
                            <div className="flex gap-3">
                                <div className="flex-1 relative">
                                    <input
                                        type="number"
                                        value={sessionDuration}
                                        onChange={(e) => setSessionDuration(e.target.value)}
                                        placeholder="Duration"
                                        min="1"
                                        className="w-full px-4 py-3 bg-gray-50 dark:bg-dark-700 border border-gray-200 dark:border-dark-600 rounded-xl text-gray-800 dark:text-white placeholder-gray-400 focus:outline-none focus:border-teal-500"
                                    />
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">min</span>
                                </div>
                                <button
                                    onClick={handleLogSession}
                                    className="px-4 py-3 bg-teal-500 hover:bg-teal-600 text-white rounded-xl transition-colors flex items-center gap-2"
                                >
                                    <Plus className="w-5 h-5" />
                                    Log
                                </button>
                            </div>
                        </div>

                        {/* Session History */}
                        <div className="bg-white dark:bg-dark-800 p-6 rounded-xl shadow-sm">
                            <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                                <Calendar className="w-5 h-5 text-teal-500" />
                                Recent Sessions
                            </h3>
                            <div className="space-y-3 max-h-80 overflow-y-auto">
                                {sortedLogs.length === 0 ? (
                                    <p className="text-sm text-gray-500 italic text-center py-4">No sessions logged yet</p>
                                ) : (
                                    sortedLogs.slice(0, 10).map(session => (
                                        <div key={session.$id} className="group flex items-center justify-between p-3 bg-gray-50 dark:bg-dark-700 rounded-lg hover:bg-teal-50 dark:hover:bg-teal-900/10 transition-colors">
                                            <div className="flex-1">
                                                <p className="font-medium text-gray-800 dark:text-white text-sm">{session.title}</p>
                                                {editingSession === session.$id ? (
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <input
                                                            type="number"
                                                            value={editDuration}
                                                            onChange={(e) => setEditDuration(parseInt(e.target.value) || 0)}
                                                            className="w-16 px-2 py-1 text-xs border rounded dark:bg-dark-600 dark:border-dark-500"
                                                            min="1"
                                                        />
                                                        <span className="text-xs text-gray-500">mins</span>
                                                        <button
                                                            onClick={() => handleSaveEdit(session.$id)}
                                                            className="text-emerald-500 hover:text-emerald-600"
                                                        >
                                                            <CheckCircle size={16} />
                                                        </button>
                                                        <button
                                                            onClick={() => setEditingSession(null)}
                                                            className="text-gray-400 hover:text-gray-600"
                                                        >
                                                            <X size={16} />
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <p className="text-xs text-gray-500">
                                                        {session.duration} mins • {new Date(session.date).toLocaleDateString()}
                                                    </p>
                                                )}
                                            </div>
                                            {editingSession !== session.$id && (
                                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button
                                                        onClick={() => handleEditSession(session)}
                                                        className="p-1 text-gray-400 hover:text-teal-500"
                                                    >
                                                        <Edit2 size={14} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteSession(session.$id)}
                                                        className="p-1 text-gray-400 hover:text-red-500"
                                                    >
                                                        <X size={14} />
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Affirmation Categories */}
                    <div className="lg:col-span-2">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                                Affirmation Categories
                            </h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                {selectedCategories.length === 0
                                    ? 'All categories active'
                                    : `${selectedCategories.length} selected`}
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {visibleCategories.map(category => {
                                const isSelected = selectedCategories.length === 0 || selectedCategories.includes(category.id);
                                const colors = colorClasses[category.color] || colorClasses.emerald;

                                return (
                                    <button
                                        key={category.id}
                                        onClick={() => toggleCategory(category.id)}
                                        className={`p-4 rounded-xl border-2 text-left transition-all duration-300 ${isSelected
                                                ? `${colors.bg} ${colors.border} ring-2 ring-offset-2 ring-offset-gray-100 dark:ring-offset-dark-900 ${colors.border.replace('border-', 'ring-')}`
                                                : 'bg-gray-50 dark:bg-dark-800 border-gray-200 dark:border-dark-700 opacity-60 hover:opacity-100'
                                            }`}
                                    >
                                        <div className="flex items-start justify-between mb-2">
                                            <span className="text-2xl">{category.icon}</span>
                                            <div className={`w-5 h-5 rounded-full flex items-center justify-center ${isSelected
                                                    ? `${colors.bg} ${colors.text}`
                                                    : 'bg-gray-200 dark:bg-dark-600'
                                                }`}>
                                                {isSelected && <Check className="w-3 h-3" />}
                                            </div>
                                        </div>
                                        <h3 className={`font-semibold mb-1 ${isSelected ? colors.text : 'text-gray-600 dark:text-gray-400'
                                            }`}>
                                            {category.name}
                                        </h3>
                                        <p className="text-xs text-gray-500 dark:text-gray-500 line-clamp-2">
                                            {category.description}
                                        </p>
                                    </button>
                                );
                            })}
                        </div>

                        {/* Show More/Less Button */}
                        {affirmationCategories.length > 6 && (
                            <button
                                onClick={() => setShowAllCategories(!showAllCategories)}
                                className="mt-4 w-full py-3 text-center text-teal-600 dark:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-900/10 rounded-xl transition-colors font-medium"
                            >
                                {showAllCategories ? 'Show Less' : `Show All ${affirmationCategories.length} Categories`}
                            </button>
                        )}

                        {/* Reset Selection */}
                        {selectedCategories.length > 0 && (
                            <button
                                onClick={() => {
                                    setSelectedCategories([]);
                                    setAffirmation(getRandomAffirmation([]));
                                }}
                                className="mt-2 w-full py-2 text-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-sm transition-colors"
                            >
                                Reset to all categories
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
