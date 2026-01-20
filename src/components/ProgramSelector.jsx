import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Calendar, Clock, Flame, ChevronRight, PlayCircle, Dumbbell, Heart, Zap, Plus, Trash2, Edit2 } from 'lucide-react';
import workoutPrograms, { getWorkoutDayWithExercises } from '../data/workoutPrograms';
import { getDataService } from '../services/serviceProvider';

export default function ProgramSelector({ onSelectProgram }) {
    const navigate = useNavigate();
    const [selectedProgram, setSelectedProgram] = useState(null);
    const [selectedDay, setSelectedDay] = useState(null);
    const [customPrograms, setCustomPrograms] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadCustomPrograms();
    }, []);

    const loadCustomPrograms = async () => {
        try {
            const dataService = getDataService();
            const programs = await dataService.getCustomPrograms();
            setCustomPrograms(programs);
        } catch (error) {
            console.error('Error loading custom programs:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteCustomProgram = async (e, programId) => {
        e.stopPropagation();
        if (confirm('Are you sure you want to delete this program?')) {
            try {
                const dataService = getDataService();
                await dataService.deleteCustomProgram(programId);
                await loadCustomPrograms();
            } catch (error) {
                console.error('Error deleting program:', error);
            }
        }
    };

    const handleProgramSelect = (program) => {
        setSelectedProgram(program);
        setSelectedDay(null);
    };

    const handleDaySelect = (dayName) => {
        if (selectedProgram) {
            if (selectedProgram.isCustom) {
                const day = selectedProgram.schedule.find(d => d.day === dayName);
                setSelectedDay(day);
            } else {
                const dayWithExercises = getWorkoutDayWithExercises(selectedProgram, dayName);
                setSelectedDay(dayWithExercises);
            }
        }
    };

    const handleBack = () => {
        if (selectedDay) {
            setSelectedDay(null);
        } else if (selectedProgram) {
            setSelectedProgram(null);
        }
    };

    const getCategoryIcon = (category) => {
        switch (category) {
            case 'strength': return <Dumbbell className="w-6 h-6" />;
            case 'cardio': return <Flame className="w-6 h-6" />;
            case 'stretching': return <Heart className="w-6 h-6" />;
            default: return <Zap className="w-6 h-6" />;
        }
    };

    // Show workout day details
    if (selectedDay) {
        return (
            <div className="bg-white dark:bg-dark-800 rounded-2xl shadow-lg p-6">
                <button
                    onClick={handleBack}
                    className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 mb-6"
                >
                    <ChevronRight className="w-5 h-5 rotate-180" />
                    Back to {selectedProgram.name}
                </button>

                <div className="mb-6">
                    <span className="px-3 py-1 text-sm font-medium rounded-full" style={{ backgroundColor: `${selectedProgram.color}20`, color: selectedProgram.color }}>
                        {selectedDay.day}
                    </span>
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white mt-2">{selectedDay.name}</h2>
                    {selectedDay.note && (
                        <p className="text-gray-500 dark:text-gray-400 mt-2">{selectedDay.note}</p>
                    )}
                </div>

                <div className="space-y-4">
                    {selectedDay.exercises.map((exercise, idx) => (
                        <div key={idx} className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-dark-700 rounded-xl">
                            <div className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold" style={{ backgroundColor: selectedProgram.color }}>
                                {idx + 1}
                            </div>
                            <div className="flex-1">
                                <h3 className="font-semibold text-gray-800 dark:text-white">
                                    {exercise.details?.name || exercise.name || exercise.exerciseId}
                                </h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {exercise.sets} sets × {exercise.reps} {exercise.rest !== '0s' && `• Rest: ${exercise.rest}`}
                                </p>
                                {exercise.note && (
                                    <p className="text-xs text-emerald-500 mt-1">{exercise.note}</p>
                                )}
                            </div>
                            {exercise.details?.images?.[0] && (
                                <img
                                    src={exercise.details.images[0]}
                                    alt={exercise.details.name}
                                    className="w-16 h-16 object-cover rounded-lg"
                                    onError={(e) => e.target.style.display = 'none'}
                                />
                            )}
                        </div>
                    ))}
                </div>

                <button
                    onClick={() => onSelectProgram && onSelectProgram(selectedProgram, selectedDay)}
                    className="w-full mt-6 py-4 rounded-xl font-semibold text-white flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                    style={{ backgroundColor: selectedProgram.color }}
                >
                    <PlayCircle className="w-5 h-5" />
                    Start This Workout
                </button>
            </div>
        );
    }

    // Show program details
    if (selectedProgram) {
        return (
            <div className="bg-white dark:bg-dark-800 rounded-2xl shadow-lg p-6">
                <button
                    onClick={handleBack}
                    className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 mb-6"
                >
                    <ChevronRight className="w-5 h-5 rotate-180" />
                    All Programs
                </button>

                <div className="flex items-start gap-4 mb-6">
                    <div
                        className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-3xl"
                        style={{ backgroundColor: selectedProgram.color }}
                    >
                        {selectedProgram.icon}
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{selectedProgram.name}</h2>
                            {selectedProgram.isCustom && (
                                <span className="px-2 py-0.5 text-xs bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 rounded-full">
                                    Custom
                                </span>
                            )}
                        </div>
                        <p className="text-gray-500 dark:text-gray-400 mt-1">{selectedProgram.description}</p>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="p-4 bg-gray-50 dark:bg-dark-700 rounded-xl text-center">
                        <Calendar className="w-5 h-5 mx-auto mb-2 text-gray-400" />
                        <p className="font-semibold text-gray-800 dark:text-white">{selectedProgram.duration || selectedProgram.frequency}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Duration</p>
                    </div>
                    <div className="p-4 bg-gray-50 dark:bg-dark-700 rounded-xl text-center">
                        <Clock className="w-5 h-5 mx-auto mb-2 text-gray-400" />
                        <p className="font-semibold text-gray-800 dark:text-white">{selectedProgram.estimatedTime}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Per Session</p>
                    </div>
                    <div className="p-4 bg-gray-50 dark:bg-dark-700 rounded-xl text-center">
                        <Flame className="w-5 h-5 mx-auto mb-2 text-gray-400" />
                        <p className="font-semibold text-gray-800 dark:text-white capitalize">{selectedProgram.level}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Level</p>
                    </div>
                </div>

                {selectedProgram.weeklySchedule && (
                    <>
                        <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-3">Weekly Schedule</h3>
                        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, idx) => {
                                const workout = selectedProgram.weeklySchedule[idx];
                                const isRest = workout === 'Rest';
                                return (
                                    <div
                                        key={day}
                                        className={`flex-shrink-0 w-16 p-3 rounded-xl text-center ${isRest ? 'bg-gray-100 dark:bg-dark-700' : ''}`}
                                        style={!isRest ? { backgroundColor: `${selectedProgram.color}15` } : {}}
                                    >
                                        <p className="text-xs text-gray-500 dark:text-gray-400">{day}</p>
                                        <p className={`text-xs font-medium mt-1 ${isRest ? 'text-gray-400' : ''}`} style={!isRest ? { color: selectedProgram.color } : {}}>
                                            {workout}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                    </>
                )}

                <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-3">Workout Days</h3>
                <div className="space-y-3">
                    {selectedProgram.schedule.map((day, idx) => (
                        <button
                            key={idx}
                            onClick={() => handleDaySelect(day.day)}
                            className="w-full p-4 bg-gray-50 dark:bg-dark-700 hover:bg-gray-100 dark:hover:bg-dark-600 rounded-xl flex items-center justify-between transition-colors"
                        >
                            <div className="flex items-center gap-4">
                                <div
                                    className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold"
                                    style={{ backgroundColor: selectedProgram.color }}
                                >
                                    {day.day.charAt(0)}
                                </div>
                                <div className="text-left">
                                    <h4 className="font-semibold text-gray-800 dark:text-white">{day.day}</h4>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{day.name}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-400">{day.exercises.length} exercises</span>
                                <ChevronRight className="w-5 h-5 text-gray-400" />
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        );
    }

    // Combine preset and custom programs
    const allPrograms = [...workoutPrograms, ...customPrograms];

    // Show program list
    return (
        <div className="bg-white dark:bg-dark-800 rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                    <PlayCircle className="w-7 h-7 text-emerald-600" />
                    Workout Programs
                </h2>
                <Link
                    to="/programs/create"
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-colors font-medium"
                >
                    <Plus className="w-5 h-5" />
                    Create Program
                </Link>
            </div>

            {/* Custom Programs Section */}
            {customPrograms.length > 0 && (
                <div className="mb-6">
                    <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                        Your Programs
                    </h3>
                    <div className="grid gap-4">
                        {customPrograms.map((program) => (
                            <button
                                key={program.id}
                                onClick={() => handleProgramSelect(program)}
                                className="p-4 rounded-xl border-2 border-emerald-200 dark:border-emerald-800 hover:border-emerald-400 dark:hover:border-emerald-600 transition-all text-left group bg-emerald-50/50 dark:bg-emerald-900/20"
                            >
                                <div className="flex items-start gap-4">
                                    <div
                                        className="w-14 h-14 rounded-xl flex items-center justify-center text-white text-2xl group-hover:scale-105 transition-transform"
                                        style={{ backgroundColor: program.color || '#10B981' }}
                                    >
                                        {program.icon}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-bold text-gray-800 dark:text-white text-lg">{program.name}</h3>
                                            <span className="px-2 py-0.5 text-xs bg-emerald-100 dark:bg-emerald-900 text-emerald-600 dark:text-emerald-400 rounded-full">
                                                Custom
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{program.description || 'No description'}</p>
                                        <div className="flex flex-wrap gap-3 mt-3">
                                            <span className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                                                <Calendar className="w-4 h-4" />
                                                {program.frequency}
                                            </span>
                                            <span className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                                                <Dumbbell className="w-4 h-4" />
                                                {program.schedule?.length || 0} days
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                navigate(`/programs/edit/${program.id}`);
                                            }}
                                            className="p-2 text-emerald-600 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 rounded-lg"
                                            title="Edit Program"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={(e) => handleDeleteCustomProgram(e, program.id)}
                                            className="p-2 text-red-400 hover:text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg"
                                            title="Delete Program"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Preset Programs Section */}
            <div>
                {customPrograms.length > 0 && (
                    <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                        Featured Programs
                    </h3>
                )}
                <div className="grid gap-4">
                    {workoutPrograms.map((program) => (
                        <button
                            key={program.id}
                            onClick={() => handleProgramSelect(program)}
                            className="p-4 rounded-xl border-2 border-transparent hover:border-gray-200 dark:hover:border-gray-700 transition-all text-left group"
                            style={{ backgroundColor: `${program.color}10` }}
                        >
                            <div className="flex items-start gap-4">
                                <div
                                    className="w-14 h-14 rounded-xl flex items-center justify-center text-white text-2xl group-hover:scale-105 transition-transform"
                                    style={{ backgroundColor: program.color }}
                                >
                                    {program.icon}
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-bold text-gray-800 dark:text-white text-lg">{program.name}</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{program.description}</p>
                                    <div className="flex flex-wrap gap-3 mt-3">
                                        <span className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                                            <Calendar className="w-4 h-4" />
                                            {program.frequency}
                                        </span>
                                        <span className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                                            <Clock className="w-4 h-4" />
                                            {program.estimatedTime}
                                        </span>
                                        <span
                                            className="px-2 py-0.5 text-xs rounded-full font-medium capitalize"
                                            style={{ backgroundColor: `${program.color}30`, color: program.color }}
                                        >
                                            {program.level}
                                        </span>
                                    </div>
                                </div>
                                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:translate-x-1 transition-transform" />
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
