import React, { useState, useEffect } from 'react';
import { BookOpen, Target, Plus, Edit2, X, Trash2, CheckCircle, TrendingUp } from 'lucide-react';
import localStorageService from '../services/localStorageService';
import { toast } from 'react-toastify';

// Goal category options (user can choose or add custom)
const goalCategories = [
    { id: 'reading', label: 'Reading', icon: '📚' },
    { id: 'skill', label: 'Skill Development', icon: '🧠' },
    { id: 'course', label: 'Course / Certification', icon: '🎓' },
    { id: 'language', label: 'Language Learning', icon: '🌍' },
    { id: 'practice', label: 'Practice / Training', icon: '🎯' },
    { id: 'other', label: 'Other', icon: '💡' }
];

export default function IntellectualHub() {
    const [goals, setGoals] = useState([]);
    const [newGoal, setNewGoal] = useState({
        title: '',
        target: '',
        unit: 'items',
        category: 'reading',
        description: ''
    });
    const [editingId, setEditingId] = useState(null);
    const [editValues, setEditValues] = useState({ title: '', current: '', target: '', unit: '', category: '', description: '' });

    useEffect(() => {
        const fetchData = async () => {
            const intData = await localStorageService.getIntellectualData();
            // New structure: { goals: [...] }
            if (intData && intData.goals) {
                setGoals(intData.goals);
            } else if (intData && (intData.books || intData.skills)) {
                // Migration: convert old structure to new
                const migratedGoals = [];
                if (intData.books && intData.books.length > 0) {
                    migratedGoals.push({
                        id: Date.now(),
                        title: 'Books to read',
                        current: intData.books.filter(b => b.status === 'completed').length,
                        target: 12,
                        unit: 'books',
                        category: 'reading',
                        description: 'Annual reading goal'
                    });
                }
                if (intData.skills && intData.skills.length > 0) {
                    migratedGoals.push({
                        id: Date.now() + 1,
                        title: 'Skills to learn',
                        current: intData.skills.filter(s => s.status === 'completed').length,
                        target: 5,
                        unit: 'skills',
                        category: 'skill',
                        description: 'Skill development goal'
                    });
                }
                setGoals(migratedGoals);
            }
        };
        fetchData();
    }, []);

    const handleAddGoal = async (e) => {
        e.preventDefault();
        if (!newGoal.title || !newGoal.target) {
            toast.error('Please enter a title and target');
            return;
        }

        const goal = {
            id: Date.now(),
            title: newGoal.title,
            current: 0,
            target: parseFloat(newGoal.target),
            unit: newGoal.unit || 'items',
            category: newGoal.category,
            description: newGoal.description,
            createdAt: new Date().toISOString()
        };

        const updatedGoals = [...goals, goal];
        await localStorageService.saveIntellectualData({ goals: updatedGoals });
        setGoals(updatedGoals);
        setNewGoal({ title: '', target: '', unit: 'items', category: 'reading', description: '' });
        toast.success('Goal added');
    };

    const startEdit = (goal) => {
        setEditingId(goal.id);
        setEditValues({
            title: goal.title,
            current: goal.current,
            target: goal.target,
            unit: goal.unit,
            category: goal.category,
            description: goal.description || ''
        });
    };

    const saveEdit = async (id) => {
        const updatedGoals = goals.map(g => {
            if (g.id === id) {
                return {
                    ...g,
                    title: editValues.title,
                    current: parseFloat(editValues.current) || 0,
                    target: parseFloat(editValues.target) || 1,
                    unit: editValues.unit,
                    category: editValues.category,
                    description: editValues.description
                };
            }
            return g;
        });
        await localStorageService.saveIntellectualData({ goals: updatedGoals });
        setGoals(updatedGoals);
        setEditingId(null);
        toast.success('Goal updated');
    };

    const deleteGoal = async (id) => {
        const updatedGoals = goals.filter(g => g.id !== id);
        await localStorageService.saveIntellectualData({ goals: updatedGoals });
        setGoals(updatedGoals);
        toast.info('Goal removed');
    };

    const incrementProgress = async (id) => {
        const updatedGoals = goals.map(g => {
            if (g.id === id && g.current < g.target) {
                return { ...g, current: g.current + 1 };
            }
            return g;
        });
        await localStorageService.saveIntellectualData({ goals: updatedGoals });
        setGoals(updatedGoals);
    };

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-dark-900 p-6 md:p-8 space-y-8 animate-fade-in">

            {/* Header */}
            <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                    <BookOpen className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Intellectual Hub</h1>
                    <p className="text-gray-600 dark:text-gray-400">Track your learning and growth goals</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Goals List */}
                <div className="lg:col-span-2 space-y-6">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                        <Target className="w-5 h-5 text-blue-500" /> Your Learning Goals
                    </h2>

                    {goals.length === 0 ? (
                        <div className="bg-white dark:bg-dark-800 p-8 rounded-xl text-center border border-gray-100 dark:border-dark-700">
                            <BookOpen className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                            <p className="text-gray-500 dark:text-gray-400 mb-2">No goals yet</p>
                            <p className="text-gray-400 dark:text-gray-500 text-sm">Add your first learning goal to get started</p>
                        </div>
                    ) : (
                        goals.map(goal => {
                            const progress = Math.min((goal.current / goal.target) * 100, 100);
                            const isCompleted = progress >= 100;
                            const categoryInfo = goalCategories.find(c => c.id === goal.category) || goalCategories[5];

                            return (
                                <div key={goal.id} className="bg-white dark:bg-dark-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-dark-700 relative overflow-hidden group">
                                    {isCompleted && (
                                        <div className="absolute top-0 right-0 bg-blue-500 text-white text-xs px-3 py-1 rounded-bl-lg font-bold flex items-center gap-1">
                                            <CheckCircle size={12} /> COMPLETED
                                        </div>
                                    )}

                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className={`p-3 rounded-full text-2xl ${isCompleted ? 'bg-blue-100 dark:bg-blue-900/30' : 'bg-gray-100 dark:bg-dark-700'}`}>
                                                {categoryInfo.icon}
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-lg text-gray-900 dark:text-white">{goal.title}</h3>
                                                <p className="text-sm text-gray-500">{categoryInfo.label}</p>
                                            </div>
                                        </div>

                                        <div className="flex gap-1">
                                            <button
                                                onClick={() => incrementProgress(goal.id)}
                                                disabled={isCompleted}
                                                className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors opacity-0 group-hover:opacity-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                                title="Add progress"
                                            >
                                                <Plus size={18} />
                                            </button>
                                            <button
                                                onClick={() => startEdit(goal)}
                                                className="p-2 text-gray-400 hover:text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                                                title="Edit goal"
                                            >
                                                <Edit2 size={18} />
                                            </button>
                                            <button
                                                onClick={() => deleteGoal(goal.id)}
                                                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                                                title="Delete goal"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>

                                    {editingId === goal.id ? (
                                        <div className="space-y-3 mb-4 bg-gray-50 dark:bg-dark-700 p-4 rounded-lg border border-gray-200 dark:border-dark-600">
                                            <div>
                                                <label className="text-xs text-gray-500 block mb-1">Title</label>
                                                <input
                                                    type="text"
                                                    value={editValues.title}
                                                    onChange={(e) => setEditValues({ ...editValues, title: e.target.value })}
                                                    className="w-full px-3 py-2 text-sm border rounded-lg dark:bg-dark-800 dark:border-dark-500 dark:text-white"
                                                />
                                            </div>
                                            <div className="grid grid-cols-3 gap-3">
                                                <div>
                                                    <label className="text-xs text-gray-500 block mb-1">Current</label>
                                                    <input
                                                        type="number"
                                                        value={editValues.current}
                                                        onChange={(e) => setEditValues({ ...editValues, current: e.target.value })}
                                                        className="w-full px-3 py-2 text-sm border rounded-lg dark:bg-dark-800 dark:border-dark-500 dark:text-white"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="text-xs text-gray-500 block mb-1">Target</label>
                                                    <input
                                                        type="number"
                                                        value={editValues.target}
                                                        onChange={(e) => setEditValues({ ...editValues, target: e.target.value })}
                                                        className="w-full px-3 py-2 text-sm border rounded-lg dark:bg-dark-800 dark:border-dark-500 dark:text-white"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="text-xs text-gray-500 block mb-1">Unit</label>
                                                    <input
                                                        type="text"
                                                        value={editValues.unit}
                                                        onChange={(e) => setEditValues({ ...editValues, unit: e.target.value })}
                                                        className="w-full px-3 py-2 text-sm border rounded-lg dark:bg-dark-800 dark:border-dark-500 dark:text-white"
                                                        placeholder="books, hours, etc."
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="text-xs text-gray-500 block mb-1">Category</label>
                                                <select
                                                    value={editValues.category}
                                                    onChange={(e) => setEditValues({ ...editValues, category: e.target.value })}
                                                    className="w-full px-3 py-2 text-sm border rounded-lg dark:bg-dark-800 dark:border-dark-500 dark:text-white"
                                                >
                                                    {goalCategories.map(c => (
                                                        <option key={c.id} value={c.id}>{c.icon} {c.label}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="flex justify-end gap-2 mt-3">
                                                <button onClick={() => setEditingId(null)} className="text-sm text-gray-500 hover:text-gray-700 px-3 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-600">
                                                    Cancel
                                                </button>
                                                <button onClick={() => saveEdit(goal.id)} className="text-sm bg-blue-500 text-white px-4 py-1.5 rounded-lg hover:bg-blue-600">
                                                    Save
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            {goal.description && (
                                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">{goal.description}</p>
                                            )}
                                            <div className="flex items-end gap-2 mb-3">
                                                <span className="text-3xl font-bold text-gray-900 dark:text-white">
                                                    {goal.current}
                                                </span>
                                                <span className="text-sm text-gray-500 mb-1.5">
                                                    / {goal.target} {goal.unit}
                                                </span>
                                            </div>
                                        </>
                                    )}

                                    <div className="w-full bg-gray-200 dark:bg-dark-700 rounded-full h-3">
                                        <div
                                            className={`h-3 rounded-full transition-all duration-700 ${isCompleted ? 'bg-blue-500' : 'bg-blue-400'}`}
                                            style={{ width: `${progress}%` }}
                                        ></div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>

                {/* Add Goal Form */}
                <div className="lg:col-span-1">
                    <div className="bg-white dark:bg-dark-800 p-6 rounded-xl shadow-sm sticky top-8 border border-gray-100 dark:border-dark-700">
                        <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">Add Learning Goal</h3>
                        <form onSubmit={handleAddGoal} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Goal Title</label>
                                <input
                                    value={newGoal.title}
                                    onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                                    placeholder="e.g., Read 12 books, Learn Spanish"
                                    className="w-full px-4 py-2 bg-gray-50 dark:bg-dark-700 border border-gray-300 dark:border-dark-600 rounded-lg text-gray-900 dark:text-white"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
                                <select
                                    value={newGoal.category}
                                    onChange={(e) => setNewGoal({ ...newGoal, category: e.target.value })}
                                    className="w-full px-4 py-2 bg-gray-50 dark:bg-dark-700 border border-gray-300 dark:border-dark-600 rounded-lg text-gray-900 dark:text-white"
                                >
                                    {goalCategories.map(c => (
                                        <option key={c.id} value={c.id}>{c.icon} {c.label}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Target Amount</label>
                                    <input
                                        type="number"
                                        value={newGoal.target}
                                        onChange={(e) => setNewGoal({ ...newGoal, target: e.target.value })}
                                        placeholder="e.g., 12"
                                        className="w-full px-4 py-2 bg-gray-50 dark:bg-dark-700 border border-gray-300 dark:border-dark-600 rounded-lg text-gray-900 dark:text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Unit</label>
                                    <input
                                        value={newGoal.unit}
                                        onChange={(e) => setNewGoal({ ...newGoal, unit: e.target.value })}
                                        placeholder="books, hours, etc."
                                        className="w-full px-4 py-2 bg-gray-50 dark:bg-dark-700 border border-gray-300 dark:border-dark-600 rounded-lg text-gray-900 dark:text-white"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description (optional)</label>
                                <textarea
                                    value={newGoal.description}
                                    onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
                                    placeholder="What's this goal about?"
                                    rows={2}
                                    className="w-full px-4 py-2 bg-gray-50 dark:bg-dark-700 border border-gray-300 dark:border-dark-600 rounded-lg text-gray-900 dark:text-white resize-none"
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                            >
                                <Plus className="w-5 h-5" /> Add Goal
                            </button>
                        </form>
                    </div>
                </div>

            </div>
        </div>
    );
}
