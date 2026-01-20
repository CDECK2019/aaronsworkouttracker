import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Pill } from 'lucide-react';
import localStorageService from '../services/localStorageService';
import { toast } from 'react-toastify';

export default function SupplementsManager() {
    const [supplements, setSupplements] = useState([]);
    const [newSupp, setNewSupp] = useState({ name: '', load: '', frequency: '' });

    useEffect(() => {
        const fetchSupplements = async () => {
            const data = await localStorageService.getSupplements();
            setSupplements(data);
        };
        fetchSupplements();
    }, []);

    const handleAdd = async (e) => {
        e.preventDefault();
        if (!newSupp.name) return;

        const updated = [...supplements, { id: Date.now(), ...newSupp }];
        setSupplements(updated);
        await localStorageService.saveSupplements(updated);
        setNewSupp({ name: '', load: '', frequency: '' });
        toast.success("Supplement added to stack");
    };

    const handleRemove = async (id) => {
        const updated = supplements.filter(s => s.id !== id);
        setSupplements(updated);
        await localStorageService.saveSupplements(updated);
        toast.info("Supplement removed");
    };

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="bg-teal-50 dark:bg-teal-900/10 p-6 rounded-xl border border-teal-100 dark:border-teal-800">
                <div className="flex items-center gap-2 mb-4 text-teal-700 dark:text-teal-400">
                    <Pill className="w-5 h-5" />
                    <h3 className="font-bold text-lg">Add to Stack</h3>
                </div>
                <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
                        <input
                            value={newSupp.name}
                            onChange={(e) => setNewSupp({ ...newSupp, name: e.target.value })}
                            placeholder="e.g. Vitamin D3"
                            className="w-full px-3 py-2 bg-white dark:bg-dark-800 border border-gray-300 dark:border-dark-600 rounded-lg text-gray-900 dark:text-white"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Dosage</label>
                        <input
                            value={newSupp.load}
                            onChange={(e) => setNewSupp({ ...newSupp, load: e.target.value })}
                            placeholder="e.g. 5000 IU"
                            className="w-full px-3 py-2 bg-white dark:bg-dark-800 border border-gray-300 dark:border-dark-600 rounded-lg text-gray-900 dark:text-white"
                        />
                    </div>
                    <button
                        type="submit"
                        className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors flex items-center justify-center gap-2 h-[42px]"
                    >
                        <Plus className="w-5 h-5" /> Add
                    </button>
                </form>
            </div>

            <div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Current Stack</h3>
                {supplements.length === 0 ? (
                    <p className="text-gray-500 dark:text-gray-400 italic">No supplements added yet.</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {supplements.map((supp) => (
                            <div key={supp.id} className="bg-white dark:bg-dark-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-dark-700 flex justify-between items-center group">
                                <div>
                                    <h4 className="font-bold text-gray-800 dark:text-white">{supp.name}</h4>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{supp.load}</p>
                                </div>
                                <button
                                    onClick={() => handleRemove(supp.id)}
                                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
