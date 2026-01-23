import React, { useState, useEffect } from 'react';
import { Plus, Trash2, HeartPulse, Edit2, Check, X, AlertCircle } from 'lucide-react';
import localStorageService from '../services/localStorageService';
import { toast } from 'react-toastify';

const conditionCategories = [
    { id: 'chronic', label: 'Chronic Condition', color: 'red' },
    { id: 'acute', label: 'Acute/Temporary', color: 'amber' },
    { id: 'allergy', label: 'Allergy/Sensitivity', color: 'orange' },
    { id: 'injury', label: 'Injury/Recovery', color: 'blue' },
    { id: 'preventive', label: 'Preventive Focus', color: 'emerald' },
    { id: 'other', label: 'Other', color: 'gray' }
];

const getCategoryColor = (categoryId) => {
    const cat = conditionCategories.find(c => c.id === categoryId);
    if (!cat) return { bg: 'bg-gray-100 dark:bg-gray-800', text: 'text-gray-600 dark:text-gray-400', border: 'border-gray-200 dark:border-gray-700' };

    const colors = {
        red: { bg: 'bg-red-50 dark:bg-red-900/20', text: 'text-red-600 dark:text-red-400', border: 'border-red-200 dark:border-red-800' },
        amber: { bg: 'bg-amber-50 dark:bg-amber-900/20', text: 'text-amber-600 dark:text-amber-400', border: 'border-amber-200 dark:border-amber-800' },
        orange: { bg: 'bg-orange-50 dark:bg-orange-900/20', text: 'text-orange-600 dark:text-orange-400', border: 'border-orange-200 dark:border-orange-800' },
        blue: { bg: 'bg-blue-50 dark:bg-blue-900/20', text: 'text-blue-600 dark:text-blue-400', border: 'border-blue-200 dark:border-blue-800' },
        emerald: { bg: 'bg-emerald-50 dark:bg-emerald-900/20', text: 'text-emerald-600 dark:text-emerald-400', border: 'border-emerald-200 dark:border-emerald-800' },
        gray: { bg: 'bg-gray-50 dark:bg-gray-800', text: 'text-gray-600 dark:text-gray-400', border: 'border-gray-200 dark:border-gray-700' }
    };
    return colors[cat.color] || colors.gray;
};

export default function HealthConsiderationsForm() {
    const [considerations, setConsiderations] = useState([]);
    const [newItem, setNewItem] = useState({ name: '', category: 'chronic', notes: '' });
    const [editingId, setEditingId] = useState(null);
    const [editValues, setEditValues] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            const data = await localStorageService.getHealthConsiderations();
            setConsiderations(data || []);
        };
        fetchData();
    }, []);

    const handleAdd = async (e) => {
        e.preventDefault();
        if (!newItem.name.trim()) {
            toast.error('Please enter a condition name');
            return;
        }

        const item = {
            id: Date.now(),
            name: newItem.name.trim(),
            category: newItem.category,
            notes: newItem.notes.trim(),
            createdAt: new Date().toISOString()
        };

        const updated = [...considerations, item];
        setConsiderations(updated);
        await localStorageService.saveHealthConsiderations(updated);
        setNewItem({ name: '', category: 'chronic', notes: '' });
        toast.success('Health consideration added');
    };

    const handleRemove = async (id) => {
        const updated = considerations.filter(c => c.id !== id);
        setConsiderations(updated);
        await localStorageService.saveHealthConsiderations(updated);
        toast.info('Consideration removed');
    };

    const startEdit = (item) => {
        setEditingId(item.id);
        setEditValues({ name: item.name, category: item.category, notes: item.notes || '' });
    };

    const saveEdit = async (id) => {
        if (!editValues.name.trim()) return;

        const updated = considerations.map(c =>
            c.id === id
                ? { ...c, name: editValues.name.trim(), category: editValues.category, notes: editValues.notes.trim() }
                : c
        );
        setConsiderations(updated);
        await localStorageService.saveHealthConsiderations(updated);
        setEditingId(null);
        toast.success('Updated successfully');
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditValues({});
    };

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Info Banner */}
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-800 flex gap-3">
                <AlertCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-700 dark:text-blue-300">
                    <p className="font-medium mb-1">Health Considerations</p>
                    <p className="text-blue-600 dark:text-blue-400">
                        Track health conditions, allergies, injuries, or areas of focus. This information helps personalize your wellness recommendations and is available to the AI Advisor.
                    </p>
                </div>
            </div>

            {/* Add Form */}
            <div className="bg-rose-50 dark:bg-rose-900/10 p-6 rounded-xl border border-rose-100 dark:border-rose-800">
                <div className="flex items-center gap-2 mb-4 text-rose-700 dark:text-rose-400">
                    <HeartPulse className="w-5 h-5" />
                    <h3 className="font-bold text-lg">Add Health Consideration</h3>
                </div>
                <form onSubmit={handleAdd} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Condition / Focus Area
                            </label>
                            <input
                                value={newItem.name}
                                onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                                placeholder="e.g. High blood pressure, Gluten sensitivity, Knee injury"
                                className="w-full px-3 py-2 bg-white dark:bg-dark-800 border border-gray-300 dark:border-dark-600 rounded-lg text-gray-900 dark:text-white"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Category
                            </label>
                            <select
                                value={newItem.category}
                                onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                                className="w-full px-3 py-2 bg-white dark:bg-dark-800 border border-gray-300 dark:border-dark-600 rounded-lg text-gray-900 dark:text-white"
                            >
                                {conditionCategories.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.label}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Notes (optional)
                        </label>
                        <textarea
                            value={newItem.notes}
                            onChange={(e) => setNewItem({ ...newItem, notes: e.target.value })}
                            placeholder="Additional details, severity, duration, management strategies..."
                            rows={2}
                            className="w-full px-3 py-2 bg-white dark:bg-dark-800 border border-gray-300 dark:border-dark-600 rounded-lg text-gray-900 dark:text-white resize-none"
                        />
                    </div>
                    <button
                        type="submit"
                        className="px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors flex items-center justify-center gap-2"
                    >
                        <Plus className="w-5 h-5" /> Add Consideration
                    </button>
                </form>
            </div>

            {/* Current List */}
            <div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
                    Your Health Considerations
                </h3>
                {considerations.length === 0 ? (
                    <p className="text-gray-500 dark:text-gray-400 italic">No health considerations added yet.</p>
                ) : (
                    <div className="space-y-3">
                        {considerations.map((item) => {
                            const colors = getCategoryColor(item.category);
                            const categoryLabel = conditionCategories.find(c => c.id === item.category)?.label || 'Other';

                            if (editingId === item.id) {
                                return (
                                    <div key={item.id} className="bg-white dark:bg-dark-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-dark-700 space-y-3">
                                        <input
                                            value={editValues.name}
                                            onChange={(e) => setEditValues({ ...editValues, name: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-gray-50 dark:bg-dark-700 text-gray-900 dark:text-white"
                                        />
                                        <select
                                            value={editValues.category}
                                            onChange={(e) => setEditValues({ ...editValues, category: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-gray-50 dark:bg-dark-700 text-gray-900 dark:text-white"
                                        >
                                            {conditionCategories.map(cat => (
                                                <option key={cat.id} value={cat.id}>{cat.label}</option>
                                            ))}
                                        </select>
                                        <textarea
                                            value={editValues.notes}
                                            onChange={(e) => setEditValues({ ...editValues, notes: e.target.value })}
                                            rows={2}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-gray-50 dark:bg-dark-700 text-gray-900 dark:text-white resize-none"
                                            placeholder="Notes..."
                                        />
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => saveEdit(item.id)}
                                                className="px-3 py-1 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 flex items-center gap-1"
                                            >
                                                <Check size={16} /> Save
                                            </button>
                                            <button
                                                onClick={cancelEdit}
                                                className="px-3 py-1 bg-gray-200 dark:bg-dark-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-dark-500 flex items-center gap-1"
                                            >
                                                <X size={16} /> Cancel
                                            </button>
                                        </div>
                                    </div>
                                );
                            }

                            return (
                                <div key={item.id} className={`p-4 rounded-xl border ${colors.bg} ${colors.border} group`}>
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <h4 className="font-bold text-gray-800 dark:text-white">{item.name}</h4>
                                                <span className={`text-xs px-2 py-0.5 rounded-full ${colors.bg} ${colors.text} border ${colors.border}`}>
                                                    {categoryLabel}
                                                </span>
                                            </div>
                                            {item.notes && (
                                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{item.notes}</p>
                                            )}
                                        </div>
                                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => startEdit(item)}
                                                className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleRemove(item.id)}
                                                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
