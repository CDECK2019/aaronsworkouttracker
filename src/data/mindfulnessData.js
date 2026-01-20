export const mindfulnessData = {
    categories: [
        { id: 'morning_focus', name: 'Morning Focus', color: 'emerald' },
        { id: 'sleep', name: 'Sleep & Relaxation', color: 'indigo' },
        { id: 'stress_relief', name: 'Stress Relief', color: 'teal' },
    ],
    meditations: [
        {
            id: 'med_1',
            title: '5-Minute Morning Reset',
            duration: 5,
            category: 'morning_focus',
            description: 'Start your day with clarity and intention.',
            tags: ['quick', 'beginner'],
        },
        {
            id: 'med_2',
            title: 'Deep Sleep Body Scan',
            duration: 20,
            category: 'sleep',
            description: 'Release tension from head to toe for better sleep.',
            tags: ['bedtime', 'relaxation'],
        },
        {
            id: 'med_3',
            title: 'Anxiety SOS',
            duration: 3,
            category: 'stress_relief',
            description: 'Quick breathing technique to calm the nervous system.',
            tags: ['sos', 'breathing'],
        },
        {
            id: 'med_4',
            title: 'Productivity Visualization',
            duration: 10,
            category: 'morning_focus',
            description: 'Visualize your successful day ahead.',
            tags: ['focus', 'work'],
        },
    ],
    affirmations: [
        "I am capable of achieving my goals.",
        "I prioritize my well-being every single day.",
        "My body is strong, and my mind is clear.",
        "I engage in healthy habits that support my holistic growth.",
        "I am grateful for the progress I make, no matter how small.",
        "Every breath I take fills me with peace.",
        "I honor my body by listening to what it needs.",
    ]
};
