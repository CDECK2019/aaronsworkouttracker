/**
 * AI Service for Advisor Chat
 * Handles OpenRouter API calls and conversation management
 */

import { getDataService } from './serviceProvider';

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';
const DEFAULT_MODEL = 'google/gemini-flash-1.5';
const STORAGE_KEY = 'fitness_advisor_conversations';

/**
 * Get the API key from environment or localStorage
 */
export const getApiKey = () => {
    return import.meta.env.VITE_OPENROUTER_API_KEY || localStorage.getItem('openrouter_api_key') || '';
};

/**
 * Set the API key in localStorage
 */
export const setApiKey = (key) => {
    localStorage.setItem('openrouter_api_key', key);
};

/**
 * Check if API key is configured
 */
export const hasApiKey = () => {
    return Boolean(getApiKey());
};

/**
 * Gather comprehensive user context from all data sources
 */
export const gatherUserContext = async () => {
    const service = getDataService();
    const context = {};

    try {
        // User Profile
        const profile = await service.getUserProfile();
        if (profile) {
            context.profile = {
                name: profile.name,
                age: profile.age,
                weight: profile.weight,
                height: profile.height,
                fitnessGoal: profile.fitnessGoal,
                activityLevel: profile.activityLevel
            };
        }

        // Holistic Goals
        const holisticGoals = await service.getHolisticGoals();
        if (holisticGoals) {
            context.holisticGoals = holisticGoals;
        }

        // Recent Workouts (last 7 days)
        const workouts = await service.getWorkouts();
        if (workouts && workouts.length > 0) {
            const sevenDaysAgo = new Date();
            sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
            context.recentWorkouts = workouts
                .filter(w => new Date(w.date) >= sevenDaysAgo)
                .slice(0, 10);
        }

        // Nutrition (today's log)
        const today = new Date().toISOString().split('T')[0];
        const nutritionLog = await service.getNutritionLog(today);
        if (nutritionLog) {
            context.todayNutrition = nutritionLog;
        }

        // Supplements
        const supplements = await service.getSupplements();
        if (supplements && supplements.length > 0) {
            context.supplements = supplements;
        }

        // Mindfulness
        const mindfulnessLogs = await service.getMindfulnessLogs();
        if (mindfulnessLogs && mindfulnessLogs.length > 0) {
            context.mindfulness = {
                totalSessions: mindfulnessLogs.length,
                totalMinutes: mindfulnessLogs.reduce((acc, log) => acc + (log.duration || 0), 0),
                recentSessions: mindfulnessLogs.slice(0, 5)
            };
        }

        // Financial Data
        const financialData = await service.getFinancialData();
        if (financialData && financialData.goals && financialData.goals.length > 0) {
            context.financial = {
                goalCount: financialData.goals.length,
                goals: financialData.goals.map(g => ({
                    name: g.name,
                    targetAmount: g.targetAmount,
                    currentAmount: g.currentAmount,
                    deadline: g.deadline,
                    category: g.category
                }))
            };
        }

        // Intellectual Data
        const intellectualData = await service.getIntellectualData();
        if (intellectualData) {
            context.intellectual = {
                category1Label: intellectualData.category1Label || 'Books Read',
                category2Label: intellectualData.category2Label || 'Skills Mastered',
                category1Count: intellectualData.category1?.filter(b => b.completed).length || 0,
                category2Count: intellectualData.category2?.filter(s => s.mastered).length || 0
            };
        }

        // Career Data
        const careerData = await service.getCareerData();
        if (careerData && careerData.milestones && careerData.milestones.length > 0) {
            context.career = {
                milestoneCount: careerData.milestones.length,
                recentMilestones: careerData.milestones.slice(0, 5)
            };
        }

        // Weight Progress
        const weightProgress = await service.getWeightProgress?.();
        if (weightProgress && weightProgress.length > 0) {
            context.weightProgress = {
                entries: weightProgress.slice(-10),
                latest: weightProgress[weightProgress.length - 1],
                trend: weightProgress.length >= 2
                    ? weightProgress[weightProgress.length - 1].weight - weightProgress[0].weight
                    : 0
            };
        }

    } catch (error) {
        console.error('Error gathering user context:', error);
    }

    return context;
};

/**
 * Format user context into a readable string for the AI
 */
export const formatContextForAI = (context) => {
    let formatted = '=== USER PROFILE & CONTEXT ===\n\n';

    if (context.profile) {
        formatted += '## Basic Profile\n';
        formatted += `- Name: ${context.profile.name || 'Not set'}\n`;
        formatted += `- Age: ${context.profile.age || 'Not set'}\n`;
        formatted += `- Weight: ${context.profile.weight || 'Not set'} lbs\n`;
        formatted += `- Height: ${context.profile.height || 'Not set'} inches\n`;
        formatted += `- Fitness Goal: ${context.profile.fitnessGoal || 'Not set'}\n`;
        formatted += `- Activity Level: ${context.profile.activityLevel || 'Not set'}\n\n`;
    }

    if (context.holisticGoals) {
        formatted += '## Holistic Goals\n';
        const goals = context.holisticGoals;
        if (goals.fitness) {
            formatted += `- Fitness: ${goals.fitness.workoutsPerWeek || 0} workouts/week target\n`;
        }
        if (goals.nutrition) {
            formatted += `- Nutrition: ${goals.nutrition.dailyCalories || 0} cal/day, ${goals.nutrition.proteinGrams || 0}g protein\n`;
        }
        if (goals.mindfulness) {
            formatted += `- Mindfulness: ${goals.mindfulness.sessionsPerWeek || 0} sessions/week\n`;
        }
        if (goals.career) {
            formatted += `- Career Target: ${goals.career.targetTitle || 'Not set'}\n`;
        }
        formatted += '\n';
    }

    if (context.recentWorkouts && context.recentWorkouts.length > 0) {
        formatted += '## Recent Workouts (Last 7 Days)\n';
        context.recentWorkouts.forEach(w => {
            formatted += `- ${w.date}: ${w.type} - ${w.duration || 0} min\n`;
        });
        formatted += '\n';
    }

    if (context.todayNutrition && context.todayNutrition.meals) {
        formatted += '## Today\'s Nutrition\n';
        const meals = context.todayNutrition.meals;
        let totalCal = 0, totalProtein = 0;
        Object.values(meals).flat().forEach(m => {
            totalCal += m.calories || 0;
            totalProtein += m.protein || 0;
        });
        formatted += `- Total Calories: ${totalCal}\n`;
        formatted += `- Total Protein: ${totalProtein}g\n\n`;
    }

    if (context.supplements && context.supplements.length > 0) {
        formatted += '## Current Supplements\n';
        context.supplements.forEach(s => {
            formatted += `- ${s.name}: ${s.dosage}, ${s.frequency}\n`;
        });
        formatted += '\n';
    }

    if (context.mindfulness) {
        formatted += '## Mindfulness Practice\n';
        formatted += `- Total Sessions: ${context.mindfulness.totalSessions}\n`;
        formatted += `- Total Minutes: ${context.mindfulness.totalMinutes}\n\n`;
    }

    if (context.financial) {
        formatted += '## Financial Goals\n';
        formatted += `- Active Goals: ${context.financial.goalCount}\n`;
        context.financial.goals.forEach(g => {
            const progress = g.targetAmount > 0 ? Math.round((g.currentAmount / g.targetAmount) * 100) : 0;
            formatted += `- ${g.name}: $${g.currentAmount}/$${g.targetAmount} (${progress}%)\n`;
        });
        formatted += '\n';
    }

    if (context.intellectual) {
        formatted += '## Intellectual Growth\n';
        formatted += `- ${context.intellectual.category1Label}: ${context.intellectual.category1Count} completed\n`;
        formatted += `- ${context.intellectual.category2Label}: ${context.intellectual.category2Count} mastered\n\n`;
    }

    if (context.career && context.career.milestoneCount > 0) {
        formatted += '## Career Milestones\n';
        context.career.recentMilestones.forEach(m => {
            formatted += `- ${m.date}: ${m.title}${m.description ? ` - ${m.description}` : ''}\n`;
        });
        formatted += '\n';
    }

    if (context.weightProgress) {
        formatted += '## Weight Progress\n';
        formatted += `- Latest: ${context.weightProgress.latest.weight} lbs (${context.weightProgress.latest.date})\n`;
        if (context.weightProgress.entries.length >= 2) {
            const trend = context.weightProgress.trend > 0 ? '+' : '';
            formatted += `- Trend: ${trend}${context.weightProgress.trend.toFixed(1)} lbs overall\n`;
        }
        formatted += '\n';
    }

    return formatted;
};

/**
 * Load saved conversations from localStorage
 */
export const loadConversations = () => {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        return saved ? JSON.parse(saved) : {};
    } catch {
        return {};
    }
};

/**
 * Save conversations to localStorage
 */
export const saveConversations = (conversations) => {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
    } catch (error) {
        console.error('Error saving conversations:', error);
    }
};

/**
 * Get or create a conversation for a specific category/framework combo
 */
export const getConversation = (categoryId, frameworkId) => {
    const conversations = loadConversations();
    const key = `${categoryId}_${frameworkId}`;
    return conversations[key] || { messages: [], lastUpdated: null };
};

/**
 * Save a conversation for a specific category/framework combo
 */
export const saveConversation = (categoryId, frameworkId, messages) => {
    const conversations = loadConversations();
    const key = `${categoryId}_${frameworkId}`;
    conversations[key] = {
        messages,
        lastUpdated: new Date().toISOString()
    };
    saveConversations(conversations);
};

/**
 * Clear a specific conversation
 */
export const clearConversation = (categoryId, frameworkId) => {
    const conversations = loadConversations();
    const key = `${categoryId}_${frameworkId}`;
    delete conversations[key];
    saveConversations(conversations);
};

/**
 * Send a message to the AI and get a response
 */
export const sendMessage = async (message, systemPrompt, conversationHistory = [], userContext = null) => {
    const apiKey = getApiKey();

    if (!apiKey) {
        throw new Error('API key not configured. Please add your OpenRouter API key.');
    }

    // Build messages array
    const messages = [];

    // System prompt with user context
    let fullSystemPrompt = systemPrompt;
    if (userContext) {
        const contextString = formatContextForAI(userContext);
        fullSystemPrompt = `${systemPrompt}\n\n${contextString}\n\nUse this context about the user to provide personalized, relevant advice. Reference specific data points when helpful, but don't overwhelm the user with everything you know. Be conversational and natural.`;
    }

    messages.push({ role: 'system', content: fullSystemPrompt });

    // Add conversation history
    conversationHistory.forEach(msg => {
        messages.push({
            role: msg.role,
            content: msg.content
        });
    });

    // Add current message
    messages.push({ role: 'user', content: message });

    try {
        const response = await fetch(OPENROUTER_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
                'HTTP-Referer': window.location.origin,
                'X-Title': 'Holistic Wellness Advisor'
            },
            body: JSON.stringify({
                model: DEFAULT_MODEL,
                messages,
                max_tokens: 1500,
                temperature: 0.7
            })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error?.message || `API error: ${response.status}`);
        }

        const data = await response.json();
        return data.choices[0]?.message?.content || 'I apologize, but I couldn\'t generate a response. Please try again.';
    } catch (error) {
        console.error('AI Service Error:', error);
        throw error;
    }
};
