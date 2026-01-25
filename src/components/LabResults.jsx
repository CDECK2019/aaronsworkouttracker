import React, { useState, useEffect } from 'react';
import { Activity, PlusCircle, Save, Trash2, Edit2, X, ChevronDown, ChevronUp, Plus } from 'lucide-react';
import localStorageService from '../services/localStorageService';
import { toast } from 'react-toastify';

export default function LabResults() {
    const [results, setResults] = useState([]);
    const [isAdding, setIsAdding] = useState(false);
    const [loading, setLoading] = useState(true);
    const [newEntry, setNewEntry] = useState({
        date: new Date().toISOString().split('T')[0],
        title: '',
        markers: {}, // Key-value pairs for preset markers
        customMarkers: [] // Array of { name, value, unit }
    });

    const PRESET_MARKERS = [
        { id: 'totalTestosterone', label: 'Total Testosterone', unit: 'ng/dL', category: 'Hormones' },
        { id: 'freeTestosterone', label: 'Free Testosterone', unit: 'pg/mL', category: 'Hormones' },
        { id: 'estradiol', label: 'Estradiol (E2)', unit: 'pg/mL', category: 'Hormones' },
        { id: 'vitaminD', label: 'Vitamin D', unit: 'ng/mL', category: 'Vitamins' },
        { id: 'totalCholesterol', label: 'Total Cholesterol', unit: 'mg/dL', category: 'Lipids' },
        { id: 'ldl', label: 'LDL Cholesterol', unit: 'mg/dL', category: 'Lipids' },
        { id: 'hdl', label: 'HDL Cholesterol', unit: 'mg/dL', category: 'Lipids' },
        { id: 'triglycerides', label: 'Triglycerides', unit: 'mg/dL', category: 'Lipids' },
        { id: 'glucose', label: 'Fasting Glucose', unit: 'mg/dL', category: 'Metabolic' },
        { id: 'hba1c', label: 'HbA1c', unit: '%', category: 'Metabolic' },
        { id: 'tsh', label: 'TSH', unit: 'mIU/L', category: 'Thyroid' },
    ];

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const data = await localStorageService.getLabResults();
            setResults(data);
        } catch (error) {
            console.error("Failed to load lab results", error);
        } finally {
            setLoading(false);
        }
    };

    const handleStartAdd = () => {
        setIsAdding(true);
        setNewEntry({
            date: new Date().toISOString().split('T')[0],
            title: '',
            markers: {},
            customMarkers: []
        });
    };

    const handleMarkerChange = (id, value) => {
        setNewEntry(prev => ({
            ...prev,
            markers: {
                ...prev.markers,
                [id]: value
            }
        }));
    };

    const addCustomMarker = () => {
        setNewEntry(prev => ({
            ...prev,
            customMarkers: [...prev.customMarkers, { name: '', value: '', unit: '' }]
        }));
    };

    const updateCustomMarker = (index, field, value) => {
        const updated = [...newEntry.customMarkers];
        updated[index] = { ...updated[index], [field]: value };
        setNewEntry(prev => ({ ...prev, customMarkers: updated }));
    };

    const removeCustomMarker = (index) => {
        const updated = newEntry.customMarkers.filter((_, i) => i !== index);
        setNewEntry(prev => ({ ...prev, customMarkers: updated }));
    };

    const handleSave = async () => {
        if (!newEntry.date || !newEntry.title) {
            toast.error("Please provide a date and title for these results.");
            return;
        }

        try {
            // Filter out empty preset markers
            const cleanedMarkers = {};
            Object.keys(newEntry.markers).forEach(key => {
                if (newEntry.markers[key] !== '') {
                    cleanedMarkers[key] = newEntry.markers[key];
                }
            });

            // Filter out empty custom markers
            const cleanedCustomMarkers = newEntry.customMarkers.filter(m => m.name && m.value);

            await localStorageService.addLabResultEntry({
                ...newEntry,
                markers: cleanedMarkers,
                customMarkers: cleanedCustomMarkers
            });

            toast.success("Lab results saved!");
            setIsAdding(false);
            loadData();
        } catch (error) {
            toast.error("Failed to save.");
        }
    };

    if (loading) return <div className="p-8 text-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto"></div></div>;

    return (
        <div className="animate-fade-in space-y-6">
            <div className="flex justify-between items-center bg-white dark:bg-dark-800 p-6 rounded-2xl border border-gray-100 dark:border-dark-700 shadow-sm">
                <div>
                    <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                        <Activity className="text-emerald-500" /> Lab Results Log
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Track your biomarkers over time.</p>
                </div>
                {!isAdding && (
                    <button onClick={handleStartAdd} className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 transition-colors shadow-lg shadow-emerald-500/20 font-semibold">
                        <PlusCircle size={18} /> Add New Results
                    </button>
                )}
            </div>

            {isAdding && (
                <div className="bg-white dark:bg-dark-800 p-6 rounded-2xl border border-emerald-100 dark:border-emerald-900/30 shadow-lg animate-slide-up relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 bg-emerald-500 h-full"></div>
                    <div className="flex justify-between items-start mb-6">
                        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">New Lab Entry</h3>
                        <button onClick={() => setIsAdding(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                            <X size={20} />
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Date</label>
                            <input
                                type="date"
                                value={newEntry.date}
                                onChange={(e) => setNewEntry({ ...newEntry, date: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-dark-600 bg-gray-50 dark:bg-dark-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-medium"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Title / Lab Name</label>
                            <input
                                type="text"
                                placeholder="e.g. Annual Physical, Quest Diagnostics"
                                value={newEntry.title}
                                onChange={(e) => setNewEntry({ ...newEntry, title: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-dark-600 bg-gray-50 dark:bg-dark-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-medium"
                            />
                        </div>
                    </div>

                    <div className="space-y-8">
                        {['Hormones', 'Lipids', 'Metabolic', 'Vitamins', 'Thyroid'].map(cat => (
                            <div key={cat}>
                                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 pl-1 border-b border-gray-100 dark:border-dark-700 pb-2">{cat}</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {PRESET_MARKERS.filter(m => m.category === cat).map(marker => (
                                        <div key={marker.id} className="relative group">
                                            <label className="text-xs text-gray-500 font-semibold mb-1 block group-hover:text-emerald-600 transition-colors uppercase tracking-wide">{marker.label}</label>
                                            <div className="relative">
                                                <input
                                                    type="number"
                                                    step="0.1"
                                                    placeholder="--"
                                                    value={newEntry.markers[marker.id] || ''}
                                                    onChange={(e) => handleMarkerChange(marker.id, e.target.value)}
                                                    className="w-full pl-4 pr-12 py-2.5 rounded-xl border border-gray-200 dark:border-dark-600 bg-gray-50 dark:bg-dark-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all text-sm font-medium"
                                                />
                                                <span className="absolute right-4 top-2.5 text-xs text-gray-400 pointer-events-none font-medium">{marker.unit}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}

                        {/* Other / Custom Category */}
                        <div>
                            <div className="flex justify-between items-center border-b border-gray-100 dark:border-dark-700 pb-2 mb-4">
                                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider pl-1">Other Results</h4>
                                <button type="button" onClick={addCustomMarker} className="text-xs font-bold text-emerald-600 hover:text-emerald-500 flex items-center gap-1">
                                    <Plus size={14} /> Add Item
                                </button>
                            </div>

                            <div className="space-y-3">
                                {newEntry.customMarkers.map((marker, idx) => (
                                    <div key={idx} className="flex gap-3 items-start animate-fade-in">
                                        <div className="flex-1">
                                            <input
                                                type="text"
                                                placeholder="Biomarker Name"
                                                value={marker.name}
                                                onChange={(e) => updateCustomMarker(idx, 'name', e.target.value)}
                                                className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-dark-600 bg-gray-50 dark:bg-dark-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 text-sm"
                                            />
                                        </div>
                                        <div className="w-24">
                                            <input
                                                type="number"
                                                step="0.1"
                                                placeholder="Val"
                                                value={marker.value}
                                                onChange={(e) => updateCustomMarker(idx, 'value', e.target.value)}
                                                className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-dark-600 bg-gray-50 dark:bg-dark-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 text-sm"
                                            />
                                        </div>
                                        <div className="w-20">
                                            <input
                                                type="text"
                                                placeholder="Unit"
                                                value={marker.unit}
                                                onChange={(e) => updateCustomMarker(idx, 'unit', e.target.value)}
                                                className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-dark-600 bg-gray-50 dark:bg-dark-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 text-sm"
                                            />
                                        </div>
                                        <button
                                            onClick={() => removeCustomMarker(idx)}
                                            className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                ))}
                                {newEntry.customMarkers.length === 0 && (
                                    <p className="text-xs text-gray-400 italic pl-1">No additional markers added.</p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="mt-10 flex justify-end gap-3 pt-6 border-t border-gray-100 dark:border-dark-700">
                        <button onClick={() => setIsAdding(false)} className="px-6 py-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 font-medium transition-colors">Cancel</button>
                        <button onClick={handleSave} className="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-2 transform active:scale-95">
                            <Save size={18} /> Save Results
                        </button>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 gap-4">
                {results.length === 0 && !isAdding && (
                    <div className="text-center py-12 bg-gray-50 dark:bg-dark-800/50 rounded-2xl border border-dashed border-gray-200 dark:border-dark-700">
                        <Activity className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500 dark:text-gray-400">No lab results logged yet.</p>
                        <button onClick={handleStartAdd} className="mt-4 text-emerald-600 hover:text-emerald-700 font-semibold text-sm">Log your first test</button>
                    </div>
                )}

                {results.map((entry) => (
                    <div key={entry.$id} className="bg-white dark:bg-dark-800 rounded-2xl border border-gray-100 dark:border-dark-700 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                        <div className="p-5 bg-gray-50/50 dark:bg-dark-750/30 flex justify-between items-center border-b border-gray-100 dark:border-dark-700">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-500">
                                    <Activity size={20} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-800 dark:text-gray-100">{entry.title}</h3>
                                    <p className="text-xs text-gray-500 font-medium">{entry.date}</p>
                                </div>
                            </div>
                            <span className="text-xs bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-3 py-1.5 rounded-lg font-bold">
                                {Object.keys(entry.markers).length + (entry.customMarkers?.length || 0)} Markers
                            </span>
                        </div>
                        <div className="p-6">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-y-6 gap-x-8">
                                {/* Preset Markers */}
                                {Object.entries(entry.markers).map(([key, value]) => {
                                    const meta = PRESET_MARKERS.find(m => m.id === key);
                                    return (
                                        <div key={key}>
                                            <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold mb-1 line-clamp-1" title={meta?.label}>{meta?.label || key}</p>
                                            <p className="font-bold text-gray-800 dark:text-gray-200 text-base">
                                                {value} <span className="text-xs text-gray-500 font-medium ml-0.5">{meta?.unit}</span>
                                            </p>
                                        </div>
                                    )
                                })}
                                {/* Custom Markers */}
                                {entry.customMarkers && entry.customMarkers.map((marker, idx) => (
                                    <div key={`custom-${idx}`}>
                                        <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold mb-1 line-clamp-1" title={marker.name}>{marker.name}</p>
                                        <p className="font-bold text-gray-800 dark:text-gray-200 text-base">
                                            {marker.value} <span className="text-xs text-gray-500 font-medium ml-0.5">{marker.unit}</span>
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
