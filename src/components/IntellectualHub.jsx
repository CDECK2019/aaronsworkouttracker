import React, { useState, useEffect } from 'react';
import { BookOpen, CheckCircle, Plus, GraduationCap, Edit2, X } from 'lucide-react';
import localStorageService from '../services/localStorageService';
import { toast } from 'react-toastify';

export default function IntellectualHub() {
    const [data, setData] = useState({ books: [], skills: [], category1Label: 'Books Read', category2Label: 'Skills Mastered' });
    const [goals, setGoals] = useState({});
    const [newItem, setNewItem] = useState({ title: '', type: 'book' });
    const [editingLabel, setEditingLabel] = useState(null); // 'cat1' | 'cat2'
    const [tempLabel, setTempLabel] = useState('');
    const [editingItem, setEditingItem] = useState(null); // { id, type, title }
    const [tempItemTitle, setTempItemTitle] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            const intData = await localStorageService.getIntellectualData();
            const holisticGoals = await localStorageService.getHolisticGoals();
            setData(intData);
            setGoals(holisticGoals.intellectual || {});
        };
        fetchData();
    }, []);

    const handleAddItem = async (e) => {
        e.preventDefault();
        if (!newItem.title) return;

        const item = {
            id: Date.now(),
            title: newItem.title,
            status: 'in-progress', // 'completed'
            dateAdded: new Date().toISOString()
        };

        const updatedData = { ...data };
        if (newItem.type === 'book') {
            updatedData.books = [item, ...updatedData.books];
        } else {
            updatedData.skills = [item, ...updatedData.skills];
        }

        await localStorageService.saveIntellectualData(updatedData);
        setData(updatedData);
        setNewItem({ ...newItem, title: '' });
        toast.success(`${newItem.type === 'book' ? 'Book' : 'Skill'} added`);
    };

    const toggleStatus = async (id, type) => {
        const updatedData = { ...data };
        const list = type === 'book' ? updatedData.books : updatedData.skills;
        const itemIndex = list.findIndex(i => i.id === id);
        if (itemIndex > -1) {
            list[itemIndex].status = list[itemIndex].status === 'completed' ? 'in-progress' : 'completed';
            if (list[itemIndex].status === 'completed') {
                list[itemIndex].dateCompleted = new Date().toISOString();
            }
        }
        await localStorageService.saveIntellectualData(updatedData);
        setData(updatedData);
    };

    const deleteItem = async (id, type) => {
        const updatedData = { ...data };
        if (type === 'book') {
            updatedData.books = updatedData.books.filter(b => b.id !== id);
        } else {
            updatedData.skills = updatedData.skills.filter(s => s.id !== id);
        }
        await localStorageService.saveIntellectualData(updatedData);
        setData(updatedData);
        toast.info(`${type === 'book' ? 'Book' : 'Skill'} removed`);
    };

    const saveItemEdit = async () => {
        if (!tempItemTitle) return;
        const updatedData = { ...data };
        const list = editingItem.type === 'book' ? updatedData.books : updatedData.skills;
        const itemIndex = list.findIndex(i => i.id === editingItem.id);
        if (itemIndex > -1) {
            list[itemIndex].title = tempItemTitle;
        }
        await localStorageService.saveIntellectualData(updatedData);
        setData(updatedData);
        setEditingItem(null);
        toast.success("Updated successfully");
    };

    const saveLabel = async (cat) => {
        const updatedData = { ...data, [cat === 'cat1' ? 'category1Label' : 'category2Label']: tempLabel };
        await localStorageService.saveIntellectualData(updatedData);
        setData(updatedData);
        setEditingLabel(null);
        toast.success("Category renamed");
    };

    const booksReadThisYear = data.books.filter(b => b.status === 'completed').length;
    const skillsMastered = data.skills.filter(s => s.status === 'completed').length;

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-dark-900 p-6 md:p-8 space-y-8">

            {/* Header */}
            <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                    <BookOpen className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Intellectual Hub</h1>
                    <p className="text-gray-600 dark:text-gray-400">Expand your mind. Track your reading and skills.</p>
                </div>
            </div>

            {/* Progress Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-dark-800 p-6 rounded-xl shadow-sm border-t-4 border-blue-500 group relative">
                    <div className="flex justify-between items-start">
                        <div className="flex-1">
                            {editingLabel === 'cat1' ? (
                                <div className="flex gap-2 mb-1">
                                    <input
                                        value={tempLabel}
                                        onChange={(e) => setTempLabel(e.target.value)}
                                        className="text-xs p-1 border rounded dark:bg-dark-700 dark:border-dark-600 w-full"
                                        autoFocus
                                    />
                                    <button onClick={() => saveLabel('cat1')} className="text-emerald-500"><CheckCircle size={16} /></button>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <p className="text-sm text-gray-500 uppercase font-bold">{data.category1Label || 'Books Read'}</p>
                                    <button onClick={() => { setEditingLabel('cat1'); setTempLabel(data.category1Label || 'Books Read'); }} className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-blue-500 transition-opacity">
                                        <Edit2 size={12} />
                                    </button>
                                </div>
                            )}
                            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mt-1">{booksReadThisYear}</h2>
                        </div>
                        <BookOpen className="text-blue-200 dark:text-blue-900/40 w-12 h-12" />
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-dark-700 rounded-full h-2 mt-4">
                        <div
                            className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${Math.min((booksReadThisYear / (goals.booksPerYear || 12)) * 100, 100)}%` }}
                        ></div>
                    </div>
                    <p className="text-xs text-gray-400 mt-2">Goal: {goals.booksPerYear || 12} / year</p>
                </div>

                <div className="bg-white dark:bg-dark-800 p-6 rounded-xl shadow-sm border-t-4 border-indigo-500 group relative">
                    <div className="flex justify-between items-start">
                        <div className="flex-1">
                            {editingLabel === 'cat2' ? (
                                <div className="flex gap-2 mb-1">
                                    <input
                                        value={tempLabel}
                                        onChange={(e) => setTempLabel(e.target.value)}
                                        className="text-xs p-1 border rounded dark:bg-dark-700 dark:border-dark-600 w-full"
                                        autoFocus
                                    />
                                    <button onClick={() => saveLabel('cat2')} className="text-emerald-500"><CheckCircle size={16} /></button>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <p className="text-sm text-gray-500 uppercase font-bold">{data.category2Label || 'Skills Mastered'}</p>
                                    <button onClick={() => { setEditingLabel('cat2'); setTempLabel(data.category2Label || 'Skills Mastered'); }} className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-indigo-500 transition-opacity">
                                        <Edit2 size={12} />
                                    </button>
                                </div>
                            )}
                            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mt-1">{skillsMastered}</h2>
                        </div>
                        <GraduationCap className="text-indigo-200 dark:text-indigo-900/40 w-12 h-12" />
                    </div>
                    <p className="text-xs text-gray-400 mt-6">Keep learning!</p>
                </div>
            </div>

            {/* Input Section */}
            <div className="bg-white dark:bg-dark-800 p-6 rounded-xl shadow-sm">
                <form onSubmit={handleAddItem} className="flex gap-4">
                    <select
                        value={newItem.type}
                        onChange={(e) => setNewItem({ ...newItem, type: e.target.value })}
                        className="px-4 py-2 bg-gray-50 dark:bg-dark-700 border border-gray-300 dark:border-dark-600 rounded-lg text-gray-900 dark:text-white"
                    >
                        <option value="book">{data.category1Label || 'Book'}</option>
                        <option value="skill">{data.category2Label || 'Skill'}</option>
                    </select>
                    <input
                        value={newItem.title}
                        onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                        placeholder={newItem.type === 'book' ? "Enter book title..." : "Enter skill name..."}
                        className="flex-1 px-4 py-2 bg-gray-50 dark:bg-dark-700 border border-gray-300 dark:border-dark-600 rounded-lg text-gray-900 dark:text-white"
                    />
                    <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                        <Plus className="w-5 h-5" />
                    </button>
                </form>
            </div>

            {/* Lists */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                {/* Reading List */}
                <div>
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-blue-500" /> {data.category1Label || 'Reading List'}
                    </h3>
                    <div className="space-y-3">
                        {data.books.length === 0 ? <p className="text-gray-500 italic text-sm">No items added.</p> :
                            data.books.map(book => (
                                <div key={book.id} className="group relative bg-white dark:bg-dark-800 p-4 rounded-lg shadow-sm flex items-center gap-3 hover:bg-blue-50 dark:hover:bg-dark-700 transition-colors">
                                    <div onClick={() => toggleStatus(book.id, 'book')} className="flex items-center gap-3 flex-1 cursor-pointer">
                                        <CheckCircle className={`w-5 h-5 ${book.status === 'completed' ? 'text-green-500' : 'text-gray-300 dark:text-gray-600'}`} />
                                        {editingItem?.id === book.id ? (
                                            <input
                                                value={tempItemTitle}
                                                onChange={(e) => setTempItemTitle(e.target.value)}
                                                className="flex-1 bg-transparent border-b border-blue-500 outline-none"
                                                autoFocus
                                            />
                                        ) : (
                                            <span className={`${book.status === 'completed' ? 'line-through text-gray-400' : 'text-gray-800 dark:text-gray-200'}`}>{book.title}</span>
                                        )}
                                    </div>
                                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        {editingItem?.id === book.id ? (
                                            <button onClick={saveItemEdit} className="text-emerald-500"><CheckCircle size={16} /></button>
                                        ) : (
                                            <button onClick={() => { setEditingItem({ id: book.id, type: 'book' }); setTempItemTitle(book.title); }} className="text-gray-400 hover:text-blue-500"><Edit2 size={16} /></button>
                                        )}
                                        <button onClick={() => deleteItem(book.id, 'book')} className="text-gray-400 hover:text-red-500"><X size={16} /></button>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                </div>

                {/* Skills Tracker */}
                <div>
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                        <GraduationCap className="w-5 h-5 text-indigo-500" /> {data.category2Label || 'Skills to Master'}
                    </h3>
                    <div className="space-y-3">
                        {data.skills.length === 0 ? <p className="text-gray-500 italic text-sm">No items added.</p> :
                            data.skills.map(skill => (
                                <div key={skill.id} className="group relative bg-white dark:bg-dark-800 p-4 rounded-lg shadow-sm flex items-center gap-3 hover:bg-indigo-50 dark:hover:bg-dark-700 transition-colors">
                                    <div onClick={() => toggleStatus(skill.id, 'skill')} className="flex items-center gap-3 flex-1 cursor-pointer">
                                        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${skill.status === 'completed' ? 'border-green-500 bg-green-500' : 'border-gray-300 dark:border-gray-600'}`}>
                                            {skill.status === 'completed' && <CheckCircle className="w-4 h-4 text-white" />}
                                        </div>
                                        {editingItem?.id === skill.id ? (
                                            <input
                                                value={tempItemTitle}
                                                onChange={(e) => setTempItemTitle(e.target.value)}
                                                className="flex-1 bg-transparent border-b border-indigo-500 outline-none"
                                                autoFocus
                                            />
                                        ) : (
                                            <span className={`${skill.status === 'completed' ? 'text-green-600 dark:text-green-400 font-medium' : 'text-gray-800 dark:text-gray-200'}`}>{skill.title}</span>
                                        )}
                                    </div>
                                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        {editingItem?.id === skill.id ? (
                                            <button onClick={saveItemEdit} className="text-emerald-500"><CheckCircle size={16} /></button>
                                        ) : (
                                            <button onClick={() => { setEditingItem({ id: skill.id, type: 'skill' }); setTempItemTitle(skill.title); }} className="text-gray-400 hover:text-indigo-500"><Edit2 size={16} /></button>
                                        )}
                                        <button onClick={() => deleteItem(skill.id, 'skill')} className="text-gray-400 hover:text-red-500"><X size={16} /></button>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}
