import React, { useState, useEffect } from 'react';
import { Briefcase, TrendingUp, Award, Plus, Calendar, X } from 'lucide-react';
import localStorageService from '../services/localStorageService';
import { toast } from 'react-toastify';

export default function CareerHub() {
    const [data, setData] = useState({ milestones: [] });
    const [goals, setGoals] = useState({ currentTitle: 'Not Set', targetTitle: 'Not Set' });
    const [newMilestone, setNewMilestone] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            const careerData = await localStorageService.getCareerData();
            const holisticGoals = await localStorageService.getHolisticGoals();

            setData(careerData);
            setGoals(holisticGoals.career || { currentTitle: 'Not Set', targetTitle: 'Not Set' });
        };
        fetchData();
    }, []);

    const addMilestone = async (e) => {
        e.preventDefault();
        if (!newMilestone) return;

        const milestone = {
            id: Date.now(),
            title: newMilestone,
            date: new Date().toISOString()
        };

        const updated = { ...data, milestones: [milestone, ...data.milestones] };
        await localStorageService.saveCareerData(updated);
        setData(updated);
        setNewMilestone('');
        toast.success("Milestone added");
    };

    const removeMilestone = async (id) => {
        const updated = { ...data, milestones: data.milestones.filter(m => m.id !== id) };
        await localStorageService.saveCareerData(updated);
        setData(updated);
    };

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-dark-900 p-6 md:p-8 space-y-8 animate-fade-in">

            {/* Header */}
            <div className="flex items-center gap-4">
                <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-full">
                    <Briefcase className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Career Hub</h1>
                    <p className="text-gray-600 dark:text-gray-400">Map your professional journey and milestones.</p>
                </div>
            </div>

            {/* Career Snapshot */}
            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-8 text-white shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <TrendingUp size={120} />
                </div>
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="text-center md:text-left">
                        <p className="text-emerald-100 uppercase text-xs font-bold tracking-wider mb-1">Current Role</p>
                        <h2 className="text-3xl font-bold">{goals.currentTitle || 'Not Set'}</h2>
                    </div>

                    <div className="hidden md:block h-px w-24 bg-emerald-400/50"></div>

                    <div className="text-center md:text-right">
                        <p className="text-emerald-100 uppercase text-xs font-bold tracking-wider mb-1">Target Role</p>
                        <h2 className="text-3xl font-bold">{goals.targetTitle || 'Not Set'}</h2>
                    </div>
                </div>
            </div>

            {/* Milestones */}
            <div className="space-y-6">

                <form onSubmit={addMilestone} className="flex gap-4">
                    <input
                        value={newMilestone}
                        onChange={(e) => setNewMilestone(e.target.value)}
                        placeholder="Add a career milestone..."
                        className="flex-1 px-4 py-3 bg-white dark:bg-dark-800 border-none rounded-xl shadow-sm focus:ring-2 focus:ring-emerald-500 dark:text-white"
                    />
                    <button type="submit" className="p-3 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-colors shadow-lg shadow-emerald-500/30">
                        <Plus />
                    </button>
                </form>

                <div className="space-y-4">
                    {data.milestones.map((milestone, index) => (
                        <div key={milestone.id} className="bg-white dark:bg-dark-800 p-6 rounded-xl shadow-sm border-l-4 border-emerald-500 flex justify-between items-start group">
                            <div className="flex gap-4">
                                <div className="mt-1">
                                    <Award className="text-emerald-500" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg text-gray-900 dark:text-white">{milestone.title}</h3>
                                    <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                                        <Calendar size={14} />
                                        {new Date(milestone.date).toLocaleDateString()}
                                    </div>
                                </div>
                            </div>
                            <button onClick={() => removeMilestone(milestone.id)} className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                <X size={18} />
                            </button>
                        </div>
                    ))}
                    {data.milestones.length === 0 && (
                        <div className="text-center py-12 text-gray-400 dark:text-gray-600">
                            <Award className="w-12 h-12 mx-auto mb-3 opacity-50" />
                            <p>No milestones recorded yet. Add your first achievement!</p>
                        </div>
                    )}
                </div>
            </div>

        </div>
    );
}
