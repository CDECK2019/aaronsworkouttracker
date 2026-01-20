import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    Plus, Minus, Save, X, ChevronRight, ChevronLeft,
    Dumbbell, Clock, Repeat, Info, Trash2, GripVertical
} from 'lucide-react';
import { exercises } from '../data/exerciseData';
import { getDataService } from '../services/serviceProvider';

const STEP_TITLES = ['Program Details', 'Create Workout Days', 'Review & Save'];

export default function CustomProgramBuilder() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [currentStep, setCurrentStep] = useState(0);
    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(false);

    // Load program if editing
    React.useEffect(() => {
        if (id) {
            loadProgram(id);
        }
    }, [id]);

    const loadProgram = async (programId) => {
        setLoading(true);
        try {
            const dataService = getDataService();
            // Try getCustomProgramById first, fallback to filtering list
            let foundProgram = null;
            if (dataService.getCustomProgramById) {
                foundProgram = await dataService.getCustomProgramById(programId);
            } else {
                const programs = await dataService.getCustomPrograms();
                foundProgram = programs.find(p => p.id === programId);
            }

            if (foundProgram) {
                setProgram(foundProgram);
            } else {
                alert('Program not found');
                navigate('/programs');
            }
        } catch (error) {
            console.error('Error loading program:', error);
            alert('Error loading program');
        } finally {
            setLoading(false);
        }
    };

    // Program state
    const [program, setProgram] = useState({
        id: id || `custom_${Date.now()}`,
        name: '',
        description: '',
        level: 'beginner',
        frequency: '3 days/week',
        estimatedTime: '45-60 min',
        category: 'strength',
        color: '#10B981',
        icon: '💪',
        schedule: [],
        isCustom: true,
    });

    // Current day being edited
    const [currentDay, setCurrentDay] = useState({
        day: '',
        name: '',
        exercises: [],
    });

    // Exercise selection modal
    const [showExerciseModal, setShowExerciseModal] = useState(false);
    const [exerciseFilter, setExerciseFilter] = useState('');

    const updateProgram = (field, value) => {
        setProgram(prev => ({ ...prev, [field]: value }));
    };

    const addExerciseToDay = (exercise) => {
        setCurrentDay(prev => ({
            ...prev,
            exercises: [
                ...prev.exercises,
                {
                    exerciseId: exercise.id,
                    name: exercise.name,
                    sets: 3,
                    reps: '10-12',
                    rest: '60s',
                },
            ],
        }));
        setShowExerciseModal(false);
    };

    const updateExercise = (index, field, value) => {
        setCurrentDay(prev => ({
            ...prev,
            exercises: prev.exercises.map((ex, i) =>
                i === index ? { ...ex, [field]: value } : ex
            ),
        }));
    };

    const removeExercise = (index) => {
        setCurrentDay(prev => ({
            ...prev,
            exercises: prev.exercises.filter((_, i) => i !== index),
        }));
    };

    const saveDay = () => {
        if (!currentDay.day || !currentDay.name || currentDay.exercises.length === 0) {
            alert('Please fill in day name, title, and add at least one exercise');
            return;
        }
        setProgram(prev => ({
            ...prev,
            schedule: [...prev.schedule, { ...currentDay }],
        }));
        setCurrentDay({ day: '', name: '', exercises: [] });
    };

    const removeDay = (index) => {
        setProgram(prev => ({
            ...prev,
            schedule: prev.schedule.filter((_, i) => i !== index),
        }));
    };

    const saveProgram = async () => {
        if (!program.name || program.schedule.length === 0) {
            alert('Please add a program name and at least one workout day');
            return;
        }

        setSaving(true);
        try {
            const dataService = getDataService();
            await dataService.saveCustomProgram(program);
            navigate('/programs');
        } catch (error) {
            console.error('Error saving program:', error);
            alert('Failed to save program');
        } finally {
            setSaving(false);
        }
    };

    const filteredExercises = exercises.filter(ex =>
        ex.name.toLowerCase().includes(exerciseFilter.toLowerCase()) ||
        ex.primaryMuscles.some(m => m.toLowerCase().includes(exerciseFilter.toLowerCase()))
    );

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-dark-900 py-8 px-4 transition-colors">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                            {id ? 'Edit Custom Program' : 'Create Custom Program'}
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400">
                            {id ? 'Update your program details and schedule' : 'Build your perfect workout routine'}
                        </p>
                    </div>
                    <button
                        onClick={() => navigate('/programs')}
                        className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Progress Steps */}
                <div className="flex items-center mb-8">
                    {STEP_TITLES.map((title, index) => (
                        <React.Fragment key={index}>
                            <div className="flex items-center">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${index <= currentStep
                                    ? 'bg-emerald-500 text-white'
                                    : 'bg-gray-300 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                                    }`}>
                                    {index + 1}
                                </div>
                                <span className={`ml-2 text-sm hidden sm:block ${index <= currentStep
                                    ? 'text-emerald-600 dark:text-emerald-400 font-medium'
                                    : 'text-gray-500 dark:text-gray-400'
                                    }`}>
                                    {title}
                                </span>
                            </div>
                            {index < STEP_TITLES.length - 1 && (
                                <div className={`flex-1 h-0.5 mx-4 ${index < currentStep
                                    ? 'bg-emerald-500'
                                    : 'bg-gray-300 dark:bg-gray-700'
                                    }`} />
                            )}
                        </React.Fragment>
                    ))}
                </div>

                {/* Step Content */}
                <div className="bg-white dark:bg-dark-800 rounded-2xl shadow-lg p-6 mb-6">
                    {/* Step 1: Program Details */}
                    {currentStep === 0 && (
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Program Name *
                                </label>
                                <input
                                    type="text"
                                    value={program.name}
                                    onChange={(e) => updateProgram('name', e.target.value)}
                                    placeholder="e.g., My Strength Program"
                                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-dark-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Description
                                </label>
                                <textarea
                                    value={program.description}
                                    onChange={(e) => updateProgram('description', e.target.value)}
                                    placeholder="Describe your program goals..."
                                    rows={3}
                                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-dark-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Difficulty Level
                                    </label>
                                    <select
                                        value={program.level}
                                        onChange={(e) => updateProgram('level', e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-dark-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                                    >
                                        <option value="beginner">Beginner</option>
                                        <option value="intermediate">Intermediate</option>
                                        <option value="advanced">Advanced</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Category
                                    </label>
                                    <select
                                        value={program.category}
                                        onChange={(e) => updateProgram('category', e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-dark-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                                    >
                                        <option value="strength">Strength</option>
                                        <option value="cardio">Cardio</option>
                                        <option value="flexibility">Flexibility</option>
                                        <option value="hybrid">Hybrid</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Frequency
                                    </label>
                                    <select
                                        value={program.frequency}
                                        onChange={(e) => updateProgram('frequency', e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-dark-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                                    >
                                        <option value="2 days/week">2 days/week</option>
                                        <option value="3 days/week">3 days/week</option>
                                        <option value="4 days/week">4 days/week</option>
                                        <option value="5 days/week">5 days/week</option>
                                        <option value="6 days/week">6 days/week</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Estimated Time
                                    </label>
                                    <select
                                        value={program.estimatedTime}
                                        onChange={(e) => updateProgram('estimatedTime', e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-dark-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                                    >
                                        <option value="15-30 min">15-30 min</option>
                                        <option value="30-45 min">30-45 min</option>
                                        <option value="45-60 min">45-60 min</option>
                                        <option value="60-90 min">60-90 min</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Program Icon
                                </label>
                                <div className="flex gap-2 flex-wrap">
                                    {['💪', '🏋️', '🔥', '🏃', '🧘', '⚡', '💥', '🎯'].map(icon => (
                                        <button
                                            key={icon}
                                            onClick={() => updateProgram('icon', icon)}
                                            className={`w-12 h-12 text-2xl rounded-lg border-2 transition-all ${program.icon === icon
                                                ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/30'
                                                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                                                }`}
                                        >
                                            {icon}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 2: Create Workout Days */}
                    {currentStep === 1 && (
                        <div className="space-y-6">
                            {/* Existing Days */}
                            {program.schedule.length > 0 && (
                                <div className="space-y-3">
                                    <h3 className="font-medium text-gray-900 dark:text-white">
                                        Workout Days ({program.schedule.length})
                                    </h3>
                                    {program.schedule.map((day, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center justify-between p-4 bg-gray-50 dark:bg-dark-700 rounded-xl"
                                        >
                                            <div>
                                                <span className="font-medium text-gray-900 dark:text-white">
                                                    {day.day}: {day.name}
                                                </span>
                                                <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                                                    ({day.exercises.length} exercises)
                                                </span>
                                            </div>
                                            <button
                                                onClick={() => removeDay(index)}
                                                className="p-2 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Add New Day Form */}
                            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-6">
                                <h3 className="font-medium text-gray-900 dark:text-white mb-4">
                                    Add Workout Day
                                </h3>

                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <input
                                        type="text"
                                        value={currentDay.day}
                                        onChange={(e) => setCurrentDay(prev => ({ ...prev, day: e.target.value }))}
                                        placeholder="e.g., Day A, Monday"
                                        className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-white"
                                    />
                                    <input
                                        type="text"
                                        value={currentDay.name}
                                        onChange={(e) => setCurrentDay(prev => ({ ...prev, name: e.target.value }))}
                                        placeholder="e.g., Upper Body"
                                        className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-white"
                                    />
                                </div>

                                {/* Exercises in current day */}
                                {currentDay.exercises.length > 0 && (
                                    <div className="space-y-2 mb-4">
                                        {currentDay.exercises.map((ex, index) => (
                                            <div
                                                key={index}
                                                className="flex items-center gap-3 p-3 bg-white dark:bg-dark-800 rounded-lg border border-gray-200 dark:border-gray-700"
                                            >
                                                <GripVertical className="w-4 h-4 text-gray-400" />
                                                <span className="flex-1 font-medium text-gray-900 dark:text-white">
                                                    {ex.name}
                                                </span>
                                                <input
                                                    type="number"
                                                    value={ex.sets}
                                                    onChange={(e) => updateExercise(index, 'sets', parseInt(e.target.value))}
                                                    className="w-16 px-2 py-1 border rounded text-center dark:bg-dark-700 dark:border-gray-600 dark:text-white"
                                                    min="1"
                                                />
                                                <span className="text-gray-500 text-sm">sets</span>
                                                <input
                                                    type="text"
                                                    value={ex.reps}
                                                    onChange={(e) => updateExercise(index, 'reps', e.target.value)}
                                                    className="w-20 px-2 py-1 border rounded text-center dark:bg-dark-700 dark:border-gray-600 dark:text-white"
                                                    placeholder="10-12"
                                                />
                                                <span className="text-gray-500 text-sm">reps</span>
                                                <button
                                                    onClick={() => removeExercise(index)}
                                                    className="p-1 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 rounded"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setShowExerciseModal(true)}
                                        className="flex items-center gap-2 px-4 py-2 border-2 border-dashed border-emerald-400 text-emerald-600 dark:text-emerald-400 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
                                    >
                                        <Plus className="w-4 h-4" />
                                        Add Exercise
                                    </button>
                                    {currentDay.exercises.length > 0 && (
                                        <button
                                            onClick={saveDay}
                                            className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600"
                                        >
                                            <Save className="w-4 h-4" />
                                            Save Day
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Review */}
                    {currentStep === 2 && (
                        <div className="space-y-6">
                            <div className="flex items-start gap-4">
                                <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center text-3xl">
                                    {program.icon}
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                        {program.name || 'Untitled Program'}
                                    </h2>
                                    <p className="text-gray-600 dark:text-gray-400">
                                        {program.description || 'No description'}
                                    </p>
                                    <div className="flex gap-4 mt-2 text-sm">
                                        <span className="text-emerald-600 dark:text-emerald-400">
                                            {program.level}
                                        </span>
                                        <span className="text-gray-500">•</span>
                                        <span className="text-gray-600 dark:text-gray-400">
                                            {program.frequency}
                                        </span>
                                        <span className="text-gray-500">•</span>
                                        <span className="text-gray-600 dark:text-gray-400">
                                            {program.estimatedTime}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="font-medium text-gray-900 dark:text-white">
                                    Workout Schedule
                                </h3>
                                {program.schedule.map((day, index) => (
                                    <div
                                        key={index}
                                        className="p-4 bg-gray-50 dark:bg-dark-700 rounded-xl"
                                    >
                                        <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                                            {day.day}: {day.name}
                                        </h4>
                                        <div className="space-y-1">
                                            {day.exercises.map((ex, exIndex) => (
                                                <div
                                                    key={exIndex}
                                                    className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400"
                                                >
                                                    <Dumbbell className="w-3 h-3" />
                                                    <span>{ex.name}</span>
                                                    <span className="text-gray-400">-</span>
                                                    <span>{ex.sets} × {ex.reps}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Navigation Buttons */}
                <div className="flex justify-between">
                    <button
                        onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))}
                        disabled={currentStep === 0}
                        className="flex items-center gap-2 px-6 py-3 text-gray-600 dark:text-gray-400 disabled:opacity-50"
                    >
                        <ChevronLeft className="w-5 h-5" />
                        Back
                    </button>

                    {currentStep < 2 ? (
                        <button
                            onClick={() => setCurrentStep(prev => prev + 1)}
                            disabled={currentStep === 0 && !program.name}
                            className="flex items-center gap-2 px-6 py-3 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 disabled:opacity-50"
                        >
                            Next
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    ) : (
                        <button
                            onClick={saveProgram}
                            disabled={saving || program.schedule.length === 0}
                            className="flex items-center gap-2 px-6 py-3 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 disabled:opacity-50"
                        >
                            {saving ? 'Saving...' : (id ? 'Update Program' : 'Save Program')}
                            <Save className="w-5 h-5" />
                        </button>
                    )}
                </div>
            </div>

            {/* Exercise Selection Modal */}
            {showExerciseModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-dark-800 rounded-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden">
                        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                    Select Exercise
                                </h3>
                                <button
                                    onClick={() => setShowExerciseModal(false)}
                                    className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <input
                                type="text"
                                value={exerciseFilter}
                                onChange={(e) => setExerciseFilter(e.target.value)}
                                placeholder="Search exercises or muscle groups..."
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-white"
                            />
                        </div>
                        <div className="overflow-y-auto max-h-96 p-4 space-y-2">
                            {filteredExercises.map(exercise => (
                                <button
                                    key={exercise.id}
                                    onClick={() => addExerciseToDay(exercise)}
                                    className="w-full flex items-center gap-4 p-3 text-left rounded-xl hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors"
                                >
                                    <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center">
                                        <Dumbbell className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-medium text-gray-900 dark:text-white">
                                            {exercise.name}
                                        </p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            {exercise.primaryMuscles.join(', ')} • {exercise.level}
                                        </p>
                                    </div>
                                    <Plus className="w-5 h-5 text-emerald-500" />
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
