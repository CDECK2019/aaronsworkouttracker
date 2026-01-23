/**
 * Preset Workout Programs
 * Pre-built fitness programs for different goals and experience levels
 */

import { getExerciseById } from './exerciseData';

export const workoutPrograms = [
    {
        id: 'beginner_full_body',
        name: 'Beginner Full Body',
        description: 'Perfect for those new to fitness. Hit all major muscle groups 3 days per week.',
        level: 'beginner',
        duration: '4 weeks',
        frequency: '3 days/week',
        estimatedTime: '45-60 min',
        category: 'strength',
        color: '#10B981', // Green
        icon: '💪',
        schedule: [
            {
                day: 'Day A',
                name: 'Upper Body Focus',
                exercises: [
                    { exerciseId: 'push_up', sets: 3, reps: '8-12', rest: '60s' },
                    { exerciseId: 'bent_over_row', sets: 3, reps: '10-12', rest: '60s' },
                    { exerciseId: 'overhead_press', sets: 3, reps: '8-10', rest: '60s' },
                    { exerciseId: 'barbell_curl', sets: 3, reps: '10-12', rest: '45s' },
                    { exerciseId: 'plank', sets: 3, reps: '30s hold', rest: '30s' },
                ],
            },
            {
                day: 'Day B',
                name: 'Lower Body Focus',
                exercises: [
                    { exerciseId: 'squat', sets: 3, reps: '10-12', rest: '90s' },
                    { exerciseId: 'lunge', sets: 3, reps: '10 each leg', rest: '60s' },
                    { exerciseId: 'romanian_deadlift', sets: 3, reps: '10-12', rest: '90s' },
                    { exerciseId: 'calf_raise', sets: 3, reps: '15-20', rest: '45s' },
                    { exerciseId: 'crunch', sets: 3, reps: '15-20', rest: '30s' },
                ],
            },
            {
                day: 'Day C',
                name: 'Full Body Mix',
                exercises: [
                    { exerciseId: 'deadlift', sets: 3, reps: '8-10', rest: '90s' },
                    { exerciseId: 'push_up', sets: 3, reps: '10-15', rest: '60s' },
                    { exerciseId: 'pull_up', sets: 3, reps: '5-8', rest: '90s', note: 'Use assisted machine if needed' },
                    { exerciseId: 'lateral_raise', sets: 3, reps: '12-15', rest: '45s' },
                    { exerciseId: 'russian_twist', sets: 3, reps: '20 total', rest: '30s' },
                ],
            },
        ],
        weeklySchedule: ['Day A', 'Rest', 'Day B', 'Rest', 'Day C', 'Rest', 'Rest'],
    },
    {
        id: 'push_pull_legs',
        name: 'Push / Pull / Legs',
        description: 'Classic 6-day split targeting each muscle group twice per week for maximum growth.',
        level: 'intermediate',
        duration: '8 weeks',
        frequency: '6 days/week',
        estimatedTime: '60-75 min',
        category: 'strength',
        color: '#0EA5E9', // Sky Blue
        icon: '🏋️',
        schedule: [
            {
                day: 'Push',
                name: 'Chest, Shoulders & Triceps',
                exercises: [
                    { exerciseId: 'barbell_bench_press', sets: 4, reps: '6-8', rest: '90s' },
                    { exerciseId: 'overhead_press', sets: 4, reps: '8-10', rest: '90s' },
                    { exerciseId: 'dumbbell_flye', sets: 3, reps: '12-15', rest: '60s' },
                    { exerciseId: 'lateral_raise', sets: 3, reps: '12-15', rest: '45s' },
                    { exerciseId: 'tricep_dip', sets: 3, reps: '8-12', rest: '60s' },
                ],
            },
            {
                day: 'Pull',
                name: 'Back & Biceps',
                exercises: [
                    { exerciseId: 'deadlift', sets: 4, reps: '5-6', rest: '120s' },
                    { exerciseId: 'pull_up', sets: 4, reps: '6-10', rest: '90s' },
                    { exerciseId: 'bent_over_row', sets: 4, reps: '8-10', rest: '90s' },
                    { exerciseId: 'barbell_curl', sets: 3, reps: '10-12', rest: '60s' },
                    { exerciseId: 'hammer_curl', sets: 3, reps: '10-12', rest: '45s' },
                ],
            },
            {
                day: 'Legs',
                name: 'Quads, Hamstrings & Calves',
                exercises: [
                    { exerciseId: 'squat', sets: 4, reps: '6-8', rest: '120s' },
                    { exerciseId: 'romanian_deadlift', sets: 4, reps: '8-10', rest: '90s' },
                    { exerciseId: 'leg_press', sets: 3, reps: '10-12', rest: '90s' },
                    { exerciseId: 'lunge', sets: 3, reps: '10 each', rest: '60s' },
                    { exerciseId: 'calf_raise', sets: 4, reps: '15-20', rest: '45s' },
                ],
            },
        ],
        weeklySchedule: ['Push', 'Pull', 'Legs', 'Push', 'Pull', 'Legs', 'Rest'],
    },
    {
        id: 'hiit_cardio',
        name: 'HIIT Cardio Blast',
        description: 'High-intensity interval training for maximum calorie burn in minimal time.',
        level: 'intermediate',
        duration: '6 weeks',
        frequency: '3-4 days/week',
        estimatedTime: '20-25 min',
        category: 'cardio',
        color: '#F59E0B', // Amber
        icon: '🔥',
        schedule: [
            {
                day: 'Workout A',
                name: 'Tabata Style',
                exercises: [
                    { exerciseId: 'burpee', sets: 8, reps: '20s work / 10s rest', rest: '0s' },
                    { exerciseId: 'mountain_climber', sets: 8, reps: '20s work / 10s rest', rest: '0s' },
                    { exerciseId: 'jumping_jack', sets: 8, reps: '20s work / 10s rest', rest: '0s' },
                    { exerciseId: 'high_knees', sets: 8, reps: '20s work / 10s rest', rest: '0s' },
                ],
                note: 'Complete all sets of each exercise before moving to the next',
            },
            {
                day: 'Workout B',
                name: 'Circuit Training',
                exercises: [
                    { exerciseId: 'burpee', sets: 4, reps: '10', rest: '15s' },
                    { exerciseId: 'push_up', sets: 4, reps: '15', rest: '15s' },
                    { exerciseId: 'mountain_climber', sets: 4, reps: '20', rest: '15s' },
                    { exerciseId: 'squat', sets: 4, reps: '15', rest: '15s', note: 'Bodyweight squats' },
                    { exerciseId: 'plank', sets: 4, reps: '30s hold', rest: '15s' },
                ],
                note: 'Do all exercises back-to-back as one circuit, then rest 90s between circuits',
            },
        ],
        weeklySchedule: ['Workout A', 'Rest', 'Workout B', 'Rest', 'Workout A', 'Rest', 'Rest'],
    },
    {
        id: 'core_flexibility',
        name: 'Core & Flexibility',
        description: 'Build a strong core and improve flexibility with this low-impact routine.',
        level: 'beginner',
        duration: '4 weeks',
        frequency: '4-5 days/week',
        estimatedTime: '15-20 min',
        category: 'stretching',
        color: '#3B82F6', // Blue
        icon: '🧘',
        schedule: [
            {
                day: 'Core Day',
                name: 'Abdominal Strength',
                exercises: [
                    { exerciseId: 'plank', sets: 3, reps: '30-60s hold', rest: '30s' },
                    { exerciseId: 'crunch', sets: 3, reps: '15-20', rest: '30s' },
                    { exerciseId: 'russian_twist', sets: 3, reps: '20 total', rest: '30s' },
                    { exerciseId: 'leg_raise', sets: 3, reps: '10-15', rest: '30s', note: 'Can do lying on floor' },
                ],
            },
            {
                day: 'Flexibility Day',
                name: 'Full Body Stretch',
                exercises: [
                    { exerciseId: 'quad_stretch', sets: 2, reps: '30s each side', rest: '0s' },
                    { exerciseId: 'hamstring_stretch', sets: 2, reps: '30s each side', rest: '0s' },
                    { exerciseId: 'chest_stretch', sets: 2, reps: '30s', rest: '0s' },
                ],
                note: 'Hold each stretch without bouncing, breathe deeply',
            },
        ],
        weeklySchedule: ['Core Day', 'Flexibility Day', 'Core Day', 'Rest', 'Core Day', 'Flexibility Day', 'Rest'],
    },
];

// Helper functions
export const getProgramById = (id) =>
    workoutPrograms.find(p => p.id === id);

export const getProgramsByLevel = (level) =>
    workoutPrograms.filter(p => p.level === level.toLowerCase());

export const getProgramsByCategory = (category) =>
    workoutPrograms.filter(p => p.category === category.toLowerCase());

// Get full exercise details for a program day
export const getWorkoutDayWithExercises = (program, dayName) => {
    const day = program.schedule.find(d => d.day === dayName);
    if (!day) return null;

    return {
        ...day,
        exercises: day.exercises.map(ex => ({
            ...ex,
            details: getExerciseById(ex.exerciseId),
        })),
    };
};

export default workoutPrograms;
