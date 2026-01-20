import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Target, Utensils, Brain, Save, DollarSign, BookOpen, Briefcase } from 'lucide-react';
import { toast } from 'react-toastify';
import localStorageService from '../services/localStorageService';

export default function HolisticGoalsForm() {
    const { register, handleSubmit, setValue } = useForm();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchGoals = async () => {
            const goals = await localStorageService.getHolisticGoals();
            if (goals) {
                // Fitness
                setValue('fitness.targetWeight', goals.fitness?.targetWeight);
                setValue('fitness.workoutsPerWeek', goals.fitness?.workoutsPerWeek);
                // Nutrition
                setValue('nutrition.calories', goals.nutrition?.calories);
                setValue('nutrition.protein', goals.nutrition?.protein);
                setValue('nutrition.carbs', goals.nutrition?.carbs);
                setValue('nutrition.fat', goals.nutrition?.fat);
                // Mindfulness
                setValue('mindfulness.minutesPerWeek', goals.mindfulness?.minutesPerWeek);
                // Financial
                setValue('financial.savingsGoal', goals.financial?.savingsGoal);
                setValue('financial.monthlyBudget', goals.financial?.monthlyBudget);
                // Intellectual
                setValue('intellectual.booksPerYear', goals.intellectual?.booksPerYear);
                // Career
                setValue('career.currentTitle', goals.career?.currentTitle);
                setValue('career.targetTitle', goals.career?.targetTitle);
            }
        };
        fetchGoals();
    }, [setValue]);

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            await localStorageService.saveHolisticGoals(data);
            toast.success("Goals updated successfully!");
        } catch (error) {
            console.error(error);
            toast.error("Failed to update goals.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 animate-fade-in pb-8">

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                {/* Fitness Section */}
                <div className="bg-emerald-50 dark:bg-emerald-900/10 p-6 rounded-xl border border-emerald-100 dark:border-emerald-800">
                    <div className="flex items-center gap-2 mb-4 text-emerald-700 dark:text-emerald-400">
                        <Target className="w-5 h-5" />
                        <h3 className="font-bold text-lg">Fitness Targets</h3>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Target Weight (kg)</label>
                            <input
                                type="number"
                                {...register("fitness.targetWeight", { valueAsNumber: true })}
                                className="w-full px-3 py-2 bg-white dark:bg-dark-800 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-emerald-500 text-gray-900 dark:text-white"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Workouts / Week</label>
                            <input
                                type="number"
                                {...register("fitness.workoutsPerWeek", { valueAsNumber: true })}
                                className="w-full px-3 py-2 bg-white dark:bg-dark-800 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-emerald-500 text-gray-900 dark:text-white"
                            />
                        </div>
                    </div>
                </div>

                {/* Mindfulness Section */}
                <div className="bg-teal-50 dark:bg-teal-900/10 p-6 rounded-xl border border-teal-100 dark:border-teal-800">
                    <div className="flex items-center gap-2 mb-4 text-teal-700 dark:text-teal-400">
                        <Brain className="w-5 h-5" />
                        <h3 className="font-bold text-lg">Mindfulness</h3>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Target Minutes / Week</label>
                        <input
                            type="number"
                            {...register("mindfulness.minutesPerWeek", { valueAsNumber: true })}
                            className="w-full px-3 py-2 bg-white dark:bg-dark-800 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-teal-500 text-gray-900 dark:text-white"
                        />
                    </div>
                </div>
            </div>

            {/* Nutrition Section */}
            <div className="bg-orange-50 dark:bg-orange-900/10 p-6 rounded-xl border border-orange-100 dark:border-orange-800">
                <div className="flex items-center gap-2 mb-4 text-orange-700 dark:text-orange-400">
                    <Utensils className="w-5 h-5" />
                    <h3 className="font-bold text-lg">Nutrition Goals</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Calories</label>
                        <input
                            type="number"
                            {...register("nutrition.calories", { valueAsNumber: true })}
                            className="w-full px-3 py-2 bg-white dark:bg-dark-800 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-orange-500 text-gray-900 dark:text-white"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Protein (g)</label>
                        <input
                            type="number"
                            {...register("nutrition.protein", { valueAsNumber: true })}
                            className="w-full px-3 py-2 bg-white dark:bg-dark-800 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-orange-500 text-gray-900 dark:text-white"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Carbs (g)</label>
                        <input
                            type="number"
                            {...register("nutrition.carbs", { valueAsNumber: true })}
                            className="w-full px-3 py-2 bg-white dark:bg-dark-800 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-orange-500 text-gray-900 dark:text-white"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Fat (g)</label>
                        <input
                            type="number"
                            {...register("nutrition.fat", { valueAsNumber: true })}
                            className="w-full px-3 py-2 bg-white dark:bg-dark-800 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-orange-500 text-gray-900 dark:text-white"
                        />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                {/* Financial Section */}
                <div className="bg-green-50 dark:bg-green-900/10 p-6 rounded-xl border border-green-100 dark:border-green-800">
                    <div className="flex items-center gap-2 mb-4 text-green-700 dark:text-green-400">
                        <DollarSign className="w-5 h-5" />
                        <h3 className="font-bold text-lg">Financial</h3>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Monthly Savings Goal</label>
                            <input
                                type="number"
                                {...register("financial.savingsGoal", { valueAsNumber: true })}
                                className="w-full px-3 py-2 bg-white dark:bg-dark-800 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-green-500 text-gray-900 dark:text-white"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Monthly Budget Limit</label>
                            <input
                                type="number"
                                {...register("financial.monthlyBudget", { valueAsNumber: true })}
                                className="w-full px-3 py-2 bg-white dark:bg-dark-800 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-green-500 text-gray-900 dark:text-white"
                            />
                        </div>
                    </div>
                </div>

                {/* Intellectual Section */}
                <div className="bg-blue-50 dark:bg-blue-900/10 p-6 rounded-xl border border-blue-100 dark:border-blue-800">
                    <div className="flex items-center gap-2 mb-4 text-blue-700 dark:text-blue-400">
                        <BookOpen className="w-5 h-5" />
                        <h3 className="font-bold text-lg">Intellectual</h3>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Books / Year Goal</label>
                            <input
                                type="number"
                                {...register("intellectual.booksPerYear", { valueAsNumber: true })}
                                className="w-full px-3 py-2 bg-white dark:bg-dark-800 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
                            />
                        </div>
                    </div>
                </div>

                {/* Career Section */}
                <div className="bg-emerald-50 dark:bg-emerald-900/10 p-6 rounded-xl border border-emerald-100 dark:border-emerald-800">
                    <div className="flex items-center gap-2 mb-4 text-emerald-700 dark:text-emerald-400">
                        <Briefcase className="w-5 h-5" />
                        <h3 className="font-bold text-lg">Career</h3>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Current Title</label>
                            <input
                                type="text"
                                {...register("career.currentTitle")}
                                className="w-full px-3 py-2 bg-white dark:bg-dark-800 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-emerald-500 text-gray-900 dark:text-white"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Target Title</label>
                            <input
                                type="text"
                                {...register("career.targetTitle")}
                                className="w-full px-3 py-2 bg-white dark:bg-dark-800 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-emerald-500 text-gray-900 dark:text-white"
                            />
                        </div>
                    </div>
                </div>

            </div>

            <div className="flex justify-end sticky bottom-4 bg-white/80 dark:bg-dark-900/80 backdrop-blur-sm p-4 rounded-xl border border-gray-200 dark:border-dark-700 shadow-xl z-10">
                <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center gap-2 px-8 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-600/20 font-bold"
                >
                    <Save className="w-5 h-5" />
                    {loading ? 'Saving...' : 'Save All Goals'}
                </button>
            </div>
        </form>
    );
}
