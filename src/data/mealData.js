import { Wheat, Fish, Beef, Milk, Carrot, Apple, Egg, Coffee } from 'lucide-react';

export const commonFoods = [
    { id: 'f1', name: 'Oatmeal', calories: 150, protein: 5, carbs: 27, fat: 3, unit: 'cup' },
    { id: 'f2', name: 'Scrambled Eggs (2)', calories: 140, protein: 12, carbs: 1, fat: 10, unit: 'serving' },
    { id: 'f3', name: 'Grilled Chicken Breast', calories: 165, protein: 31, carbs: 0, fat: 3.6, unit: '100g' },
    { id: 'f4', name: 'Brown Rice', calories: 216, protein: 5, carbs: 45, fat: 1.8, unit: 'cup' },
    { id: 'f5', name: 'Broccoli', calories: 55, protein: 3.7, carbs: 11, fat: 0.6, unit: 'cup' },
    { id: 'f6', name: 'Salmon', calories: 208, protein: 20, carbs: 0, fat: 13, unit: '100g' },
    { id: 'f7', name: 'Banana', calories: 105, protein: 1.3, carbs: 27, fat: 0.3, unit: 'medium' },
    { id: 'f8', name: 'Protein Shake', calories: 120, protein: 24, carbs: 2, fat: 1, unit: 'scoop' },
    { id: 'f9', name: 'Almonds', calories: 164, protein: 6, carbs: 6, fat: 14, unit: 'oz' },
    { id: 'f10', name: 'Greek Yogurt', calories: 100, protein: 17, carbs: 6, fat: 0.7, unit: 'cup' },
];

export const mealPlans = [
    {
        id: 'plan_keto',
        name: 'Keto Kickstart',
        description: 'Low carb, high fat diet designed for rapid weight loss and metabolic flexibility.',
        category: 'Weight Loss',
        duration: '4 weeks',
        color: '#F59E0B',
        icon: '🥑',
        tags: ['Low Carb', 'High Fat'],
        days: [
            {
                day: 'Day 1',
                meals: [
                    { type: 'breakfast', name: 'Bacon & Eggs', calories: 450, protein: 25, carbs: 2, fat: 35 },
                    { type: 'lunch', name: 'Cobb Salad', calories: 600, protein: 35, carbs: 8, fat: 45 },
                    { type: 'dinner', name: 'Salmon with Asparagus', calories: 550, protein: 40, carbs: 5, fat: 38 },
                    { type: 'snack', name: 'Macadamia Nuts', calories: 200, protein: 2, carbs: 4, fat: 20 },
                ]
            }
        ]
    },
    {
        id: 'plan_muscle',
        name: 'Muscle Builder',
        description: 'High protein, moderate carb plan to fuel lean muscle growth and recovery.',
        category: 'Muscle Gain',
        duration: '8 weeks',
        color: '#EF4444',
        icon: '🥩',
        tags: ['High Protein', 'Bulking'],
        days: [
            {
                day: 'Day 1',
                meals: [
                    { type: 'breakfast', name: 'Oatmeal & Protein Shake', calories: 450, protein: 35, carbs: 50, fat: 8 },
                    { type: 'lunch', name: 'Chicken & Rice', calories: 700, protein: 50, carbs: 80, fat: 12 },
                    { type: 'dinner', name: 'Steak & Potato', calories: 800, protein: 60, carbs: 60, fat: 30 },
                    { type: 'snack', name: 'Greek Yogurt & Berries', calories: 250, protein: 20, carbs: 30, fat: 5 },
                ]
            }
        ]
    },
    {
        id: 'plan_balanced',
        name: 'Balanced Clean Eating',
        description: 'A sustainable approach with whole foods, fruits, and vegetables.',
        category: 'General Health',
        duration: 'Ongoing',
        color: '#10B981',
        icon: '🥗',
        tags: ['Healthy', 'Sustainable'],
        days: []
    }
];

export const getNutritionGoals = (profile) => {
    // Basic estimation based on generalized goals
    if (profile?.fitnessGoals?.includes('Lose')) {
        return { calories: 1800, protein: 150, carbs: 150, fat: 60 };
    } else if (profile?.fitnessGoals?.includes('Gain') || profile?.fitnessGoals?.includes('Muscle')) {
        return { calories: 2800, protein: 200, carbs: 300, fat: 80 };
    }
    return { calories: 2200, protein: 150, carbs: 250, fat: 70 }; // Maintenance
};
