import { Wheat, Fish, Beef, Milk, Carrot, Apple, Egg, Coffee } from 'lucide-react';

export const commonFoods = [
    // Grains & Carbs
    { id: 'f1', name: 'Oatmeal (1 cup cooked)', calories: 158, protein: 6, carbs: 27, fat: 3, unit: 'cup' },
    { id: 'f4', name: 'Brown Rice (1 cup cooked)', calories: 216, protein: 5, carbs: 45, fat: 1.8, unit: 'cup' },
    { id: 'f11', name: 'White Rice (1 cup cooked)', calories: 205, protein: 4.3, carbs: 44.5, fat: 0.4, unit: 'cup' },
    { id: 'f12', name: 'Quinoa (1 cup cooked)', calories: 222, protein: 8, carbs: 39, fat: 3.6, unit: 'cup' },
    { id: 'f13', name: 'Whole Wheat Bread', calories: 81, protein: 4, carbs: 14, fat: 1, unit: 'slice' },
    { id: 'f14', name: 'White Bread', calories: 79, protein: 2.7, carbs: 15, fat: 1, unit: 'slice' },
    { id: 'f15', name: 'Pasta (1 cup cooked)', calories: 220, protein: 8, carbs: 43, fat: 1, unit: 'cup' },
    { id: 'f16', name: 'Sweet Potato (Medium)', calories: 112, protein: 2, carbs: 26, fat: 0.1, unit: 'medium' },
    { id: 'f17', name: 'Potato (Medium)', calories: 161, protein: 4, carbs: 37, fat: 0.2, unit: 'medium' },

    // Proteins
    { id: 'f2', name: 'Scrambled Eggs (2)', calories: 140, protein: 12, carbs: 1, fat: 10, unit: 'serving' },
    { id: 'f3', name: 'Grilled Chicken Breast (100g)', calories: 165, protein: 31, carbs: 0, fat: 3.6, unit: '100g' },
    { id: 'f6', name: 'Salmon (100g)', calories: 208, protein: 20, carbs: 0, fat: 13, unit: '100g' },
    { id: 'f8', name: 'Protein Shake (1 scoop)', calories: 120, protein: 24, carbs: 2, fat: 1, unit: 'scoop' },
    { id: 'f18', name: 'Ground Beef (85% lean, 4oz)', calories: 243, protein: 21, carbs: 0, fat: 17, unit: '4oz' },
    { id: 'f19', name: 'Steak (Sirloin, 4oz)', calories: 229, protein: 31, carbs: 0, fat: 11, unit: '4oz' },
    { id: 'f20', name: 'Canned Tuna (1 can)', calories: 150, protein: 33, carbs: 0, fat: 1, unit: 'can' },
    { id: 'f21', name: 'Tofu (100g)', calories: 76, protein: 8, carbs: 1.9, fat: 4.8, unit: '100g' },
    { id: 'f22', name: 'Lentils (1 cup cooked)', calories: 230, protein: 18, carbs: 40, fat: 0.8, unit: 'cup' },

    // Fruits & Veggies
    { id: 'f5', name: 'Broccoli (1 cup)', calories: 55, protein: 3.7, carbs: 11, fat: 0.6, unit: 'cup' },
    { id: 'f7', name: 'Banana (Medium)', calories: 105, protein: 1.3, carbs: 27, fat: 0.3, unit: 'medium' },
    { id: 'f23', name: 'Apple (Medium)', calories: 95, protein: 0.5, carbs: 25, fat: 0.3, unit: 'medium' },
    { id: 'f24', name: 'Orange (Medium)', calories: 62, protein: 1.2, carbs: 15, fat: 0.2, unit: 'medium' },
    { id: 'f25', name: 'Spinach (1 cup raw)', calories: 7, protein: 0.9, carbs: 1.1, fat: 0.1, unit: 'cup' },
    { id: 'f26', name: 'Avocado (1/2)', calories: 160, protein: 2, carbs: 8.5, fat: 15, unit: 'half' },

    // Dairy & Snacks
    { id: 'f9', name: 'Almonds (1oz)', calories: 164, protein: 6, carbs: 6, fat: 14, unit: 'oz' },
    { id: 'f10', name: 'Greek Yogurt (1 cup)', calories: 100, protein: 17, carbs: 6, fat: 0.7, unit: 'cup' },
    { id: 'f27', name: 'Milk (Whole, 1 cup)', calories: 149, protein: 8, carbs: 12, fat: 8, unit: 'cup' },
    { id: 'f28', name: 'Cheddar Cheese (1oz)', calories: 113, protein: 7, carbs: 0.4, fat: 9, unit: 'oz' },
    { id: 'f29', name: 'Peanut Butter (2 tbsp)', calories: 188, protein: 8, carbs: 6, fat: 16, unit: '2 tbsp' },
    { id: 'f30', name: 'Dark Chocolate (1oz)', calories: 170, protein: 2, carbs: 13, fat: 12, unit: 'oz' },
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
