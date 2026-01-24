/**
 * Mindfulness Goal Templates
 */
export const mindfulnessTemplates = [
    {
        id: 'beginner_zen',
        name: 'Beginner Zen',
        description: '10 mins/day. Perfect for starting a habit.',
        minutes: 70,
        icon: '🧘',
        color: '#14B8A6' // Teal
    },
    {
        id: 'stress_relief',
        name: 'Stress Relief',
        description: '20 mins/day to decompress and center.',
        minutes: 140,
        icon: '🌊',
        color: '#0EA5E9' // Sky Blue
    },
    {
        id: 'monk_mode',
        name: 'Monk Mode',
        description: '45 mins/day. Deep practice for advanced focus.',
        minutes: 315,
        icon: '🕉️',
        color: '#8B5CF6' // Violet
    },
    {
        id: 'weekend_reset',
        name: 'Weekend Reset',
        description: '30 mins once a week to recharge.',
        minutes: 30,
        icon: '🕯️',
        color: '#F59E0B' // Amber
    },
    {
        id: 'custom_mindfulness',
        name: 'Custom',
        description: 'Set your own mindfulness goals.',
        minutes: null, // No auto-set
        icon: '✨',
        color: '#64748B' // Slate
    }
];

/**
 * Intellectual Goal Templates
 * Targets "Books Per Year" (or Category 1 item)
 */
export const intellectualTemplates = [
    {
        id: 'casual_reader',
        name: 'Casual Learner',
        description: '4 books/year. One book every quarter.',
        target: 4,
        icon: '📖',
        color: '#3B82F6' // Blue
    },
    {
        id: 'monthly_book',
        name: 'Book of the Month',
        description: '12 books/year. Consistent learning habit.',
        target: 12,
        icon: '📚',
        color: '#6366F1' // Indigo
    },
    {
        id: 'knowledge_sponge',
        name: 'Knowledge Sponge',
        description: '24 books/year. Two books per month.',
        target: 24,
        icon: '🧠',
        color: '#8B5CF6' // Violet
    },
    {
        id: 'polymath',
        name: 'Polymath Pursuit',
        description: '52 books/year. A book a week challenge.',
        target: 52,
        icon: '🎓',
        color: '#EC4899' // Pink
    },
    {
        id: 'custom_intellectual',
        name: 'Custom',
        description: 'Set your own learning targets.',
        target: null, // No auto-set
        icon: '✨',
        color: '#64748B' // Slate
    }
];

/**
 * Financial Goal Templates
 * Targets "Monthly Savings" ($)
 */
export const financialTemplates = [
    {
        id: 'starter_saver',
        name: 'Starter',
        description: 'Build a habit. $200/month.',
        amount: 200,
        icon: '🌱',
        color: '#10B981' // Emerald
    },
    {
        id: 'safety_net',
        name: 'Safety Net',
        description: 'Build reserves. $500/month.',
        amount: 500,
        icon: '🛡️',
        color: '#3B82F6' // Blue
    },
    {
        id: 'wealth_builder',
        name: 'Wealth Builder',
        description: 'Aggressive growth. $1,000/month.',
        amount: 1000,
        icon: '🚀',
        color: '#8B5CF6' // Violet
    },
    {
        id: 'financial_freedom',
        name: 'FIRE',
        description: 'Max savings. $2,500/month.',
        amount: 2500,
        icon: '🔥',
        color: '#F59E0B' // Amber
    },
    {
        id: 'custom_financial',
        name: 'Custom',
        description: 'Set your own savings goal.',
        amount: null,
        icon: '✨',
        color: '#64748B' // Slate
    }
];

/**
 * Career Goal Templates
 * Targets "Upskilling Hours / Week"
 */
export const careerTemplates = [
    {
        id: 'steady_state',
        name: 'Maintain',
        description: '1 hour/week. Keep skills sharp.',
        hours: 1,
        icon: '⚓',
        color: '#64748B' // Slate
    },
    {
        id: 'climber',
        name: 'Climber',
        description: '3 hours/week. Promotion focus.',
        hours: 3,
        icon: '🧗',
        color: '#10B981' // Emerald
    },
    {
        id: 'fast_track',
        name: 'Fast Track',
        description: '5 hours/week. Accelerated growth.',
        hours: 5,
        icon: '⚡',
        color: '#3B82F6' // Blue
    },
    {
        id: 'pivot',
        name: 'Career Pivot',
        description: '10 hours/week. Learning new domain.',
        hours: 10,
        icon: '🔄',
        color: '#8B5CF6' // Violet
    },
    {
        id: 'custom_career',
        name: 'Custom',
        description: 'Set your own development pace.',
        hours: null,
        icon: '✨',
        color: '#64748B' // Slate
    }
];
