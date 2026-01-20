import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Clock, Calendar, Utensils, Award, Check } from 'lucide-react';
import { mealPlans as presetPlans } from '../data/mealData';
import { getDataService } from '../services/serviceProvider';

export default function MealPlanDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [plan, setPlan] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadPlan();
    }, [id]);

    const loadPlan = async () => {
        setLoading(true);
        try {
            // Check presets first
            const preset = presetPlans.find(p => p.id === id);
            if (preset) {
                setPlan(preset);
                setLoading(false);
                return;
            }

            // Check custom plans
            const dataService = getDataService();
            if (dataService.getMealPlans) {
                const customPlans = await dataService.getMealPlans();
                const custom = customPlans.find(p => p.id === id);
                if (custom) {
                    setPlan(custom);
                }
            }
        } catch (error) {
            console.error('Error loading plan:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-dark-900">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
            </div>
        );
    }

    if (!plan) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-dark-900 p-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Plan Not Found</h2>
                <button
                    onClick={() => navigate('/nutrition/plans')}
                    className="px-6 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600"
                >
                    Back to Library
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-dark-900 transition-colors">
            {/* Header / Hero */}
            <div className="bg-white dark:bg-dark-800 shadow-sm">
                <div className="max-w-4xl mx-auto px-4 py-8">
                    <button
                        onClick={() => navigate('/nutrition/plans')}
                        className="flex items-center gap-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 mb-6"
                    >
                        <ChevronLeft className="w-5 h-5" /> Back to Plans
                    </button>

                    <div className="flex flex-col md:flex-row gap-6 items-start">
                        <div
                            className="w-24 h-24 rounded-2xl flex items-center justify-center text-4xl shrink-0"
                            style={{ backgroundColor: `${plan.color || '#10B981'}20` }}
                        >
                            {plan.icon || '🥗'}
                        </div>
                        <div className="flex-1">
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{plan.name}</h1>
                            <p className="text-gray-600 dark:text-gray-400 text-lg mb-4">{plan.description}</p>

                            <div className="flex flex-wrap gap-4">
                                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-dark-700 px-3 py-1.5 rounded-lg">
                                    <Clock className="w-4 h-4" />
                                    <span>{plan.duration || 'Flexible Duration'}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-dark-700 px-3 py-1.5 rounded-lg">
                                    <Utensils className="w-4 h-4" />
                                    <span>{plan.days?.length || 0} Daily Menus</span>
                                </div>
                                {plan.category && (
                                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-dark-700 px-3 py-1.5 rounded-lg">
                                        <Award className="w-4 h-4" />
                                        <span>{plan.category}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
                {plan.days?.map((day, idx) => (
                    <div key={idx} className="bg-white dark:bg-dark-800 rounded-2xl shadow-sm p-6">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-emerald-500" />
                            {day.day}
                        </h3>
                        <div className="space-y-4">
                            {day.meals?.map((meal, mIdx) => (
                                <div key={mIdx} className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-dark-700/50 rounded-xl border border-gray-100 dark:border-dark-700">
                                    <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0 font-medium text-xs uppercase">
                                        {meal.type?.substring(0, 2)}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start">
                                            <h4 className="font-bold text-gray-900 dark:text-white">{meal.name}</h4>
                                            <span className="text-xs font-medium px-2 py-1 bg-white dark:bg-dark-600 rounded text-gray-500 dark:text-gray-300 shadow-sm">
                                                {meal.calories} kcal
                                            </span>
                                        </div>
                                        <div className="mt-1 flex gap-3 text-xs text-gray-500 dark:text-gray-400">
                                            <span>P: {meal.protein}g</span>
                                            <span>C: {meal.carbs}g</span>
                                            <span>F: {meal.fat}g</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}

                {(!plan.days || plan.days.length === 0) && (
                    <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                        <Utensils className="w-12 h-12 mx-auto mb-4 opacity-20" />
                        <p>No daily menus defined for this plan yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
