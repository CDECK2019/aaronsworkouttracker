import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Plus, Save, X, ChevronRight, ChevronLeft,
    Utensils, Trash2, Search, Info
} from 'lucide-react';
import { commonFoods } from '../data/mealData';
import { getDataService } from '../services/serviceProvider';

const STEP_TITLES = ['Plan Details', 'Add Meals', 'Review & Save'];

export default function CustomMealBuilder() {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(0);
    const [saving, setSaving] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [showFoodModal, setShowFoodModal] = useState(false);

    // Plan state
    const [plan, setPlan] = useState({
        id: `mealplan_${Date.now()}`,
        name: '',
        description: '',
        tags: [],
        days: []
    });

    // Current day being edited
    const [currentDay, setCurrentDay] = useState({
        day: 'Day 1',
        meals: []
    });

    const [selectedMealType, setSelectedMealType] = useState('breakfast');

    const updatePlan = (field, value) => {
        setPlan(prev => ({ ...prev, [field]: value }));
    };

    const addMealToDay = (food) => {
        const newMeal = {
            id: `meal_${Date.now()}`,
            name: food.name,
            type: selectedMealType,
            calories: food.calories,
            protein: food.protein,
            carbs: food.carbs,
            fat: food.fat
        };

        setCurrentDay(prev => ({
            ...prev,
            meals: [...prev.meals, newMeal]
        }));
        setShowFoodModal(false);
    };

    const removeMeal = (index) => {
        setCurrentDay(prev => ({
            ...prev,
            meals: prev.meals.filter((_, i) => i !== index)
        }));
    };

    const saveDay = () => {
        if (currentDay.meals.length === 0) {
            alert('Please add at least one meal');
            return;
        }
        setPlan(prev => ({
            ...prev,
            days: [...prev.days, { ...currentDay }]
        }));
        setCurrentDay({
            day: `Day ${plan.days.length + 2}`,
            meals: []
        });
    };

    const removeDay = (index) => {
        setPlan(prev => ({
            ...prev,
            days: prev.days.filter((_, i) => i !== index)
        }));
    };

    const savePlan = async () => {
        if (!plan.name || plan.days.length === 0) {
            alert('Please add a plan name and at least one day');
            return;
        }

        setSaving(true);
        try {
            const dataService = getDataService();
            if (dataService.saveMealPlan) {
                await dataService.saveMealPlan(plan);
                navigate('/nutrition');
            }
        } catch (error) {
            console.error('Error saving plan:', error);
            alert('Failed to save plan');
        } finally {
            setSaving(false);
        }
    };

    const filteredFoods = commonFoods.filter(f =>
        f.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-dark-900 py-8 px-4 transition-colors">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                            Create Meal Plan
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400">
                            Design a custom nutrition plan
                        </p>
                    </div>
                    <button
                        onClick={() => navigate('/nutrition')}
                        className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-200"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Steps Indicator */}
                <div className="flex items-center mb-8">
                    {STEP_TITLES.map((title, index) => (
                        <React.Fragment key={index}>
                            <div className="flex items-center">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${index <= currentStep
                                        ? 'bg-emerald-500 text-white'
                                        : 'bg-gray-300 dark:bg-gray-700 text-gray-600'
                                    }`}>
                                    {index + 1}
                                </div>
                                <span className={`ml-2 text-sm hidden sm:block ${index <= currentStep ? 'text-emerald-600 font-medium' : 'text-gray-500'
                                    }`}>
                                    {title}
                                </span>
                            </div>
                            {index < STEP_TITLES.length - 1 && (
                                <div className={`flex-1 h-0.5 mx-4 ${index < currentStep ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-gray-700'
                                    }`} />
                            )}
                        </React.Fragment>
                    ))}
                </div>

                {/* Content */}
                <div className="bg-white dark:bg-dark-800 rounded-2xl shadow-lg p-6 mb-6">
                    {/* Step 1: Details */}
                    {currentStep === 0 && (
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Plan Name</label>
                                <input
                                    type="text"
                                    value={plan.name}
                                    onChange={(e) => updatePlan('name', e.target.value)}
                                    placeholder="e.g., High Protein Week"
                                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-dark-700 text-gray-900 dark:text-white"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description</label>
                                <textarea
                                    value={plan.description}
                                    onChange={(e) => updatePlan('description', e.target.value)}
                                    placeholder="Describe your goals..."
                                    rows={3}
                                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-dark-700 text-gray-900 dark:text-white"
                                />
                            </div>
                        </div>
                    )}

                    {/* Step 2: Add Meals */}
                    {currentStep === 1 && (
                        <div className="space-y-6">
                            {plan.days.length > 0 && (
                                <div className="space-y-3">
                                    <h3 className="font-medium text-gray-900 dark:text-white">Created Days ({plan.days.length})</h3>
                                    {plan.days.map((day, idx) => (
                                        <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-dark-700 rounded-xl">
                                            <span className="font-medium text-gray-900 dark:text-white">{day.day}</span>
                                            <button onClick={() => removeDay(idx)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-6">
                                <h3 className="font-medium text-gray-900 dark:text-white mb-4">Edit {currentDay.day}</h3>
                                <input
                                    type="text"
                                    value={currentDay.day}
                                    onChange={(e) => setCurrentDay(prev => ({ ...prev, day: e.target.value }))}
                                    className="w-full mb-4 px-4 py-2 border rounded-lg dark:bg-dark-700 dark:border-gray-600 dark:text-white"
                                />

                                <div className="space-y-2 mb-4">
                                    {currentDay.meals.map((meal, idx) => (
                                        <div key={idx} className="flex items-center justify-between p-3 bg-white dark:bg-dark-800 rounded-lg border border-gray-200 dark:border-gray-700">
                                            <div>
                                                <span className="font-medium text-emerald-600 capitalize text-xs block">{meal.type}</span>
                                                <span className="text-gray-900 dark:text-white">{meal.name}</span>
                                            </div>
                                            <button onClick={() => removeMeal(idx)} className="text-red-400">
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>

                                <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
                                    {['breakfast', 'lunch', 'dinner', 'snack'].map(type => (
                                        <button
                                            key={type}
                                            onClick={() => { setSelectedMealType(type); setShowFoodModal(true); }}
                                            className="px-3 py-1.5 bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 rounded-lg text-sm capitalize whitespace-nowrap hover:bg-emerald-100"
                                        >
                                            + Add {type}
                                        </button>
                                    ))}
                                </div>

                                {currentDay.meals.length > 0 && (
                                    <button
                                        onClick={saveDay}
                                        className="w-full py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 font-medium"
                                    >
                                        Save Day
                                    </button>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Step 3: Review */}
                    {currentStep === 2 && (
                        <div className="space-y-6">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white">{plan.name}</h2>
                                <p className="text-gray-600 dark:text-gray-400">{plan.description}</p>
                            </div>
                            <div className="space-y-4">
                                {plan.days.map((day, idx) => (
                                    <div key={idx} className="bg-gray-50 dark:bg-dark-700 p-4 rounded-xl">
                                        <h4 className="font-bold text-gray-800 dark:text-white mb-2">{day.day}</h4>
                                        <div className="space-y-1">
                                            {day.meals.map((meal, mIdx) => (
                                                <div key={mIdx} className="text-sm text-gray-600 dark:text-gray-300 flex justify-between">
                                                    <span>{meal.name}</span>
                                                    <span className="text-xs text-emerald-600 capitalize">{meal.type}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Navigation */}
                <div className="flex justify-between">
                    <button
                        onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))}
                        disabled={currentStep === 0}
                        className="flex items-center gap-2 px-6 py-3 text-gray-600 dark:text-gray-400 disabled:opacity-50"
                    >
                        <ChevronLeft className="w-5 h-5" /> Back
                    </button>

                    {currentStep < 2 ? (
                        <button
                            onClick={() => setCurrentStep(prev => prev + 1)}
                            disabled={currentStep === 0 && !plan.name}
                            className="flex items-center gap-2 px-6 py-3 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 disabled:opacity-50"
                        >
                            Next <ChevronRight className="w-5 h-5" />
                        </button>
                    ) : (
                        <button
                            onClick={savePlan}
                            disabled={saving}
                            className="flex items-center gap-2 px-6 py-3 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 disabled:opacity-50"
                        >
                            {saving ? 'Saving...' : 'Save Plan'} <Save className="w-5 h-5" />
                        </button>
                    )}
                </div>
            </div>

            {/* Food Modal */}
            {showFoodModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-dark-800 rounded-2xl w-full max-w-md max-h-[80vh] flex flex-col">
                        <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                            <h3 className="font-bold text-gray-900 dark:text-white">Add to {selectedMealType}</h3>
                            <button onClick={() => setShowFoodModal(false)}><X className="w-5 h-5 text-gray-500" /></button>
                        </div>
                        <div className="p-4 overflow-y-auto">
                            <input
                                type="text"
                                placeholder="Search..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full px-4 py-2 border rounded-lg mb-4 dark:bg-dark-700 dark:border-gray-600 dark:text-white"
                            />
                            <div className="space-y-2">
                                {filteredFoods.map(food => (
                                    <button
                                        key={food.id}
                                        onClick={() => addMealToDay(food)}
                                        className="w-full text-left p-3 hover:bg-gray-50 dark:hover:bg-dark-700 rounded-lg flex justify-between items-center"
                                    >
                                        <span className="text-gray-900 dark:text-white">{food.name}</span>
                                        <span className="text-xs text-gray-500">{food.calories} kcal</span>
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
