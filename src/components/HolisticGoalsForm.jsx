import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Target, Utensils, Brain, Save, DollarSign, BookOpen, Briefcase, Award, CheckCircle } from 'lucide-react';
import { toast } from 'react-toastify';
import localStorageService from '../services/localStorageService';
import { workoutPrograms } from '../data/workoutPrograms';
import { dietTemplates, calculateMacros } from '../data/dietTemplates';
import { mindfulnessTemplates, intellectualTemplates, financialTemplates, careerTemplates } from '../data/holisticTemplates';

export default function HolisticGoalsForm({ section = null }) {
    const { register, handleSubmit, setValue, watch, getValues } = useForm();
    const selectedProgramId = watch('fitness.selectedProgramId');
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
                setValue('fitness.currentWeight', goals.fitness?.currentWeight);
                setValue('fitness.targetWeight', goals.fitness?.targetWeight);
                setValue('fitness.workoutsPerWeek', goals.fitness?.workoutsPerWeek);
                setValue('fitness.selectedProgramId', goals.fitness?.selectedProgramId);
                // Nutrition
                setValue('nutrition.calories', goals.nutrition?.calories);
                setValue('nutrition.protein', goals.nutrition?.protein);
                setValue('nutrition.carbs', goals.nutrition?.carbs);
                setValue('nutrition.fat', goals.nutrition?.fat);
                // Mindfulness
                setValue('mindfulness.minutesPerWeek', goals.mindfulness?.minutesPerWeek);
                // Intellectual
                setValue('intellectual.booksPerYear', goals.intellectual?.booksPerYear);
                // Financial
                setValue('financial.monthlySavings', goals.financial?.monthlySavings);

                // Career
                setValue('career.currentTitle', goals.career?.currentTitle);
                setValue('career.targetTitle', goals.career?.targetTitle);
                setValue('career.upskillingHours', goals.career?.upskillingHours);
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

            // 3. Save Active Program if changed
            if (data.fitness?.selectedProgramId) {
                await localStorageService.saveActiveProgram(data.fitness.selectedProgramId);
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Current Weight (lbs)</label>
                        <input
                            type="number"
                            {...register("fitness.currentWeight", { valueAsNumber: true })}
                            className="w-full px-3 py-2 bg-white dark:bg-dark-800 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-emerald-500 text-gray-900 dark:text-white"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Target Weight (lbs)</label>
                        <input
                            type="number"
                            {...register("fitness.targetWeight", { valueAsNumber: true })}
                            className="w-full px-3 py-2 bg-white dark:bg-dark-800 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-emerald-500 text-gray-900 dark:text-white"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Selected Program</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {workoutPrograms.map(program => {
                            const isSelected = selectedProgramId === program.id;
                            return (
                                <div
                                    key={program.id}
                                    onClick={() => setValue('fitness.selectedProgramId', program.id, { shouldDirty: true })}
                                    className={`cursor-pointer p-4 rounded-xl border-2 transition-all relative ${isSelected ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20' : 'border-gray-200 dark:border-dark-700 hover:border-emerald-300'}`}
                                >
                                    {isSelected && (
                                        <div className="absolute top-2 right-2 text-emerald-500">
                                            <CheckCircle className="w-5 h-5 fill-emerald-100" />
                                        </div>
                                    )}
                                    <div className="flex items-center gap-3">
                                        <div className="text-2xl">{program.icon}</div>
                                        <div>
                                            <h4 className="font-bold text-gray-800 dark:text-gray-200">{program.name}</h4>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{program.level} • {program.frequency}</p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    {/* Hidden input to register the value */}
                    <input type="hidden" {...register("fitness.selectedProgramId")} />
                </div>
            </div>
        </div>
    );

    const handleDietSelect = (templateId) => {
        let currentCalories = getValues('nutrition.calories');
        // Ensure we set calories if empty/0 so macros calculate correctly
        if (!currentCalories) {
            currentCalories = 2000;
            setValue('nutrition.calories', 2000, { shouldValidate: true, shouldDirty: true });
        }

        const macros = calculateMacros(currentCalories, templateId);
        if (macros) {
            setValue('nutrition.protein', macros.protein, { shouldValidate: true, shouldDirty: true });
            setValue('nutrition.carbs', macros.carbs, { shouldValidate: true, shouldDirty: true });
            setValue('nutrition.fat', macros.fat, { shouldValidate: true, shouldDirty: true });
            const templateName = dietTemplates.find(t => t.id === templateId)?.name;
            toast.info(`Applied ${templateName} macros`);
        }
    };

    const handleMindfulnessSelect = (templateId) => {
        const template = mindfulnessTemplates.find(t => t.id === templateId);
        if (template && template.minutes !== null) {
            setValue('mindfulness.minutesPerWeek', template.minutes, { shouldValidate: true, shouldDirty: true });
            toast.info(`Applied ${template.name} goal`);
        }
    };

    const handleIntellectualSelect = (templateId) => {
        const template = intellectualTemplates.find(t => t.id === templateId);
        if (template && template.target !== null) {
            setValue('intellectual.booksPerYear', template.target, { shouldValidate: true, shouldDirty: true });
            toast.info(`Applied ${template.name} goal`);
        }
    };

    const handleFinancialSelect = (templateId) => {
        const template = financialTemplates.find(t => t.id === templateId);
        if (template && template.amount !== null) {
            setValue('financial.monthlySavings', template.amount, { shouldValidate: true, shouldDirty: true });
            toast.info(`Applied ${template.name} savings goal`);
        }
    };

    const handleCareerSelect = (templateId) => {
        const template = careerTemplates.find(t => t.id === templateId);
        if (template && template.hours !== null) {
            setValue('career.upskillingHours', template.hours, { shouldValidate: true, shouldDirty: true });
            toast.info(`Applied ${template.name} upskilling goal`);
        }
    };

    const renderNutrition = () => (
        <div className="bg-orange-50 dark:bg-orange-900/10 p-6 rounded-xl border border-orange-100 dark:border-orange-800">
            <div className="flex items-center gap-2 mb-4 text-orange-700 dark:text-orange-400">
                <Utensils className="w-5 h-5" />
                <h3 className="font-bold text-lg">Nutrition Goals</h3>
            </div>

            {/* Diet Templates */}
            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Diet Templates (Auto-fill Macros)</label>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    {dietTemplates.map(template => (
                        <button
                            key={template.id}
                            type="button"
                            onClick={() => handleDietSelect(template.id)}
                            className="p-3 bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-700 rounded-xl hover:border-orange-400 hover:shadow-md transition-all text-left flex flex-col gap-2 group"
                        >
                            <span className="text-2xl">{template.icon}</span>
                            <div>
                                <h4 className="font-bold text-sm text-gray-800 dark:text-gray-200 group-hover:text-orange-600 transition-colors">{template.name}</h4>
                                <p className="text-[10px] text-gray-400 leading-tight mt-1">{template.description}</p>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Calories</label>
                    <input
                        type="number"
                        {...register("nutrition.calories", { valueAsNumber: true })}
                        className="w-full px-3 py-2 bg-white dark:bg-dark-800 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-orange-500 text-gray-900 dark:text-white"
                        placeholder="2000"
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

            {/* Mindfulness Templates */}
            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Goal Templates</label>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    {mindfulnessTemplates.map(template => (
                        <button
                            key={template.id}
                            type="button"
                            onClick={() => handleMindfulnessSelect(template.id)}
                            className="p-3 bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-700 rounded-xl hover:border-teal-400 hover:shadow-md transition-all text-left flex flex-col gap-2 group"
                        >
                            <span className="text-2xl">{template.icon}</span>
                            <div>
                                <h4 className="font-bold text-sm text-gray-800 dark:text-gray-200 group-hover:text-teal-600 transition-colors">{template.name}</h4>
                                <p className="text-[10px] text-gray-400 leading-tight mt-1">{template.description}</p>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
    );

    const renderFinancial = () => (
        <div className="bg-green-50 dark:bg-green-900/10 p-6 rounded-xl border border-green-100 dark:border-green-800">
            <div className="flex items-center gap-2 mb-4 text-green-700 dark:text-green-400">
                <DollarSign className="w-5 h-5" />
                <h3 className="font-bold text-lg">Financial Targets</h3>
            </div>

            {/* Financial Templates */}
            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Savings Templates</label>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    {financialTemplates.map(template => (
                        <button
                            key={template.id}
                            type="button"
                            onClick={() => handleFinancialSelect(template.id)}
                            className="p-3 bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-700 rounded-xl hover:border-green-400 hover:shadow-md transition-all text-left flex flex-col gap-2 group"
                        >
                            <span className="text-2xl">{template.icon}</span>
                            <div>
                                <h4 className="font-bold text-sm text-gray-800 dark:text-gray-200 group-hover:text-green-600 transition-colors">{template.name}</h4>
                                <p className="text-[10px] text-gray-400 leading-tight mt-1">{template.description}</p>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Monthly Savings Target ($)</label>
                        <input
                            type="number"
                            {...register("financial.monthlySavings", { valueAsNumber: true })}
                            className="w-full px-3 py-2 bg-white dark:bg-dark-800 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-green-500 text-gray-900 dark:text-white"
                        />
                    </div>
                </div>

                <div className="pt-4 border-t border-gray-200 dark:border-dark-700">
                    <p className="text-xs font-semibold text-gray-500 uppercase mb-3">Active Hub Goals</p>
                    {financialGoals.length === 0 && (
                        <p className="text-gray-500 text-sm italic">No active goals in Hub.</p>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {financialGoals.map((goal, index) => (
                            <div key={goal.id} className="bg-white dark:bg-dark-800 p-4 rounded-xl border border-gray-200 dark:border-dark-700 shadow-sm">
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 truncate" title={goal.title}>
                                    {goal.title} ({goal.unit || '$'})
                                </label>
                                <input
                                    type="number"
                                    {...register(`financial.goals.${index}.targetAmount`, { valueAsNumber: true })}
                                    className="w-full px-3 py-2 bg-gray-50 dark:bg-dark-900 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-green-500 text-gray-900 dark:text-white"
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );

    const renderIntellectual = () => (
        <div className="bg-blue-50 dark:bg-blue-900/10 p-6 rounded-xl border border-blue-100 dark:border-blue-800">
            <div className="flex items-center gap-2 mb-4 text-blue-700 dark:text-blue-400">
                <BookOpen className="w-5 h-5" />
                <h3 className="font-bold text-lg">Intellectual</h3>
            </div>

            {/* Intellectual Templates */}
            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Goal Templates</label>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    {intellectualTemplates.map(template => (
                        <button
                            key={template.id}
                            type="button"
                            onClick={() => handleIntellectualSelect(template.id)}
                            className="p-3 bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-700 rounded-xl hover:border-blue-400 hover:shadow-md transition-all text-left flex flex-col gap-2 group"
                        >
                            <span className="text-2xl">{template.icon}</span>
                            <div>
                                <h4 className="font-bold text-sm text-gray-800 dark:text-gray-200 group-hover:text-blue-600 transition-colors">{template.name}</h4>
                                <p className="text-[10px] text-gray-400 leading-tight mt-1">{template.description}</p>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
        </div>
    );

    const renderCareer = () => (
        <div className="bg-emerald-50 dark:bg-emerald-900/10 p-6 rounded-xl border border-emerald-100 dark:border-emerald-800">
            <div className="flex items-center gap-2 mb-4 text-emerald-700 dark:text-emerald-400">
                <Briefcase className="w-5 h-5" />
                <h3 className="font-bold text-lg">Career</h3>
            </div>

            {/* Career Templates */}
            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Development Templates</label>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    {careerTemplates.map(template => (
                        <button
                            key={template.id}
                            type="button"
                            onClick={() => handleCareerSelect(template.id)}
                            className="p-3 bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-700 rounded-xl hover:border-emerald-400 hover:shadow-md transition-all text-left flex flex-col gap-2 group"
                        >
                            <span className="text-2xl">{template.icon}</span>
                            <div>
                                <h4 className="font-bold text-sm text-gray-800 dark:text-gray-200 group-hover:text-emerald-600 transition-colors">{template.name}</h4>
                                <p className="text-[10px] text-gray-400 leading-tight mt-1">{template.description}</p>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Weekly Upskilling (Hours)</label>
                        <input
                            type="number"
                            {...register("career.upskillingHours", { valueAsNumber: true })}
                            className="w-full px-3 py-2 bg-white dark:bg-dark-800 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-emerald-500 text-gray-900 dark:text-white"
                        />
                    </div>
                </div>

                {careerMilestones.length > 0 && (
                    <div className="pt-4 border-t border-gray-200 dark:border-dark-700 mt-4">
                        <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase mb-2 flex items-center gap-1">
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
                    </div>
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
