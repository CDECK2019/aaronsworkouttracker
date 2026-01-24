import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, CheckCircle, Clock, Flame, Calendar as CalendarIcon, PlayCircle } from 'lucide-react';
import { format, startOfWeek, addDays, isSameDay, addWeeks, subWeeks } from 'date-fns';
import { toast } from 'react-toastify';
import localStorageService from '../services/localStorageService';
import { getProgramById, getWorkoutDayWithExercises } from '../data/workoutPrograms';

export default function WeeklyWorkoutCalendar() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [activeProgram, setActiveProgram] = useState(null);
    const [scheduledWorkouts, setScheduledWorkouts] = useState({});
    const [completedWorkouts, setCompletedWorkouts] = useState({}); // Map of date string -> workout details
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, [currentDate]);

    const loadData = async () => {
        setLoading(true);
        try {
            // 1. Get Active Program
            const activeProgramData = await localStorageService.getActiveProgram();

            if (activeProgramData && activeProgramData.programId) {
                const program = getProgramById(activeProgramData.programId);
                // If not found in preset, check custom (omitted for brevity here, assuming preset for MVP)
                if (program) {
                    setActiveProgram({ ...program, startDate: new Date(activeProgramData.startDate) });
                    generateScheduleForWeek(program, currentDate);
                }
            }

            // 2. Get Workout History to check for completions
            const history = await localStorageService.getAllWorkoutHistory();
            const completions = {};
            if (history && history.documents) {
                history.documents.forEach(doc => {
                    // Assuming doc.Date is YYYY-MM-DD
                    completions[doc.Date] = doc;
                });
            }
            setCompletedWorkouts(completions);

        } catch (error) {
            console.error("Error loading calendar data:", error);
        } finally {
            setLoading(false);
        }
    };

    const generateScheduleForWeek = (program, date) => {
        const start = startOfWeek(date, { weekStartsOn: 1 }); // Monday start
        const weekSchedule = {};

        // Simple mapping: Program Days map to Days of the Week
        // If program has 3 days: Mon, Wed, Fri
        // This logic mimics the "Weekly Schedule" array in workoutPrograms.js
        if (program.weeklySchedule) {
            program.weeklySchedule.forEach((dayName, index) => {
                if (dayName !== 'Rest') {
                    const dayDate = addDays(start, index);
                    const dateString = format(dayDate, 'yyyy-MM-dd');

                    // Find detailed workout content
                    // dayName might be "Day A" or "Push", map to schedule
                    const fullDay = getWorkoutDayWithExercises(program, dayName);
                    if (fullDay) {
                        weekSchedule[dateString] = fullDay;
                    }
                }
            });
        }
        setScheduledWorkouts(weekSchedule);
    };

    const handlePreviousWeek = () => setCurrentDate(subWeeks(currentDate, 1));
    const handleNextWeek = () => setCurrentDate(addWeeks(currentDate, 1));

    const handleCompleteWorkout = async (dateStr, workout) => {
        // Log workout to history
        try {
            const user = await localStorageService.getUserInformation(); // simplified
            // For MVP we just use a valid ID or guest ID.
            // In real app, get Auth user ID.

            await localStorageService.addWorkout('user_id_placeholder', {
                date: dateStr,
                workout: workout.name,
                duration: 45, // Placeholder estimated duration
                calories: 300 // Placeholder estimated calories
            });

            toast.success(`Completed ${workout.name}!`);
            loadData(); // Reload to show checkmark
        } catch (error) {
            toast.error("Failed to save workout completion");
        }
    };

    const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
    const weekDays = [...Array(7)].map((_, i) => addDays(weekStart, i));

    if (loading) return <div className="p-8 text-center">Loading calendar...</div>;

    if (!activeProgram) {
        return (
            <div className="bg-white dark:bg-dark-800 rounded-2xl shadow-lg p-8 text-center mb-8 border border-dashed border-gray-300 dark:border-dark-600">
                <PlayCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">No Active Program</h3>
                <p className="text-gray-500 mb-6">Select a program in the Fitness Hub to see your schedule here.</p>
                {/* Could add link to Fitness Hub */}
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-dark-800 rounded-2xl shadow-lg overflow-hidden mb-8 transition-colors">
            {/* Header */}
            <div className="p-6 border-b border-gray-100 dark:border-dark-700 flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                        <CalendarIcon className="w-5 h-5 text-emerald-500" />
                        Workout Schedule
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Current Program: <span className="font-semibold text-emerald-600 dark:text-emerald-400">{activeProgram.name}</span>
                    </p>
                </div>

                <div className="flex items-center gap-4 bg-gray-50 dark:bg-dark-700 rounded-lg p-1">
                    <button onClick={handlePreviousWeek} className="p-2 hover:bg-white dark:hover:bg-dark-600 rounded-md shadow-sm transition-all text-gray-600 dark:text-gray-300">
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <span className="text-sm font-medium w-32 text-center text-gray-700 dark:text-gray-200">
                        {format(weekStart, 'MMM d')} - {format(addDays(weekStart, 6), 'MMM d')}
                    </span>
                    <button onClick={handleNextWeek} className="p-2 hover:bg-white dark:hover:bg-dark-600 rounded-md shadow-sm transition-all text-gray-600 dark:text-gray-300">
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-1 md:grid-cols-7 gap-px bg-gray-100 dark:bg-dark-700">
                {weekDays.map((day) => {
                    const dateStr = format(day, 'yyyy-MM-dd');
                    const isToday = isSameDay(day, new Date());
                    const workout = scheduledWorkouts[dateStr];
                    const isCompleted = completedWorkouts[dateStr];

                    return (
                        <div
                            key={dateStr}
                            className={`bg-white dark:bg-dark-800 min-h-[140px] p-3 flex flex-col relative group hover:bg-gray-50 dark:hover:bg-dark-750 transition-colors ${isToday ? 'bg-emerald-50/30 dark:bg-emerald-900/10' : ''}`}
                        >
                            <span className={`text-xs font-semibold mb-2 ${isToday ? 'text-emerald-600' : 'text-gray-400'}`}>
                                {format(day, 'EEE d')}
                            </span>

                            {workout ? (
                                <div className="flex-1 flex flex-col">
                                    <div
                                        className={`p-2 rounded-lg mb-2 text-xs border-l-4 shadow-sm flex-1 ${isCompleted
                                            ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-500'
                                            : 'bg-blue-50 dark:bg-blue-900/20 border-blue-400'}`}
                                    >
                                        <p className="font-bold text-gray-800 dark:text-gray-200 line-clamp-2" title={workout.name}>
                                            {workout.name}
                                        </p>
                                        <div className="mt-2 flex items-center gap-2 text-gray-500 dark:text-gray-400">
                                            <span className="flex items-center gap-0.5" title="Exercises">
                                                <Dumbbell className="w-3 h-3" /> {workout.exercises?.length || 0}
                                            </span>
                                        </div>
                                    </div>

                                    {isCompleted ? (
                                        <div className="flex items-center justify-center gap-1 text-emerald-600 text-xs font-bold mt-1">
                                            <CheckCircle className="w-4 h-4" />
                                            Done
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => handleCompleteWorkout(dateStr, workout)}
                                            className="w-full mt-auto py-1.5 bg-white dark:bg-dark-700 border border-gray-200 dark:border-dark-600 rounded text-xs font-medium text-gray-600 dark:text-gray-300 hover:text-emerald-600 hover:border-emerald-500 transition-colors opacity-0 group-hover:opacity-100"
                                        >
                                            Mark Done
                                        </button>
                                    )}
                                </div>
                            ) : (
                                <div className="flex-1 flex items-center justify-center text-gray-300 dark:text-gray-700">
                                    <span className="text-2xl opacity-20">•</span>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
