import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    ChevronLeft, ChevronRight, Plus, Droplets, Flame,
    Wheat, Egg, Fish, Utensils, Search, X, BookOpen
} from 'lucide-react';
import { getDataService, getAuthService } from '../services/serviceProvider';
import { commonFoods, getNutritionGoals } from '../data/mealData';

export default function NutritionTracker() {
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [log, setLog] = useState({
        meals: [],
        waterIntake: 0,
        totals: { calories: 0, protein: 0, carbs: 0, fat: 0 }
    });
    const [goals, setGoals] = useState({ calories: 2000, protein: 150, carbs: 200, fat: 70 });
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [selectedMealType, setSelectedMealType] = useState('breakfast');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        loadData();
    }, [date]);

    // Load goals and daily log
    const loadData = async () => {
        setLoading(true);
        try {
            const dataService = getDataService();
            const authService = getAuthService();

            // Get user profile for goals
            let userGoals = { calories: 2000, protein: 150, carbs: 250, fat: 70 };
            try {
                const user = await authService.getCurrentUser();
                if (user) {
                    const profile = await dataService.getUserInformation(null, user.$id);
                    userGoals = getNutritionGoals(profile);
                }
            } catch (e) {
                console.log('Guest mode or no profile, using defaults');
            }
            setGoals(userGoals);

            // Get daily log
            if (dataService.getNutritionLog) {
                const dayLog = await dataService.getNutritionLog(date);
                if (dayLog) {
                    calculateTotals(dayLog);
                } else {
                    setLog({
                        meals: [],
                        waterIntake: 0,
                        totals: { calories: 0, protein: 0, carbs: 0, fat: 0 }
                    });
                }
            }
        } catch (error) {
            console.error('Error loading nutrition data:', error);
        } finally {
            setLoading(false);
        }
    };

    const calculateTotals = (currentLog) => {
        const newTotals = currentLog.meals.reduce((acc, meal) => ({
            calories: acc.calories + (meal.calories || 0),
            protein: acc.protein + (meal.protein || 0),
            carbs: acc.carbs + (meal.carbs || 0),
            fat: acc.fat + (meal.fat || 0),
        }), { calories: 0, protein: 0, carbs: 0, fat: 0 });

        setLog({ ...currentLog, totals: newTotals });
    };

    const addFood = async (food) => {
        const newMeal = {
            id: `meal_${Date.now()}`,
            name: food.name,
            calories: food.calories,
            protein: food.protein,
            carbs: food.carbs,
            fat: food.fat,
            type: selectedMealType,
            timestamp: new Date().toISOString()
        };

        const updatedLog = {
            ...log,
            meals: [...log.meals, newMeal]
        };

        // Optimistic update
        calculateTotals(updatedLog);
        setShowAddModal(false);

        // Save
        try {
            const dataService = getDataService();
            if (dataService.saveNutritionLog) {
                await dataService.saveNutritionLog(date, updatedLog);
            }
        } catch (error) {
            console.error('Error saving meal:', error);
        }
    };

    const removeMeal = async (mealId) => {
        const updatedLog = {
            ...log,
            meals: log.meals.filter(m => m.id !== mealId)
        };
        calculateTotals(updatedLog);

        try {
            const dataService = getDataService();
            if (dataService.saveNutritionLog) {
                await dataService.saveNutritionLog(date, updatedLog);
            }
        } catch (error) {
            console.error('Error removing meal:', error);
        }
    };

    const updateWater = async (amount) => {
        const newAmount = Math.max(0, log.waterIntake + amount);
        const updatedLog = { ...log, waterIntake: newAmount };
        setLog(updatedLog); // Update UI immediately

        try {
            const dataService = getDataService();
            if (dataService.saveNutritionLog) {
                await dataService.saveNutritionLog(date, updatedLog);
            }
        } catch (error) {
            console.error('Error updating water:', error);
        }
    };

    const changeDate = (days) => {
        const d = new Date(date);
        d.setDate(d.getDate() + days);
        setDate(d.toISOString().split('T')[0]);
    };

    const filteredFoods = commonFoods.filter(f =>
        f.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getProgressColor = (current, target) => {
        const pct = (current / target) * 100;
        if (pct > 110) return 'text-red-500';
        if (pct >= 90) return 'text-emerald-500';
        return 'text-emerald-600 dark:text-emerald-400';
    };

    const MealSection = ({ title, type, icon: Icon }) => {
        const meals = log.meals.filter(m => m.type === type);
        const calories = meals.reduce((sum, m) => sum + m.calories, 0);

        return (
            <div className="bg-white dark:bg-dark-800 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                            <Icon className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-800 dark:text-white capitalize">{title}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{calories} kcal</p>
                        </div>
                    </div>
                    <button
                        onClick={() => { setSelectedMealType(type); setShowAddModal(true); }}
                        className="p-2 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-lg transition-colors"
                    >
                        <Plus className="w-5 h-5" />
                    </button>
                </div>

                {meals.length > 0 ? (
                    <div className="space-y-3">
                        {meals.map(meal => (
                            <div key={meal.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-dark-700 rounded-xl group">
                                <div>
                                    <p className="font-medium text-gray-800 dark:text-white">{meal.name}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        {meal.calories} kcal • {meal.protein}g P • {meal.carbs}g C • {meal.fat}g F
                                    </p>
                                </div>
                                <button
                                    onClick={() => removeMeal(meal.id)}
                                    className="text-red-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-sm text-center text-gray-400 py-2 italic">No meals logged</p>
                )}
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-dark-900 pb-20 transition-colors">
            {/* Header */}
            <div className="bg-white dark:bg-dark-800 shadow-sm sticky top-0 z-10">
                <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <h1 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                            <Utensils className="w-6 h-6 text-emerald-600" />
                            Nutrition
                        </h1>
                        <Link
                            to="/nutrition/plans"
                            className="text-sm px-3 py-1.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-lg hover:bg-emerald-200 dark:hover:bg-emerald-900/50 transition-colors flex items-center gap-1 font-medium"
                        >
                            <BookOpen className="w-4 h-4" />
                            Meal Plans
                        </Link>
                    </div>
                    <div className="flex items-center gap-4 bg-gray-100 dark:bg-dark-700 rounded-xl p-1">
                        <button onClick={() => changeDate(-1)} className="p-2 hover:bg-white dark:hover:bg-dark-600 rounded-lg transition-colors">
                            <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                        </button>
                        <span className="font-medium text-gray-800 dark:text-white min-w-[100px] text-center">
                            {new Date(date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                        </span>
                        <button onClick={() => changeDate(1)} className="p-2 hover:bg-white dark:hover:bg-dark-600 rounded-lg transition-colors">
                            <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
                {/* Summary Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="col-span-2 md:col-span-1 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-6 text-white shadow-lg">
                        <div className="flex items-center gap-2 mb-2 opacity-90">
                            <Flame className="w-5 h-5" />
                            <span className="font-medium">Calories</span>
                        </div>
                        <div className="flex items-end gap-2">
                            <span className="text-4xl font-bold">{log.totals.calories}</span>
                            <span className="text-sm opacity-80 mb-2">/ {goals.calories}</span>
                        </div>
                        <div className="w-full bg-black/20 h-2 rounded-full mt-4 overflow-hidden">
                            <div
                                className="h-full bg-white/90 rounded-full transition-all duration-500"
                                style={{ width: `${Math.min(100, (log.totals.calories / goals.calories) * 100)}%` }}
                            />
                        </div>
                    </div>

                    {[
                        { label: 'Protein', val: log.totals.protein, target: goals.protein, icon: Egg, color: 'text-blue-500' },
                        { label: 'Carbs', val: log.totals.carbs, target: goals.carbs, icon: Wheat, color: 'text-amber-500' },
                        { label: 'Fat', val: log.totals.fat, target: goals.fat, icon: Droplets, color: 'text-rose-500' } // Using Droplets for fat/oil
                    ].map(macro => (
                        <div key={macro.label} className="bg-white dark:bg-dark-800 rounded-2xl p-6 flex flex-col justify-between shadow-sm">
                            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mb-2">
                                <macro.icon className="w-4 h-4" />
                                <span className="text-sm font-medium">{macro.label}</span>
                            </div>
                            <div>
                                <div className="flex items-end gap-1">
                                    <span className={`text-2xl font-bold ${getProgressColor(macro.val, macro.target)}`}>
                                        {macro.val}g
                                    </span>
                                    <span className="text-xs text-gray-400 mb-1">/ {macro.target}g</span>
                                </div>
                                <div className="w-full bg-gray-100 dark:bg-dark-700 h-1.5 rounded-full mt-3 overflow-hidden">
                                    <div
                                        className={`h-full rounded-full transition-all duration-500 ${macro.val > macro.target ? 'bg-red-500' : 'bg-emerald-500'}`}
                                        style={{ width: `${Math.min(100, (macro.val / macro.target) * 100)}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Main Content Grid */}
                <div className="grid md:grid-cols-3 gap-6">
                    {/* Left Column: Water & quick stats? */}
                    <div className="space-y-6">
                        <div className="bg-blue-50 dark:bg-blue-900/10 rounded-2xl p-6 border border-blue-100 dark:border-blue-900/30">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                                    <Droplets className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-800 dark:text-white">Water Intake</h3>
                                    <p className="text-sm text-blue-600 dark:text-blue-400">{log.waterIntake}ml today</p>
                                </div>
                            </div>
                            <div className="flex justify-center gap-4">
                                <button onClick={() => updateWater(-250)} className="w-10 h-10 rounded-lg bg-white dark:bg-dark-800 shadow text-gray-600 flex items-center justify-center hover:bg-gray-50">-</button>
                                <button onClick={() => updateWater(250)} className="flex-1 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium shadow-lg shadow-blue-500/30 transition-all">
                                    +250ml
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Meals */}
                    <div className="md:col-span-2 space-y-4">
                        <MealSection title="Breakfast" type="breakfast" icon={Egg} />
                        <MealSection title="Lunch" type="lunch" icon={Utensils} />
                        <MealSection title="Dinner" type="dinner" icon={Utensils} />
                        <MealSection title="Snacks" type="snack" icon={Wheat} />
                    </div>
                </div>
            </div>

            {/* Add Food Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-dark-800 rounded-2xl w-full max-w-md max-h-[80vh] overflow-hidden flex flex-col shadow-2xl">
                        <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
                            <h3 className="font-bold text-lg text-gray-800 dark:text-white capitalize">Add to {selectedMealType}</h3>
                            <button onClick={() => setShowAddModal(false)} className="text-gray-500 hover:text-gray-700">
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        <div className="p-4">
                            <div className="relative mb-4">
                                <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search foods..."
                                    className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-dark-700 border-none rounded-xl text-gray-800 dark:text-white focus:ring-2 focus:ring-emerald-500"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    autoFocus
                                />
                            </div>
                            <div className="overflow-y-auto max-h-64 space-y-2">
                                {filteredFoods.map(food => (
                                    <button
                                        key={food.id}
                                        onClick={() => addFood(food)}
                                        className="w-full flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-dark-700 rounded-xl transition-colors group text-left"
                                    >
                                        <div>
                                            <p className="font-medium text-gray-800 dark:text-white">{food.name}</p>
                                            <p className="text-xs text-gray-500">{food.calories} kcal • {food.protein}p • {food.carbs}c • {food.fat}f</p>
                                        </div>
                                        <Plus className="w-5 h-5 text-emerald-500 bg-emerald-100 dark:bg-emerald-900/30 rounded-full p-1 group-hover:bg-emerald-500 group-hover:text-white transition-colors" />
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
