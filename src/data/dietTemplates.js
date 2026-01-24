/**
 * Diet Plan Templates
 * Defines macro ratios for common diet types.
 * Ratios sum to 1.0 (100%)
 */

export const dietTemplates = [
    {
        id: 'balanced',
        name: 'Balanced',
        description: 'Recommended for general health and sustainability.',
        ratios: { protein: 0.25, carbs: 0.45, fat: 0.30 },
        icon: '🥗',
        color: '#10B981' // Emerald
    },
    {
        id: 'keto',
        name: 'Ketogenic',
        description: 'High fat, very low carb. Forces ketosis.',
        ratios: { protein: 0.20, carbs: 0.05, fat: 0.75 },
        icon: '🥑',
        color: '#F59E0B' // Amber
    },
    {
        id: 'high_protein',
        name: 'High Protein',
        description: 'Ideal for muscle building and satiety.',
        ratios: { protein: 0.40, carbs: 0.35, fat: 0.25 },
        icon: '🥩',
        color: '#EF4444' // Red
    },
    {
        id: 'low_carb',
        name: 'Low Carb',
        description: 'Reduced carbohydrates for weight control.',
        ratios: { protein: 0.30, carbs: 0.20, fat: 0.50 },
        icon: '🥦',
        color: '#3B82F6' // Blue
    },
    {
        id: 'paleo',
        name: 'Paleo',
        description: 'Whole foods, modeled on prehistoric diets.',
        ratios: { protein: 0.30, carbs: 0.30, fat: 0.40 },
        icon: '🍖',
        color: '#8B5CF6' // Violet
    }
];

export const calculateMacros = (calories, templateId) => {
    const template = dietTemplates.find(t => t.id === templateId);
    if (!template || !calories) return null;

    // Calories per gram: Protein 4, Carbs 4, Fat 9
    return {
        protein: Math.round((calories * template.ratios.protein) / 4),
        carbs: Math.round((calories * template.ratios.carbs) / 4),
        fat: Math.round((calories * template.ratios.fat) / 9)
    };
};
