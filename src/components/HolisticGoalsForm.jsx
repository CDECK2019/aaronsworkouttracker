import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Target, Utensils, Brain, Save, DollarSign, BookOpen, Briefcase, Award } from 'lucide-react';
import { toast } from 'react-toastify';
import localStorageService from '../services/localStorageService';

export default function HolisticGoalsForm({ section = null }) {
    const { register, handleSubmit, setValue } = useForm();
    const [loading, setLoading] = useState(false);
    const [financialGoals, setFinancialGoals] = useState([]);
    const [intellectualLabels, setIntellectualLabels] = useState({ category1: 'Books Read', category2: 'Skills Mastered' });
    const [careerMilestones, setCareerMilestones] = useState([]);

    useEffect(() => {
        const fetchGoals = async () => {
            const goals = await localStorageService.getHolisticGoals();
            const finData = await localStorageService.getFinancialData();
            const intData = await localStorageService.getIntellectualData();

            if (intData) {
                setIntellectualLabels({
                    category1: intData.category1Label || 'Books Read',
                    category2: intData.category2Label || 'Skills Mastered'
                });
            }

            // Fetch career milestones
            const careerData = await localStorageService.getCareerData();
            if (careerData && careerData.milestones) {
                setCareerMilestones(careerData.milestones.slice(0, 3));
            }

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
                // Intellectual
                setValue('intellectual.booksPerYear', goals.intellectual?.booksPerYear);
                // Career
                setValue('career.currentTitle', goals.career?.currentTitle);
                setValue('career.targetTitle', goals.career?.targetTitle);
            }

            if (finData && finData.goals) {
                setFinancialGoals(finData.goals);
                // Pre-fill form values for dynamic financial goals
                finData.goals.forEach((goal, index) => {
                    setValue(`financial.goals.${index}.targetAmount`, goal.targetAmount);
                });
            }
        };
        fetchGoals();
    }, [setValue]);

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            // 1. Save Standard Holistic Goals
            const currentGoals = await localStorageService.getHolisticGoals();
            const holisticData = {
                ...currentGoals,
                ...(section === 'fitness' || !section ? { fitness: data.fitness } : {}),
                ...(section === 'nutrition' || !section ? { nutrition: data.nutrition } : {}),
                ...(section === 'mindfulness' || !section ? { mindfulness: data.mindfulness } : {}),
                ...(section === 'intellectual' || !section ? { intellectual: data.intellectual } : {}),
                ...(section === 'career' || !section ? { career: data.career } : {}),
            };
            await localStorageService.saveHolisticGoals(holisticData);

            // 2. Save Dynamic Financial Goals
            if (section === 'financial' || !section) {
                const updatedFinancialGoals = financialGoals.map((goal, index) => ({
                    ...goal,
                    targetAmount: data.financial?.goals?.[index]?.targetAmount || goal.targetAmount
                }));
                await localStorageService.saveFinancialData({ goals: updatedFinancialGoals });
                setFinancialGoals(updatedFinancialGoals);
            }

            toast.success("Goals synced successfully!");
        } catch (error) {
            console.error(error);
            toast.error("Failed to update goals.");
        } finally {
            setLoading(false);
        }
    };

    const renderFitness = () => (
        <div className="bg-emerald-50 dark:bg-emerald-900/10 p-6 rounded-xl border border-emerald-100 dark:border-emerald-800">
            <div className="flex items-center gap-2 mb-4 text-emerald-700 dark:text-emerald-400">
                <Target className="w-5 h-5" />
                <h3 className="font-bold text-lg">Fitness Targets</h3>
            </div>
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Target Weight (lbs)</label>
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
    );

    const renderNutrition = () => (
        <div className="bg-orange-50 dark:bg-orange-900/10 p-6 rounded-xl border border-orange-100 dark:border-orange-800">
            <div className="flex items-center gap-2 mb-4 text-orange-700 dark:text-orange-400">
                <Utensils className="w-5 h-5" />
                <h3 className="font-bold text-lg">Nutrition Goals</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
    );

    const renderMindfulness = () => (
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
    );

    const renderFinancial = () => (
        <div className="bg-green-50 dark:bg-green-900/10 p-6 rounded-xl border border-green-100 dark:border-green-800">
            <div className="flex items-center gap-2 mb-4 text-green-700 dark:text-green-400">
                <DollarSign className="w-5 h-5" />
                <h3 className="font-bold text-lg">Financial Targets</h3>
            </div>
            <div className="space-y-4">
                {financialGoals.length === 0 && (
                    <p className="text-gray-500 text-sm">No active financial goals found. Add them in the Financial Hub.</p>
                )}
                {financialGoals.map((goal, index) => (
                    <div key={goal.id}>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            {goal.title} ({goal.unit || '$'})
                        </label>
                        <input
                            type="number"
                            {...register(`financial.goals.${index}.targetAmount`, { valueAsNumber: true })}
                            className="w-full px-3 py-2 bg-white dark:bg-dark-800 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-green-500 text-gray-900 dark:text-white"
                        />
                    </div>
                ))}
            </div>
        </div>
    );

    const renderIntellectual = () => (
        <div className="bg-blue-50 dark:bg-blue-900/10 p-6 rounded-xl border border-blue-100 dark:border-blue-800">
            <div className="flex items-center gap-2 mb-4 text-blue-700 dark:text-blue-400">
                <BookOpen className="w-5 h-5" />
                <h3 className="font-bold text-lg">Intellectual</h3>
            </div>
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{intellectualLabels.category1} Goal / Year</label>
                    <input
                        type="number"
                        {...register("intellectual.booksPerYear", { valueAsNumber: true })}
                        className="w-full px-3 py-2 bg-white dark:bg-dark-800 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
                    />
                </div>
            </div>
        </div>
    );

    const renderCareer = () => (
        <div className="bg-emerald-50 dark:bg-emerald-900/10 p-6 rounded-xl border border-emerald-100 dark:border-emerald-800">
            <div className="flex items-center gap-2 mb-4 text-emerald-700 dark:text-emerald-400">
                <Briefcase className="w-5 h-5" />
                <h3 className="font-bold text-lg">Career</h3>
            </div>
            <div className="space-y-4">
                {careerMilestones.length > 0 ? (
                    <div>
                        <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400 uppercase mb-2 flex items-center gap-1">
                            <Award className="w-3 h-3" /> Recent Milestones
                        </p>
                        <div className="space-y-2">
                            {careerMilestones.map(m => (
                                <div key={m.id} className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                    <span>{m.title}</span>
                                    <span className="text-xs text-gray-400">({new Date(m.date).toLocaleDateString()})</span>
                                </div>
                            ))}
                        </div>
                        <p className="text-xs text-gray-400 mt-3 italic">Manage milestones in the Career Hub</p>
                    </div>
                ) : (
                    <p className="text-sm text-gray-500 italic">No milestones yet. Add them in the Career Hub.</p>
                )}
            </div>
        </div>
    );

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 animate-fade-in pb-8">
            {(!section || section === 'fitness') && renderFitness()}
            {(!section || section === 'nutrition') && renderNutrition()}
            {(!section || section === 'mindfulness') && renderMindfulness()}
            {(!section || section === 'financial') && renderFinancial()}
            {(!section || section === 'intellectual') && renderIntellectual()}
            {(!section || section === 'career') && renderCareer()}

            <div className="flex justify-end sticky bottom-4 bg-white/80 dark:bg-dark-900/80 backdrop-blur-sm p-4 rounded-xl border border-gray-200 dark:border-dark-700 shadow-xl z-10">
                <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center gap-2 px-8 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-600/20 font-bold"
                >
                    <Save className="w-5 h-5" />
                    {loading ? 'Saving...' : `Save ${section ? section.charAt(0).toUpperCase() + section.slice(1) : 'All'} Goals`}
                </button>
            </div>
        </form>
    );
}
