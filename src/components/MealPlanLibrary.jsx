import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, ChevronRight, Utensils, Wheat, Beef, Fish, Trash2, Calendar } from 'lucide-react';
import { mealPlans as presetPlans } from '../data/mealData';
import { getDataService } from '../services/serviceProvider';

export default function MealPlanLibrary() {
    const navigate = useNavigate();
    const [customPlans, setCustomPlans] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadCustomPlans();
    }, []);

    const loadCustomPlans = async () => {
        try {
            const dataService = getDataService();
            if (dataService.getMealPlans) {
                const plans = await dataService.getMealPlans();
                setCustomPlans(plans);
            }
        } catch (error) {
            console.error('Error loading meal plans:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeletePlan = async (e, id) => {
        e.stopPropagation();
        if (confirm('Are you sure you want to delete this meal plan?')) {
            try {
                const dataService = getDataService();
                if (dataService.deleteMealPlan) {
                    await dataService.deleteMealPlan(id);
                    await loadCustomPlans();
                }
            } catch (error) {
                console.error('Error deleting plan:', error);
            }
        }
    };

    const PlanCard = ({ plan, isCustom }) => (
        <button
            className="w-full text-left bg-white dark:bg-dark-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all border-2 border-transparent hover:border-gray-100 dark:hover:border-gray-700 group relative"
            onClick={() => navigate(`/nutrition/plans/${plan.id}`)}
        >
            <div className="flex items-start gap-4">
                <div
                    className="w-16 h-16 rounded-xl flex items-center justify-center text-3xl shrink-0"
                    style={{ backgroundColor: `${plan.color || '#10B981'}20` }}
                >
                    {plan.icon || '🥗'}
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-lg text-gray-900 dark:text-white truncate">
                            {plan.name}
                        </h3>
                        {isCustom && (
                            <span className="px-2 py-0.5 text-xs bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 rounded-full font-medium">
                                Custom
                            </span>
                        )}
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-3">
                        {plan.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {plan.tags?.map(tag => (
                            <span key={tag} className="text-xs px-2 py-1 bg-gray-100 dark:bg-dark-700 text-gray-600 dark:text-gray-300 rounded-md">
                                {tag}
                            </span>
                        ))}
                        <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-dark-700 text-gray-600 dark:text-gray-300 rounded-md flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {plan.duration || 'Flexible'}
                        </span>
                    </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-gray-500 transition-colors" />
            </div>
            {isCustom && (
                <button
                    onClick={(e) => handleDeletePlan(e, plan.id)}
                    className="absolute top-4 right-4 p-2 text-red-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            )}
        </button>
    );

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-dark-900 p-4 md:p-8 transition-colors">
            <div className="max-w-5xl mx-auto space-y-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                            <Utensils className="w-8 h-8 text-emerald-600" />
                            Meal Plans
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">
                            Choose a nutrition plan or create your own
                        </p>
                    </div>
                    <Link
                        to="/nutrition/create"
                        className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 font-medium transition-colors"
                    >
                        <Plus className="w-5 h-5" />
                        Create Plan
                    </Link>
                </div>

                {/* Custom Plans */}
                {customPlans.length > 0 && (
                    <div className="space-y-4">
                        <h2 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Your Plans
                        </h2>
                        <div className="grid md:grid-cols-2 gap-4">
                            {customPlans.map(plan => (
                                <PlanCard key={plan.id} plan={plan} isCustom={true} />
                            ))}
                        </div>
                    </div>
                )}

                {/* Preset Plans */}
                <div className="space-y-4">
                    <h2 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Featured Plans
                    </h2>
                    <div className="grid md:grid-cols-2 gap-4">
                        {presetPlans.map(plan => (
                            <PlanCard key={plan.id} plan={plan} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
