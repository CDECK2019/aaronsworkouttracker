import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, CheckCircle, Clock, Flame, Calendar as CalendarIcon, PlayCircle, Dumbbell, UserCheck } from 'lucide-react';
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
    const [checkedExercises, setCheckedExercises] = useState({}); // { dateStr: { exerciseId: bool } }

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

        if (program.weeklySchedule) {
            program.weeklySchedule.forEach((dayName, index) => {
                if (dayName !== 'Rest') {
                    const dayDate = addDays(start, index);
                    const dateString = format(dayDate, 'yyyy-MM-dd');
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

    const toggleExerciseCheck = (dateStr, exerciseId) => {
        setCheckedExercises(prev => ({
            ...prev,
            [dateStr]: {
                ...prev[dateStr],
                [exerciseId]: !prev[dateStr]?.[exerciseId]
            }
        }));
    };

    const handleCompleteWorkout = async (dateStr, workout) => {
        try {
            await localStorageService.addWorkout('user_id_placeholder', {
                date: dateStr,
                workout: workout.name,
                duration: parseInt(activeProgram?.estimatedTime) || 45,
                calories: 300 // Placeholder estimated calories
            });

            toast.success(`Great job! Completed ${workout.name}!`);
            loadData(); // Reload to show checkmark
        } catch (error) {
            toast.error("Failed to save workout completion");
        }
    };

    const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
    const weekDays = [...Array(7)].map((_, i) => addDays(weekStart, i));
    const todayStr = format(new Date(), 'yyyy-MM-dd');
    const todaysWorkout = scheduledWorkouts[todayStr];
    const isTodayCompleted = completedWorkouts[todayStr];

    if (loading) return <div className="p-8 text-center animate-pulse">Loading Advisor...</div>;

    if (!activeProgram) {
        return (
            <div className="bg-white dark:bg-dark-800 rounded-2xl shadow-lg p-8 text-center mb-8 border border-dashed border-gray-300 dark:border-dark-600">
                <PlayCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">No Active Program</h3>
                <p className="text-gray-500 mb-6">Your AI Advisor needs a goal. Select a program in the Fitness Hub to start.</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-fade-in">

            {/* Advisor's Today View */}
            <div className="bg-gradient-to-br from-emerald-900 to-gray-900 rounded-2xl text-white p-8 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500 rounded-full blur-3xl opacity-10 -mr-16 -mt-16"></div>

                <h2 className="text-2xl font-bold mb-2 flex items-center gap-2 relative z-10">
                    <UserCheck className="w-6 h-6 text-emerald-400" />
                    Advisor's Plan for Today
                </h2>

                {todaysWorkout ? (
                    <div className="relative z-10">
                        <div className="flex flex-col md:flex-row gap-6 mt-6">
                            <div className="flex-1">
                                <h3 className="text-3xl font-bold text-white mb-2">{todaysWorkout.name}</h3>
                                <div className="flex flex-wrap gap-4 text-emerald-200 text-sm mb-6">
                                    <span className="flex items-center gap-1"><Clock size={16} /> {activeProgram.estimatedTime}</span>
                                    <span className="flex items-center gap-1"><Dumbbell size={16} /> {todaysWorkout.exercises.length} Exercises</span>
                                    <span className="flex items-center gap-1"><Flame size={16} /> ~300 cal</span>
                                </div>

                                {isTodayCompleted ? (
                                    <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-300 px-4 py-2 rounded-lg border border-emerald-500/30">
                                        <CheckCircle size={20} />
                                        <span className="font-bold">Workout Complete! Great work.</span>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => handleCompleteWorkout(todayStr, todaysWorkout)}
                                        className="bg-emerald-500 hover:bg-emerald-400 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg shadow-emerald-500/30 flex items-center gap-2"
                                    >
                                        <CheckCircle size={20} />
                                        Complete & Log Workout
                                    </button>
                                )}
                            </div>

                            {/* Exercise Checklist */}
                            <div className="flex-1 bg-white/5 rounded-xl p-4 border border-white/10 backdrop-blur-sm">
                                <h4 className="font-bold text-emerald-300 mb-3 text-sm uppercase tracking-wider">Exercise Checklist</h4>
                                <div className="space-y-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                                    {todaysWorkout.exercises.map((ex, idx) => {
                                        const isChecked = checkedExercises[todayStr]?.[ex.exerciseId] || isTodayCompleted;
                                        return (
                                            <div
                                                key={idx}
                                                onClick={() => !isTodayCompleted && toggleExerciseCheck(todayStr, ex.exerciseId)}
                                                className={`flex items-center gap-3 p-3 rounded-lg border transition-all cursor-pointer ${isChecked ? 'bg-emerald-500/20 border-emerald-500/30' : 'bg-white/5 border-white/5 hover:bg-white/10'}`}
                                            >
                                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${isChecked ? 'border-emerald-400 bg-emerald-400' : 'border-gray-500'}`}>
                                                    {isChecked && <CheckCircle size={12} className="text-black" />}
                                                </div>
                                                <div className="flex-1">
                                                    <p className={`font-semibold text-sm ${isChecked ? 'text-emerald-200' : 'text-gray-200'}`}>{ex.details?.name || ex.exerciseId}</p>
                                                    <p className="text-xs text-gray-400">{ex.sets} sets × {ex.reps}</p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="mt-4 relative z-10">
                        <p className="text-emerald-100/70 text-lg">No workout scheduled for today. It's a Rest Day.</p>
                        <p className="text-sm text-gray-400 mt-2">Take time to recover, or do some light stretching.</p>
                    </div>
                )}
            </div>

            {/* Weekly Calendar Grid (Secondary Context) */}
            <div className="bg-white dark:bg-dark-800 rounded-2xl shadow-lg overflow-hidden transition-colors">
                <div className="p-6 border-b border-gray-100 dark:border-dark-700 flex justify-between items-center">
                    <h3 className="font-bold text-gray-800 dark:text-white flex items-center gap-2">
                        <CalendarIcon className="w-5 h-5 text-gray-400" />
                        This Week
                    </h3>
                    <div className="flex items-center gap-2">
                        <button onClick={handlePreviousWeek} className="p-1 hover:bg-gray-100 dark:hover:bg-dark-700 rounded"><ChevronLeft size={20} /></button>
                        <span className="text-xs font-semibold text-gray-500">{format(weekStart, 'MMM d')} - {format(addDays(weekStart, 6), 'MMM d')}</span>
                        <button onClick={handleNextWeek} className="p-1 hover:bg-gray-100 dark:hover:bg-dark-700 rounded"><ChevronRight size={20} /></button>
                    </div>
                </div>
                <div className="grid grid-cols-7 gap-px bg-gray-100 dark:bg-dark-700">
                    {weekDays.map((day) => {
                        const dateStr = format(day, 'yyyy-MM-dd');
                        const isToday = isSameDay(day, new Date());
                        const workout = scheduledWorkouts[dateStr];
                        const isCompleted = completedWorkouts[dateStr];

                        return (
                            <div key={dateStr} className={`bg-white dark:bg-dark-800 p-2 min-h-[100px] flex flex-col ${isToday ? 'bg-emerald-50/50 dark:bg-emerald-900/10' : ''}`}>
                                <span className={`text-[10px] uppercase font-bold mb-1 ${isToday ? 'text-emerald-600' : 'text-gray-400'}`}>{format(day, 'EEE')}</span>
                                {workout ? (
                                    <div className={`flex-1 rounded p-2 text-xs border-l-2 flex flex-col justify-between ${isCompleted ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-500' : 'bg-gray-50 dark:bg-dark-700 border-gray-300 dark:border-dark-600'}`}>
                                        <div className="font-semibold text-gray-700 dark:text-gray-300 truncate" title={workout.name}>{workout.name}</div>
                                        {isCompleted && <CheckCircle size={12} className="text-emerald-500 mt-1" />}
                                    </div>
                                ) : (
                                    <div className="flex-1 flex items-center justify-center text-gray-200 text-xl">•</div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
