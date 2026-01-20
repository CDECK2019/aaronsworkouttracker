import React, { useState, useMemo } from 'react';
import { Search, Filter, X, ChevronDown, ChevronUp, Dumbbell } from 'lucide-react';
import exercises, {
    getMuscleGroups,
    getEquipmentTypes,
    getCategories,
    getLevels
} from '../data/exerciseData';

export default function ExerciseLibrary() {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedMuscle, setSelectedMuscle] = useState('');
    const [selectedEquipment, setSelectedEquipment] = useState('');
    const [selectedLevel, setSelectedLevel] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [expandedExercise, setExpandedExercise] = useState(null);
    const [showFilters, setShowFilters] = useState(false);

    const muscleGroups = getMuscleGroups();
    const equipmentTypes = getEquipmentTypes();
    const categories = getCategories();
    const levels = getLevels();

    const filteredExercises = useMemo(() => {
        return exercises.filter(exercise => {
            const matchesSearch = exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                exercise.primaryMuscles.some(m => m.toLowerCase().includes(searchTerm.toLowerCase()));

            const matchesMuscle = !selectedMuscle ||
                exercise.primaryMuscles.includes(selectedMuscle) ||
                exercise.secondaryMuscles.includes(selectedMuscle);

            const matchesEquipment = !selectedEquipment || exercise.equipment === selectedEquipment;
            const matchesLevel = !selectedLevel || exercise.level === selectedLevel;
            const matchesCategory = !selectedCategory || exercise.category === selectedCategory;

            return matchesSearch && matchesMuscle && matchesEquipment && matchesLevel && matchesCategory;
        });
    }, [searchTerm, selectedMuscle, selectedEquipment, selectedLevel, selectedCategory]);

    const clearFilters = () => {
        setSearchTerm('');
        setSelectedMuscle('');
        setSelectedEquipment('');
        setSelectedLevel('');
        setSelectedCategory('');
    };

    const activeFilterCount = [selectedMuscle, selectedEquipment, selectedLevel, selectedCategory].filter(Boolean).length;

    const getLevelColor = (level) => {
        switch (level) {
            case 'beginner': return 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400';
            case 'intermediate': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400';
            case 'advanced': return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400';
            default: return 'bg-gray-100 dark:bg-dark-600 text-gray-700 dark:text-gray-400';
        }
    };

    const getCategoryColor = (category) => {
        switch (category) {
            case 'strength': return 'bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400';
            case 'cardio': return 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400';
            case 'stretching': return 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400';
            default: return 'bg-gray-100 dark:bg-dark-600 text-gray-700 dark:text-gray-400';
        }
    };

    return (
        <div className="bg-white dark:bg-dark-800 rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                    <Dumbbell className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
                    Exercise Library
                </h2>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                    {filteredExercises.length} exercises
                </span>
            </div>

            {/* Search Bar */}
            <div className="relative mb-4">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                    type="text"
                    placeholder="Search exercises..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-dark-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                />
            </div>

            {/* Filter Toggle */}
            <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors mb-4"
            >
                <Filter className="w-4 h-4" />
                <span>Filters</span>
                {activeFilterCount > 0 && (
                    <span className="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-xs rounded-full">
                        {activeFilterCount}
                    </span>
                )}
                {showFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {/* Filters */}
            {showFilters && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 p-4 bg-gray-50 dark:bg-dark-700 rounded-xl">
                    <select
                        value={selectedMuscle}
                        onChange={(e) => setSelectedMuscle(e.target.value)}
                        className="px-3 py-2 bg-white dark:bg-dark-600 border border-gray-200 dark:border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-800 dark:text-white"
                    >
                        <option value="">All Muscles</option>
                        {muscleGroups.map(muscle => (
                            <option key={muscle} value={muscle}>{muscle}</option>
                        ))}
                    </select>

                    <select
                        value={selectedEquipment}
                        onChange={(e) => setSelectedEquipment(e.target.value)}
                        className="px-3 py-2 bg-white dark:bg-dark-600 border border-gray-200 dark:border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-800 dark:text-white"
                    >
                        <option value="">All Equipment</option>
                        {equipmentTypes.map(equipment => (
                            <option key={equipment} value={equipment}>{equipment}</option>
                        ))}
                    </select>

                    <select
                        value={selectedLevel}
                        onChange={(e) => setSelectedLevel(e.target.value)}
                        className="px-3 py-2 bg-white dark:bg-dark-600 border border-gray-200 dark:border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-800 dark:text-white"
                    >
                        <option value="">All Levels</option>
                        {levels.map(level => (
                            <option key={level} value={level}>{level}</option>
                        ))}
                    </select>

                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="px-3 py-2 bg-white dark:bg-dark-600 border border-gray-200 dark:border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-800 dark:text-white"
                    >
                        <option value="">All Categories</option>
                        {categories.map(category => (
                            <option key={category} value={category}>{category}</option>
                        ))}
                    </select>

                    {activeFilterCount > 0 && (
                        <button
                            onClick={clearFilters}
                            className="col-span-2 md:col-span-4 flex items-center justify-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                        >
                            <X className="w-4 h-4" />
                            Clear all filters
                        </button>
                    )}
                </div>
            )}

            {/* Exercise Grid */}
            <div className="grid gap-4">
                {filteredExercises.map(exercise => (
                    <div
                        key={exercise.id}
                        className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden hover:border-emerald-300 dark:hover:border-emerald-700 transition-colors"
                    >
                        <button
                            onClick={() => setExpandedExercise(expandedExercise === exercise.id ? null : exercise.id)}
                            className="w-full p-4 flex items-center gap-4 text-left hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors"
                        >
                            {/* Exercise Image or Placeholder */}
                            <div className="w-16 h-16 bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/30 dark:to-teal-900/30 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                                {exercise.images && exercise.images.length > 0 ? (
                                    <img
                                        src={exercise.images[0]}
                                        alt={exercise.name}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            e.target.style.display = 'none';
                                            e.target.nextSibling.style.display = 'flex';
                                        }}
                                    />
                                ) : null}
                                <Dumbbell className="w-8 h-8 text-emerald-400 dark:text-emerald-500" style={{ display: exercise.images?.length ? 'none' : 'block' }} />
                            </div>

                            <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-gray-800 dark:text-white truncate">{exercise.name}</h3>
                                <div className="flex flex-wrap gap-2 mt-1">
                                    <span className={`px-2 py-0.5 text-xs rounded-full ${getLevelColor(exercise.level)}`}>
                                        {exercise.level}
                                    </span>
                                    <span className={`px-2 py-0.5 text-xs rounded-full ${getCategoryColor(exercise.category)}`}>
                                        {exercise.category}
                                    </span>
                                    <span className="px-2 py-0.5 text-xs bg-gray-100 dark:bg-dark-600 text-gray-600 dark:text-gray-400 rounded-full">
                                        {exercise.equipment}
                                    </span>
                                </div>
                            </div>

                            {expandedExercise === exercise.id ? (
                                <ChevronUp className="w-5 h-5 text-gray-400" />
                            ) : (
                                <ChevronDown className="w-5 h-5 text-gray-400" />
                            )}
                        </button>

                        {/* Expanded Details */}
                        {expandedExercise === exercise.id && (
                            <div className="px-4 pb-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-dark-700/30">
                                <div className="grid md:grid-cols-2 gap-6 mt-4">
                                    {/* Muscles */}
                                    <div>
                                        <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Target Muscles</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {exercise.primaryMuscles.map(muscle => (
                                                <span key={muscle} className="px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-sm rounded-full">
                                                    {muscle}
                                                </span>
                                            ))}
                                            {exercise.secondaryMuscles.map(muscle => (
                                                <span key={muscle} className="px-3 py-1 bg-gray-100 dark:bg-dark-600 text-gray-600 dark:text-gray-400 text-sm rounded-full">
                                                    {muscle}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Exercise Images */}
                                    {exercise.images && exercise.images.length > 0 && (
                                        <div>
                                            <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Demonstration</h4>
                                            <div className="flex gap-2">
                                                {exercise.images.slice(0, 2).map((img, idx) => (
                                                    <img
                                                        key={idx}
                                                        src={img}
                                                        alt={`${exercise.name} step ${idx + 1}`}
                                                        className="w-24 h-24 object-cover rounded-lg border border-gray-200 dark:border-gray-600"
                                                        onError={(e) => e.target.style.display = 'none'}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Instructions */}
                                <div className="mt-4">
                                    <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Instructions</h4>
                                    <ol className="list-decimal list-inside space-y-2 text-gray-600 dark:text-gray-400 text-sm">
                                        {exercise.instructions.map((instruction, idx) => (
                                            <li key={idx}>{instruction}</li>
                                        ))}
                                    </ol>
                                </div>
                            </div>
                        )}
                    </div>
                ))}

                {filteredExercises.length === 0 && (
                    <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                        <Dumbbell className="w-12 h-12 mx-auto mb-4 opacity-30" />
                        <p>No exercises found matching your criteria.</p>
                        <button
                            onClick={clearFilters}
                            className="mt-2 text-emerald-500 hover:text-emerald-600 dark:text-emerald-400 dark:hover:text-emerald-300"
                        >
                            Clear filters
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
