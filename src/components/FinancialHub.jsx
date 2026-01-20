import React, { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, Plus, Target, CheckCircle, Wallet, CreditCard, BarChart3, Edit2, X } from 'lucide-react';
import localStorageService from '../services/localStorageService';
import { toast } from 'react-toastify';

export default function FinancialHub() {
    const [goals, setGoals] = useState([]);
    const [newGoal, setNewGoal] = useState({ title: '', targetAmount: '', type: 'savings', unit: '$' });
    const [editingId, setEditingId] = useState(null);
    const [editValue, setEditValue] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            const financialData = await localStorageService.getFinancialData();
            if (financialData && financialData.goals) {
                setGoals(financialData.goals);
            }
        };
        fetchData();
    }, []);

    const handleAddGoal = async (e) => {
        e.preventDefault();
        if (!newGoal.title || !newGoal.targetAmount) return;

        const goal = {
            id: Date.now(),
            title: newGoal.title,
            currentAmount: 0,
            targetAmount: parseFloat(newGoal.targetAmount),
            type: newGoal.type,
            unit: newGoal.unit,
            isRecommended: false
        };

        const updatedGoals = [...goals, goal];
        await localStorageService.saveFinancialData({ goals: updatedGoals });
        setGoals(updatedGoals);
        setNewGoal({ title: '', targetAmount: '', type: 'savings', unit: '$' });
        toast.success("Goal added");
    };

    const updateProgress = async (id, newValue) => {
        const updatedGoals = goals.map(g => {
            if (g.id === id) {
                return { ...g, currentAmount: parseFloat(newValue) };
            }
            return g;
        });
        await localStorageService.saveFinancialData({ goals: updatedGoals });
        setGoals(updatedGoals);
        setEditingId(null);
        setEditValue('');
        toast.success("Progress updated");
    };

    const startEdit = (goal) => {
        setEditingId(goal.id);
        setEditValue(goal.currentAmount);
    };

    const deleteGoal = async (id) => {
        const updatedGoals = goals.filter(g => g.id !== id);
        await localStorageService.saveFinancialData({ goals: updatedGoals });
        setGoals(updatedGoals);
        toast.info("Goal removed");
    }

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-dark-900 p-6 md:p-8 space-y-8 animate-fade-in">

            {/* Header */}
            <div className="flex items-center gap-4">
                <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full">
                    <DollarSign className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Financial Trends</h1>
                    <p className="text-gray-600 dark:text-gray-400">Build better habits. Track your financial freedom.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Goals List */}
                <div className="lg:col-span-2 space-y-6">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                        <Target className="w-5 h-5 text-emerald-500" /> Active Goals & Habits
                    </h2>

                    {goals.map(goal => {
                        const progress = Math.min((goal.currentAmount / goal.targetAmount) * 100, 100);
                        const isCompleted = progress >= 100;
                        let icon = <Wallet className="w-6 h-6 text-emerald-500" />;
                        if (goal.type === 'debt') icon = <CreditCard className="w-6 h-6 text-red-500" />;
                        if (goal.type === 'investing') icon = <TrendingUp className="w-6 h-6 text-blue-500" />;

                        return (
                            <div key={goal.id} className="bg-white dark:bg-dark-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-dark-700 relative overflow-hidden group">
                                {isCompleted && (
                                    <div className="absolute top-0 right-0 bg-emerald-500 text-white text-xs px-3 py-1 rounded-bl-lg font-bold">
                                        COMPLETED
                                    </div>
                                )}

                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className={`p-3 rounded-full ${isCompleted ? 'bg-emerald-100 dark:bg-emerald-900/30' : 'bg-gray-100 dark:bg-dark-700'}`}>
                                            {icon}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-lg text-gray-900 dark:text-white">{goal.title}</h3>
                                            <p className="text-sm text-gray-500">{goal.isRecommended ? 'Recommended Habit' : 'Custom Goal'}</p>
                                        </div>
                                    </div>

                                    {!goal.isRecommended && (
                                        <button onClick={() => deleteGoal(goal.id)} className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <X size={18} />
                                        </button>
                                    )}
                                </div>

                                {editingId === goal.id ? (
                                    <div className="flex items-center gap-2 mb-4">
                                        <input
                                            type="number"
                                            value={editValue}
                                            onChange={(e) => setEditValue(e.target.value)}
                                            className="w-32 px-3 py-1 bg-gray-50 dark:bg-dark-700 border border-gray-300 dark:border-dark-600 rounded text-gray-900 dark:text-white"
                                        />
                                        <button onClick={() => updateProgress(goal.id, editValue)} className="text-green-600 font-bold text-sm">Save</button>
                                        <button onClick={() => setEditingId(null)} className="text-gray-500 text-sm">Cancel</button>
                                    </div>
                                ) : (
                                    <div className="flex items-end gap-2 mb-2">
                                        <span className="text-3xl font-bold text-gray-900 dark:text-white">
                                            {goal.unit === '$' ? '$' : ''}{goal.currentAmount.toLocaleString()}
                                            {goal.unit === '%' ? '%' : ''}
                                        </span>
                                        <span className="text-sm text-gray-500 mb-1.5">
                                            / {goal.unit === '$' ? '$' : ''}{goal.targetAmount.toLocaleString()}{goal.unit === '%' ? '%' : ''}
                                        </span>
                                        <button onClick={() => startEdit(goal)} className="ml-2 mb-1.5 text-gray-400 hover:text-emerald-500 transition-colors">
                                            <Edit2 size={16} />
                                        </button>
                                    </div>
                                )}

                                <div className="w-full bg-gray-200 dark:bg-dark-700 rounded-full h-3">
                                    <div
                                        className={`h-3 rounded-full transition-all duration-700 ${isCompleted ? 'bg-emerald-500' : goal.type === 'debt' ? 'bg-red-500' : 'bg-blue-500'}`}
                                        style={{ width: `${progress}%` }}
                                    ></div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Add Goal Form */}
                <div className="lg:col-span-1">
                    <div className="bg-white dark:bg-dark-800 p-6 rounded-xl shadow-sm sticky top-8">
                        <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">Add Custom Goal</h3>
                        <form onSubmit={handleAddGoal} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Goal Title</label>
                                <input
                                    value={newGoal.title}
                                    onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                                    placeholder="e.g. Save for Vacation"
                                    className="w-full px-3 py-2 bg-gray-50 dark:bg-dark-700 border border-gray-300 dark:border-dark-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Target Amount</label>
                                <input
                                    type="number"
                                    value={newGoal.targetAmount}
                                    onChange={(e) => setNewGoal({ ...newGoal, targetAmount: e.target.value })}
                                    placeholder="1000"
                                    className="w-full px-3 py-2 bg-gray-50 dark:bg-dark-700 border border-gray-300 dark:border-dark-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Type</label>
                                    <select
                                        value={newGoal.type}
                                        onChange={(e) => setNewGoal({ ...newGoal, type: e.target.value })}
                                        className="w-full px-3 py-2 bg-gray-50 dark:bg-dark-700 border border-gray-300 dark:border-dark-600 rounded-lg text-gray-900 dark:text-white"
                                    >
                                        <option value="savings">Savings</option>
                                        <option value="debt">Debt Payoff</option>
                                        <option value="investing">Investing</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Unit</label>
                                    <select
                                        value={newGoal.unit}
                                        onChange={(e) => setNewGoal({ ...newGoal, unit: e.target.value })}
                                        className="w-full px-3 py-2 bg-gray-50 dark:bg-dark-700 border border-gray-300 dark:border-dark-600 rounded-lg text-gray-900 dark:text-white"
                                    >
                                        <option value="$">$ (Currency)</option>
                                        <option value="%">% (Percentage)</option>
                                        <option value="">None (Count)</option>
                                    </select>
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full py-2 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-600/20"
                            >
                                Create Goal
                            </button>
                        </form>
                    </div>
                </div>

            </div>
        </div>
    );
}
