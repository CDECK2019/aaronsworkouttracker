import React, { useState, useEffect } from 'react';
import { Brain, DollarSign, BookOpen, Briefcase, TrendingUp, Target, Edit2, Save as SaveIcon, X, Dumbbell, Activity } from 'lucide-react';
import localStorageService from '../services/localStorageService';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function HolisticOverview() {
    const [stats, setStats] = useState({
        fitness: { currentWeight: 0, targetWeight: 0, workoutsPerWeek: 0 },
        mindfulness: { current: 0, target: 0 },
        financial: { activeGoal: null, progress: 0 },
        intellectual: { booksRead: 0, targetBooks: 0, label: 'Intellectual' },
        career: { current: '', target: '', nextMilestone: null }
    });
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(null); // 'fitness', 'mindfulness', 'financial', 'intellectual', 'career'
    const [editValues, setEditValues] = useState({});

    const fetchData = async () => {
        try {
            // 1. Fetch Goals & Profile
            const goals = await localStorageService.getHolisticGoals();
            const profile = await localStorageService.getUserInformation(null, null); // getting local profile

            // 2. Fitness Stats
            // Assuming profile.weight is current, goals.fitness.targetWeight is target
            const currentWeight = profile?.weight !== 'n/a' ? parseFloat(profile.weight) : 0;

            // 3. Mindfulness Stats
            const sessions = await localStorageService.getMindfulnessLogs();
            const now = new Date();
            const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
            const weeklyMinutes = sessions
                .filter(s => new Date(s.date) >= startOfWeek)
                .reduce((acc, s) => acc + (s.duration || 0), 0);

            // 4. Financial Stats
            const finData = await localStorageService.getFinancialData();
            const activeGoal = finData?.goals?.find(g => !g.isCompleted) || finData?.goals?.[0];
            const finProgress = activeGoal ? Math.min((activeGoal.currentAmount / activeGoal.targetAmount) * 100, 100) : 0;

            // 5. Intellectual Stats
            const intData = await localStorageService.getIntellectualData();
            const booksRead = intData.books.filter(b => b.status === 'completed').length;

            // 6. Career Stats
            const careerData = await localStorageService.getCareerData();
            // Find next upcoming milestone or showing "Not Set"
            // For this logic, let's just show the explicit Target Title from goals, 
            // BUT if that's missing, show the latest milestone as "Current Status"
            const nextMilestone = careerData.milestones?.[0]; // Assuming sorted new to old? Need to check. 
            // Usually we add to start of array, so [0] is latest created. 

            setStats({
                fitness: {
                    currentWeight: currentWeight || 0,
                    targetWeight: goals.fitness?.targetWeight || 0,
                    workoutsPerWeek: goals.fitness?.workoutsPerWeek || 3
                },
                mindfulness: {
                    current: weeklyMinutes,
                    target: goals.mindfulness?.minutesPerWeek || 60
                },
                financial: {
                    activeGoal: activeGoal,
                    progress: finProgress
                },
                intellectual: {
                    booksRead: booksRead,
                    targetBooks: goals.intellectual?.booksPerYear || 12,
                    label: intData.category1Label || 'Intellectual'
                },
                career: {
                    current: goals.career?.currentTitle || 'Not Set',
                    target: goals.career?.targetTitle || 'Not Set',
                    nextMilestone: nextMilestone
                }
            });

            // Initialize edit values
            setEditValues({
                fitnessTargetWeight: goals.fitness?.targetWeight || 0,
                mindfulnessTarget: goals.mindfulness?.minutesPerWeek || 60,
                financialTarget: activeGoal?.targetAmount || 0,
                intellectualTarget: goals.intellectual?.booksPerYear || 12,
                careerTarget: goals.career?.targetTitle || ''
            });

        } catch (error) {
            console.error("Error fetching overview stats:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const startEditing = (section, e) => {
        e.preventDefault(); // prevent link navigation
        setEditing(section);
    };

    const cancelEditing = (e) => {
        e.preventDefault();
        setEditing(null);
    };

    const saveEdits = async (e, section) => {
        e.preventDefault();
        try {
            const currentGoals = await localStorageService.getHolisticGoals();

            if (section === 'fitness') {
                await localStorageService.saveHolisticGoals({
                    ...currentGoals,
                    fitness: { ...currentGoals.fitness, targetWeight: parseFloat(editValues.fitnessTargetWeight) }
                });
            } else if (section === 'mindfulness') {
                await localStorageService.saveHolisticGoals({
                    ...currentGoals,
                    mindfulness: { ...currentGoals.mindfulness, minutesPerWeek: parseInt(editValues.mindfulnessTarget) }
                });
            } else if (section === 'financial' && stats.financial.activeGoal) {
                // Update the specific financial goal in FinancialData
                const finData = await localStorageService.getFinancialData();
                const updatedGoals = finData.goals.map(g =>
                    g.id === stats.financial.activeGoal.id
                        ? { ...g, targetAmount: parseFloat(editValues.financialTarget) }
                        : g
                );
                await localStorageService.saveFinancialData({ goals: updatedGoals });
            } else if (section === 'intellectual') {
                await localStorageService.saveHolisticGoals({
                    ...currentGoals,
                    intellectual: { ...currentGoals.intellectual, booksPerYear: parseInt(editValues.intellectualTarget) }
                });
            } else if (section === 'career') {
                // deep sync: update target title AND add as new milestone
                const careerData = await localStorageService.getCareerData();
                const newMilestone = {
                    id: Date.now(),
                    title: editValues.careerTarget,
                    date: new Date().toISOString()
                };
                const updatedMilestones = [newMilestone, ...(careerData.milestones || [])];

                await localStorageService.saveCareerData({ ...careerData, milestones: updatedMilestones });

                // Also update holistic goals for fallback
                await localStorageService.saveHolisticGoals({
                    ...currentGoals,
                    career: { ...currentGoals.career, targetTitle: editValues.careerTarget }
                });
            }

            setEditing(null);
            fetchData(); // Refresh data
            toast.success("Goal updated!");
        } catch (error) {
            console.error(error);
            toast.error("Failed to update.");
        }
    };

    const handleInputChange = (field, value) => {
        setEditValues(prev => ({ ...prev, [field]: value }));
    };

    if (loading) return null;

    const renderEditButton = (section) => (
        <button
            onClick={(e) => startEditing(section, e)}
            className="absolute top-3 right-3 p-1.5 text-gray-400 hover:text-emerald-500 hover:bg-white/50 rounded-full opacity-0 group-hover:opacity-100 transition-all"
            title="Edit Goal"
        >
            <Edit2 size={14} />
        </button>
    );

    const renderSaveCancel = (section, saveHandler) => (
        <div className="absolute top-3 right-3 flex gap-1">
            <button
                onClick={(e) => saveHandler(e, section)}
                className="p-1.5 bg-emerald-500 text-white rounded-full hover:bg-emerald-600 shadow-sm"
            >
                <SaveIcon size={14} />
            </button>
            <button
                onClick={cancelEditing}
                className="p-1.5 bg-gray-200 text-gray-600 rounded-full hover:bg-gray-300"
            >
                <X size={14} />
            </button>
        </div>
    );

    return (
        <div className="bg-white dark:bg-dark-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-dark-700 animate-fade-in mb-8">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
                <DashboardGridIcon className="w-6 h-6 text-emerald-500" />
                Your Holistic Pulse
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">

                {/* Fitness Tile */}
                <Link to="/userprofile" className="group relative p-5 bg-orange-50 dark:bg-orange-900/10 rounded-2xl hover:bg-orange-100 dark:hover:bg-orange-900/20 transition-all border border-transparent hover:border-orange-200 dark:hover:border-orange-800/30">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2.5 bg-orange-100 dark:bg-orange-900/30 rounded-xl text-orange-600 dark:text-orange-400">
                            <Activity size={20} />
                        </div>
                        <span className="font-bold text-gray-700 dark:text-gray-200">Fitness</span>
                    </div>

                    {editing === 'fitness' ? (
                        <div onClick={e => e.preventDefault()}>
                            <label className="text-xs text-gray-500 font-bold mb-1 block">Target Weight (lbs)</label>
                            <input
                                type="number"
                                value={editValues.fitnessTargetWeight}
                                onChange={e => handleInputChange('fitnessTargetWeight', e.target.value)}
                                className="w-full p-1 text-sm border rounded mb-2"
                                autoFocus
                            />
                            {renderSaveCancel('fitness', saveEdits)}
                        </div>
                    ) : (
                        <>
                            {renderEditButton('fitness')}
                            <div className="flex justify-between items-end mb-2">
                                <div>
                                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.fitness.currentWeight}<span className="text-sm font-normal text-gray-500 ml-1">lbs</span></p>
                                    <p className="text-xs text-gray-500">Current</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">{stats.fitness.targetWeight}<span className="text-xs font-normal text-gray-500 ml-1">lbs</span></p>
                                    <p className="text-xs text-gray-500">Target</p>
                                </div>
                            </div>
                            <div className="w-full bg-orange-200 dark:bg-orange-800 rounded-full h-1.5 mt-2">
                                <div className="bg-orange-500 h-1.5 rounded-full" style={{ width: '60%' }}></div>
                            </div>
                        </>
                    )}
                </Link>

                {/* Mindfulness Tile */}
                <Link to="/mindfulness" className="group relative p-5 bg-teal-50 dark:bg-teal-900/10 rounded-2xl hover:bg-teal-100 dark:hover:bg-teal-900/20 transition-all border border-transparent hover:border-teal-200 dark:hover:border-teal-800/30">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2.5 bg-teal-100 dark:bg-teal-900/30 rounded-xl text-teal-600 dark:text-teal-400">
                            <Brain size={20} />
                        </div>
                        <span className="font-bold text-gray-700 dark:text-gray-200">Mindfulness</span>
                    </div>

                    {editing === 'mindfulness' ? (
                        <div onClick={e => e.preventDefault()}>
                            <label className="text-xs text-gray-500 font-bold mb-1 block">Weekly Goal (mins)</label>
                            <input
                                type="number"
                                value={editValues.mindfulnessTarget}
                                onChange={e => handleInputChange('mindfulnessTarget', e.target.value)}
                                className="w-full p-1 text-sm border rounded mb-2"
                                autoFocus
                            />
                            {renderSaveCancel('mindfulness', saveEdits)}
                        </div>
                    ) : (
                        <>
                            {renderEditButton('mindfulness')}
                            <div className="flex justify-between items-end mb-1">
                                <span className="text-2xl font-bold text-gray-900 dark:text-white">{stats.mindfulness.current}<span className="text-sm font-normal text-gray-500 ml-1">m</span></span>
                                <span className="text-xs text-gray-500 mb-1">/ {stats.mindfulness.target}m</span>
                            </div>
                            <div className="w-full bg-teal-200 dark:bg-teal-800 rounded-full h-1.5">
                                <div
                                    className="bg-teal-500 h-1.5 rounded-full"
                                    style={{ width: `${Math.min((stats.mindfulness.current / stats.mindfulness.target) * 100, 100)}%` }}
                                ></div>
                            </div>
                        </>
                    )}
                </Link>

                {/* Financial Tile */}
                <Link to="/financial" className="group relative p-5 bg-green-50 dark:bg-green-900/10 rounded-2xl hover:bg-green-100 dark:hover:bg-green-900/20 transition-all border border-transparent hover:border-green-200 dark:hover:border-green-800/30">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2.5 bg-green-100 dark:bg-green-900/30 rounded-xl text-green-600 dark:text-green-400">
                            <DollarSign size={20} />
                        </div>
                        <span className="font-bold text-gray-700 dark:text-gray-200">Financial</span>
                    </div>

                    {editing === 'financial' && stats.financial.activeGoal ? (
                        <div onClick={e => e.preventDefault()}>
                            <label className="text-xs text-gray-500 font-bold mb-1 block">Target Amount</label>
                            <input
                                type="number"
                                value={editValues.financialTarget}
                                onChange={e => handleInputChange('financialTarget', e.target.value)}
                                className="w-full p-1 text-sm border rounded mb-2"
                                autoFocus
                            />
                            {renderSaveCancel('financial', saveEdits)}
                        </div>
                    ) : (
                        <>
                            {stats.financial.activeGoal && renderEditButton('financial')}
                            {stats.financial.activeGoal ? (
                                <div>
                                    <p className="text-xs text-gray-500 truncate mb-1">{stats.financial.activeGoal.title}</p>
                                    <div className="flex justify-between items-end mb-1">
                                        <span className="text-lg font-bold text-gray-900 dark:text-white truncate">
                                            {stats.financial.activeGoal.unit === '$' ? '$' : ''}
                                            {stats.financial.activeGoal.currentAmount.toLocaleString()}
                                        </span>
                                        <span className="text-xs text-gray-500 mb-1">{Math.round(stats.financial.progress)}%</span>
                                    </div>
                                    <div className="w-full bg-green-200 dark:bg-green-800 rounded-full h-1.5">
                                        <div
                                            className="bg-green-500 h-1.5 rounded-full"
                                            style={{ width: `${stats.financial.progress}%` }}
                                        ></div>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-sm text-gray-500 italic mt-4">No active goals</p>
                            )}
                        </>
                    )}
                </Link>

                {/* Intellectual Tile */}
                <Link to="/intellectual" className="group relative p-5 bg-blue-50 dark:bg-blue-900/10 rounded-2xl hover:bg-blue-100 dark:hover:bg-blue-900/20 transition-all border border-transparent hover:border-blue-200 dark:hover:border-blue-800/30">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2.5 bg-blue-100 dark:bg-blue-900/30 rounded-xl text-blue-600 dark:text-blue-400">
                            <BookOpen size={20} />
                        </div>
                        <span className="font-bold text-gray-700 dark:text-gray-200">{stats.intellectual.label}</span>
                    </div>

                    {editing === 'intellectual' ? (
                        <div onClick={e => e.preventDefault()}>
                            <label className="text-xs text-gray-500 font-bold mb-1 block">Annual Book Goal</label>
                            <input
                                type="number"
                                value={editValues.intellectualTarget}
                                onChange={e => handleInputChange('intellectualTarget', e.target.value)}
                                className="w-full p-1 text-sm border rounded mb-2"
                                autoFocus
                            />
                            {renderSaveCancel('intellectual', saveEdits)}
                        </div>
                    ) : (
                        <>
                            {renderEditButton('intellectual')}
                            <div className="flex justify-between items-end mb-1">
                                <span className="text-2xl font-bold text-gray-900 dark:text-white">{stats.intellectual.booksRead}</span>
                                <span className="text-xs text-gray-500 mb-1">/ {stats.intellectual.targetBooks}</span>
                            </div>
                            <div className="w-full bg-blue-200 dark:bg-blue-800 rounded-full h-1.5">
                                <div
                                    className="bg-blue-500 h-1.5 rounded-full"
                                    style={{ width: `${Math.min((stats.intellectual.booksRead / stats.intellectual.targetBooks) * 100, 100)}%` }}
                                ></div>
                            </div>
                        </>
                    )}
                </Link>

                {/* Career Tile */}
                <Link to="/career" className="group relative p-5 bg-emerald-50 dark:bg-emerald-900/10 rounded-2xl hover:bg-emerald-100 dark:hover:bg-emerald-900/20 transition-all border border-transparent hover:border-emerald-200 dark:hover:border-emerald-800/30">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2.5 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl text-emerald-600 dark:text-emerald-400">
                            <Briefcase size={20} />
                        </div>
                        <span className="font-bold text-gray-700 dark:text-gray-200">Career</span>
                    </div>

                    {editing === 'career' ? (
                        <div onClick={e => e.preventDefault()}>
                            <label className="text-xs text-gray-500 font-bold mb-1 block">Target Role</label>
                            <input
                                type="text"
                                value={editValues.careerTarget}
                                onChange={e => handleInputChange('careerTarget', e.target.value)}
                                className="w-full p-1 text-sm border rounded mb-2"
                                autoFocus
                            />
                            {renderSaveCancel('career', saveEdits)}
                        </div>
                    ) : (
                        <>
                            {renderEditButton('career')}
                            <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Target Role</p>
                                <p className="font-bold text-gray-900 dark:text-white truncate text-sm" title={stats.career.target}>
                                    {stats.career.target || 'Not Set'}
                                </p>
                                {stats.career.nextMilestone && (
                                    <div className="mt-2 pt-2 border-t border-emerald-200 dark:border-emerald-800/50">
                                        <p className="text-xs text-emerald-600 dark:text-emerald-400 truncate">Latest: {stats.career.nextMilestone.title}</p>
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </Link>

            </div>
        </div>
    );
}

function DashboardGridIcon({ className }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <rect width="7" height="7" x="3" y="3" rx="1" />
            <rect width="7" height="7" x="14" y="3" rx="1" />
            <rect width="7" height="7" x="14" y="14" rx="1" />
            <rect width="7" height="7" x="3" y="14" rx="1" />
        </svg>
    )
}
