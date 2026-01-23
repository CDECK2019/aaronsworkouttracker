import React, { useState, useEffect } from 'react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
    Legend, ResponsiveContainer, AreaChart, Area
} from 'recharts';
import {
    BarChart3, Calendar, TrendingUp, TrendingDown,
    Scale, Dumbbell, Utensils, Brain, DollarSign, Check
} from 'lucide-react';
import localStorageService from '../services/localStorageService';

// Category definitions with colors and data fetching
const categories = [
    {
        id: 'weight',
        label: 'Weight',
        icon: Scale,
        color: '#10b981',
        unit: 'lbs',
        description: 'Body weight over time'
    },
    {
        id: 'workouts',
        label: 'Workouts',
        icon: Dumbbell,
        color: '#3b82f6',
        unit: 'sessions',
        description: 'Workout sessions logged'
    },
    {
        id: 'nutrition',
        label: 'Nutrition',
        icon: Utensils,
        color: '#f59e0b',
        unit: 'cal',
        description: 'Daily calorie intake'
    },
    {
        id: 'mindfulness',
        label: 'Mindfulness',
        icon: Brain,
        color: '#14b8a6',
        unit: 'mins',
        description: 'Meditation minutes'
    },
    {
        id: 'financial',
        label: 'Financial',
        icon: DollarSign,
        color: '#22c55e',
        unit: '%',
        description: 'Goal progress percentage'
    }
];

const timeRanges = [
    { id: 'all', label: 'All Time', days: null },
    { id: '90d', label: '90 Days', days: 90 },
    { id: '30d', label: '30 Days', days: 30 },
    { id: '7d', label: '7 Days', days: 7 }
];

// Data processing functions
const processWeightData = async () => {
    const data = await localStorageService.getWeightProgress?.() || [];
    return data.map(entry => ({
        date: entry.date,
        value: entry.weight,
        formatted: `${entry.weight} lbs`
    })).sort((a, b) => new Date(a.date) - new Date(b.date));
};

const processWorkoutData = async () => {
    const workouts = await localStorageService.getWorkouts() || [];
    // Group workouts by date
    const grouped = {};
    workouts.forEach(w => {
        const date = w.date?.split('T')[0] || w.date;
        if (!grouped[date]) grouped[date] = 0;
        grouped[date]++;
    });
    return Object.entries(grouped)
        .map(([date, count]) => ({ date, value: count, formatted: `${count} sessions` }))
        .sort((a, b) => new Date(a.date) - new Date(b.date));
};

const processNutritionData = async () => {
    // Get all nutrition logs from storage
    const nutritionKey = 'fitness_daily_nutrition';
    const allData = JSON.parse(localStorage.getItem(nutritionKey) || '{}');

    return Object.entries(allData)
        .map(([date, log]) => {
            let totalCal = 0;
            if (log.meals) {
                Object.values(log.meals).flat().forEach(m => {
                    totalCal += m.calories || 0;
                });
            }
            return { date, value: totalCal, formatted: `${totalCal} cal` };
        })
        .filter(d => d.value > 0)
        .sort((a, b) => new Date(a.date) - new Date(b.date));
};

const processMindfulnessData = async () => {
    const logs = await localStorageService.getMindfulnessLogs() || [];
    // Group by date
    const grouped = {};
    logs.forEach(log => {
        const date = log.date?.split('T')[0];
        if (!grouped[date]) grouped[date] = 0;
        grouped[date] += log.duration || 0;
    });
    return Object.entries(grouped)
        .map(([date, mins]) => ({ date, value: mins, formatted: `${mins} mins` }))
        .sort((a, b) => new Date(a.date) - new Date(b.date));
};

const processFinancialData = async () => {
    const data = await localStorageService.getFinancialData();
    if (!data?.goals?.length) return [];

    // Calculate overall goal progress over time (simplified: current snapshot)
    const totalTarget = data.goals.reduce((acc, g) => acc + (g.targetAmount || 0), 0);
    const totalCurrent = data.goals.reduce((acc, g) => acc + (g.currentAmount || 0), 0);
    const progress = totalTarget > 0 ? Math.round((totalCurrent / totalTarget) * 100) : 0;

    // For now, return single point (can be enhanced with history tracking)
    return [{
        date: new Date().toISOString().split('T')[0],
        value: progress,
        formatted: `${progress}%`
    }];
};

const dataProcessors = {
    weight: processWeightData,
    workouts: processWorkoutData,
    nutrition: processNutritionData,
    mindfulness: processMindfulnessData,
    financial: processFinancialData
};

// Custom Tooltip
const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white dark:bg-dark-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-dark-700">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                    {new Date(label).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </p>
                {payload.map((entry, index) => (
                    <p key={index} className="text-sm font-bold" style={{ color: entry.color }}>
                        {entry.name}: {entry.value} {categories.find(c => c.id === entry.dataKey)?.unit || ''}
                    </p>
                ))}
            </div>
        );
    }
    return null;
};

export default function VisualsHub() {
    const [selectedCategories, setSelectedCategories] = useState(['weight', 'workouts']);
    const [timeRange, setTimeRange] = useState('all');
    const [chartData, setChartData] = useState([]);
    const [categoryStats, setCategoryStats] = useState({});
    const [loading, setLoading] = useState(true);

    // Load data when selections change
    useEffect(() => {
        const loadData = async () => {
            setLoading(true);

            try {
                // Fetch data for all selected categories
                const rawData = {};
                for (const catId of selectedCategories) {
                    const processor = dataProcessors[catId];
                    if (processor) {
                        rawData[catId] = await processor();
                    }
                }

                // Calculate stats for each category
                const stats = {};
                for (const [catId, data] of Object.entries(rawData)) {
                    if (data.length > 0) {
                        const values = data.map(d => d.value);
                        stats[catId] = {
                            total: values.reduce((a, b) => a + b, 0),
                            latest: values[values.length - 1],
                            first: values[0],
                            trend: values.length >= 2 ? values[values.length - 1] - values[0] : 0,
                            count: values.length,
                            avg: Math.round(values.reduce((a, b) => a + b, 0) / values.length)
                        };
                    }
                }
                setCategoryStats(stats);

                // Merge all data by date
                const allDates = new Set();
                Object.values(rawData).forEach(data => {
                    data.forEach(d => allDates.add(d.date));
                });

                // Filter by time range
                const now = new Date();
                const range = timeRanges.find(r => r.id === timeRange);
                const cutoffDate = range?.days
                    ? new Date(now.getTime() - range.days * 24 * 60 * 60 * 1000)
                    : null;

                let filteredDates = Array.from(allDates)
                    .filter(date => !cutoffDate || new Date(date) >= cutoffDate)
                    .sort((a, b) => new Date(a) - new Date(b));

                // Build merged chart data
                const merged = filteredDates.map(date => {
                    const point = { date };
                    for (const [catId, data] of Object.entries(rawData)) {
                        const match = data.find(d => d.date === date);
                        point[catId] = match?.value || null;
                    }
                    return point;
                });

                setChartData(merged);
            } catch (error) {
                console.error('Error loading visual data:', error);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [selectedCategories, timeRange]);

    const toggleCategory = (catId) => {
        setSelectedCategories(prev =>
            prev.includes(catId)
                ? prev.filter(id => id !== catId)
                : [...prev, catId]
        );
    };

    const formatDateTick = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-dark-900 transition-colors p-6 md:p-8">
            <div className="max-w-7xl mx-auto space-y-8">

                {/* Header */}
                <div className="flex flex-col md:flex-row gap-6 mb-8">
                    <div className="flex-1">
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-3">
                            <BarChart3 className="w-8 h-8 text-purple-500" />
                            Progress Visuals
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400">
                            Track your lifetime progress across all categories
                        </p>
                    </div>
                </div>

                {/* Category Selector */}
                <div className="bg-white dark:bg-dark-800 p-6 rounded-xl shadow-sm">
                    <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">
                        Select Categories
                    </h3>
                    <div className="flex flex-wrap gap-3">
                        {categories.map(cat => {
                            const Icon = cat.icon;
                            const isSelected = selectedCategories.includes(cat.id);
                            return (
                                <button
                                    key={cat.id}
                                    onClick={() => toggleCategory(cat.id)}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-full border-2 transition-all duration-200 ${isSelected
                                            ? 'border-transparent text-white'
                                            : 'border-gray-200 dark:border-dark-600 text-gray-600 dark:text-gray-400 hover:border-gray-300'
                                        }`}
                                    style={isSelected ? { backgroundColor: cat.color } : {}}
                                >
                                    <Icon className="w-4 h-4" />
                                    <span className="font-medium">{cat.label}</span>
                                    {isSelected && <Check className="w-4 h-4" />}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Time Range Selector */}
                <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <span className="text-sm text-gray-500 dark:text-gray-400 mr-2">Time Range:</span>
                    <div className="flex gap-2">
                        {timeRanges.map(range => (
                            <button
                                key={range.id}
                                onClick={() => setTimeRange(range.id)}
                                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${timeRange === range.id
                                        ? 'bg-purple-500 text-white'
                                        : 'bg-gray-100 dark:bg-dark-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-dark-600'
                                    }`}
                            >
                                {range.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Chart */}
                <div className="bg-white dark:bg-dark-800 p-6 rounded-xl shadow-sm">
                    <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-6">Progress Over Time</h3>

                    {loading ? (
                        <div className="h-80 flex items-center justify-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
                        </div>
                    ) : chartData.length === 0 ? (
                        <div className="h-80 flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
                            <BarChart3 className="w-12 h-12 mb-4 opacity-50" />
                            <p className="text-lg font-medium">No data available</p>
                            <p className="text-sm">Start logging activities to see your progress</p>
                        </div>
                    ) : (
                        <ResponsiveContainer width="100%" height={350}>
                            <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                                <XAxis
                                    dataKey="date"
                                    tickFormatter={formatDateTick}
                                    tick={{ fill: '#9ca3af', fontSize: 12 }}
                                />
                                <YAxis tick={{ fill: '#9ca3af', fontSize: 12 }} />
                                <Tooltip content={<CustomTooltip />} />
                                <Legend />
                                {selectedCategories.map(catId => {
                                    const cat = categories.find(c => c.id === catId);
                                    return (
                                        <Line
                                            key={catId}
                                            type="monotone"
                                            dataKey={catId}
                                            name={cat.label}
                                            stroke={cat.color}
                                            strokeWidth={2}
                                            dot={{ fill: cat.color, strokeWidth: 2, r: 4 }}
                                            activeDot={{ r: 6 }}
                                            connectNulls
                                        />
                                    );
                                })}
                            </LineChart>
                        </ResponsiveContainer>
                    )}
                </div>

                {/* Stats Summary */}
                {Object.keys(categoryStats).length > 0 && (
                    <div className="bg-white dark:bg-dark-800 p-6 rounded-xl shadow-sm">
                        <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">Summary Stats</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {selectedCategories.map(catId => {
                                const cat = categories.find(c => c.id === catId);
                                const stats = categoryStats[catId];
                                if (!stats) return null;

                                const Icon = cat.icon;
                                const trendPositive = cat.id === 'weight' ? stats.trend < 0 : stats.trend > 0;

                                return (
                                    <div
                                        key={catId}
                                        className="p-4 rounded-xl border-2"
                                        style={{ borderColor: `${cat.color}40`, backgroundColor: `${cat.color}10` }}
                                    >
                                        <div className="flex items-center gap-2 mb-3">
                                            <Icon className="w-5 h-5" style={{ color: cat.color }} />
                                            <span className="font-bold text-gray-800 dark:text-white">{cat.label}</span>
                                        </div>
                                        <div className="space-y-2 text-sm">
                                            <div className="flex justify-between">
                                                <span className="text-gray-500 dark:text-gray-400">Latest</span>
                                                <span className="font-medium text-gray-800 dark:text-white">
                                                    {stats.latest} {cat.unit}
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-500 dark:text-gray-400">
                                                    {cat.id === 'workouts' || cat.id === 'mindfulness' ? 'Total' : 'Average'}
                                                </span>
                                                <span className="font-medium text-gray-800 dark:text-white">
                                                    {cat.id === 'workouts' || cat.id === 'mindfulness'
                                                        ? `${stats.total} ${cat.unit}`
                                                        : `${stats.avg} ${cat.unit}`
                                                    }
                                                </span>
                                            </div>
                                            {stats.count >= 2 && (
                                                <div className="flex justify-between items-center">
                                                    <span className="text-gray-500 dark:text-gray-400">Trend</span>
                                                    <span className={`font-medium flex items-center gap-1 ${trendPositive ? 'text-emerald-500' : 'text-rose-500'
                                                        }`}>
                                                        {trendPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                                                        {stats.trend > 0 ? '+' : ''}{stats.trend} {cat.unit}
                                                    </span>
                                                </div>
                                            )}
                                            <div className="flex justify-between">
                                                <span className="text-gray-500 dark:text-gray-400">Entries</span>
                                                <span className="font-medium text-gray-800 dark:text-white">{stats.count}</span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}
