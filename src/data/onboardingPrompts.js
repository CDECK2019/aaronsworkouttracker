/**
 * AI Onboarding Prompts and Goal Mapping
 * Defines the system prompts and logic for the conversational onboarding flow
 */

export const ONBOARDING_SYSTEM_PROMPT = `You are a warm, encouraging life coach AI assistant. Your job is to understand a user's life goals through conversation and extract structured data.

CRITICAL: You MUST respond ONLY with valid JSON. No other text, no markdown, no explanation outside the JSON.

## Goal Categories
- fitness: weight_loss | muscle_gain | endurance | general
- nutrition: balanced | keto | high_protein | low_carb | paleo  
- financial: starter | safety_net | wealth_builder | fire
- career: maintain | climber | fast_track | pivot
- intellectual: casual | monthly | sponge | polymath
- mindfulness: beginner | stress_relief | monk_mode | weekend

## Your Response Format (ALWAYS this exact JSON structure):
{"message":"Your friendly 1-2 sentence response to the user","extractedGoals":{"fitness":null,"nutrition":null,"financial":null,"career":null,"intellectual":null,"mindfulness":null},"profileComplete":false}

## Instructions
1. In "message", be warm and ask follow-up questions if needed
2. In "extractedGoals", set any detected goals like: {"fitness":{"type":"weight_loss","notes":"wants to lose 20 lbs"}}
3. Set "profileComplete":true only after capturing 2+ goals
4. Keep "message" to 1-2 sentences max

REMEMBER: Output ONLY the JSON object, nothing else.`;

export const INITIAL_MESSAGE = {
    role: 'assistant',
    content: "Hello! 👋 I'm your personal AI advisor, and I'm excited to help you design your optimal life.\n\nLet's start with a big question: **What does your ideal life look like?** What are you hoping to achieve or improve?",
    extractedGoals: {}
};

/**
 * Maps extracted goals to profile data that can be saved
 */
export const mapGoalsToProfile = (extractedGoals) => {
    const profileData = {
        holisticGoals: {},
        fitnessProgram: null,
        dietTemplate: null
    };

    // Map fitness goals to workout programs
    if (extractedGoals.fitness) {
        switch (extractedGoals.fitness.type) {
            case 'weight_loss':
                profileData.fitnessProgram = 'beginner_full_body';
                profileData.holisticGoals.fitness = { primaryGoal: 'Weight Loss' };
                break;
            case 'muscle_gain':
                profileData.fitnessProgram = 'push_pull_legs';
                profileData.holisticGoals.fitness = { primaryGoal: 'Build Muscle' };
                break;
            case 'endurance':
                profileData.fitnessProgram = 'hiit_cardio_blast';
                profileData.holisticGoals.fitness = { primaryGoal: 'Improve Endurance' };
                break;
            default:
                profileData.fitnessProgram = 'beginner_full_body';
                profileData.holisticGoals.fitness = { primaryGoal: 'General Fitness' };
        }
    }

    // Map nutrition goals to diet templates
    if (extractedGoals.nutrition) {
        profileData.dietTemplate = extractedGoals.nutrition.type || 'balanced';
    } else if (extractedGoals.fitness?.type === 'muscle_gain') {
        profileData.dietTemplate = 'high_protein';
    } else if (extractedGoals.fitness?.type === 'weight_loss') {
        profileData.dietTemplate = 'balanced';
    }

    // Map financial goals
    if (extractedGoals.financial) {
        const amountMap = {
            starter: 200,
            safety_net: 500,
            wealth_builder: 1000,
            fire: 2500
        };
        profileData.holisticGoals.financial = {
            selectedTemplate: extractedGoals.financial.type,
            monthlySavings: amountMap[extractedGoals.financial.type] || 500
        };
    }

    // Map career goals
    if (extractedGoals.career) {
        const hoursMap = {
            maintain: 1,
            climber: 3,
            fast_track: 5,
            pivot: 10
        };
        profileData.holisticGoals.career = {
            selectedTemplate: extractedGoals.career.type,
            upskillingHours: hoursMap[extractedGoals.career.type] || 3
        };
    }

    // Map intellectual goals
    if (extractedGoals.intellectual) {
        const targetMap = {
            casual: 4,
            monthly: 12,
            sponge: 24,
            polymath: 52
        };
        profileData.holisticGoals.intellectual = {
            selectedTemplate: extractedGoals.intellectual.type,
            booksPerYear: targetMap[extractedGoals.intellectual.type] || 12
        };
    }

    // Map mindfulness goals
    if (extractedGoals.mindfulness) {
        const minutesMap = {
            beginner: 70,
            stress_relief: 140,
            monk_mode: 315,
            weekend: 30
        };
        profileData.holisticGoals.mindfulness = {
            selectedTemplate: extractedGoals.mindfulness.type,
            weeklyMinutes: minutesMap[extractedGoals.mindfulness.type] || 70
        };
    }

    return profileData;
};

/**
 * Parse AI response to extract JSON
 */
export const parseAIResponse = (response) => {
    try {
        // Try to find JSON in the response
        const jsonMatch = response.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            return JSON.parse(jsonMatch[0]);
        }
    } catch (e) {
        console.error('Failed to parse AI response as JSON:', e);
    }

    // Fallback: return the response as a message
    return {
        message: response,
        extractedGoals: {},
        profileComplete: false
    };
};
