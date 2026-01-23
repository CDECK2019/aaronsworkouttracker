import React, { useState } from 'react';
import { User, Target, Pill, HeartPulse } from 'lucide-react';
import UserProfileGeneral from './UserProfileGeneral';
import HolisticGoalsForm from './HolisticGoalsForm';
import SupplementsManager from './SupplementsManager';
import HealthConsiderationsForm from './HealthConsiderationsForm';

export default function UserProfileForm() {
  const [activeTab, setActiveTab] = useState('general');

  const tabs = [
    { id: 'general', label: 'General Profile', icon: User },
    { id: 'goals', label: 'Holistic Goals', icon: Target },
    { id: 'supplements', label: 'Supplements', icon: Pill },
    { id: 'health', label: 'Health Considerations', icon: HeartPulse },
  ];

  return (
    <div className="w-full max-w-5xl mt-10 mx-auto bg-white dark:bg-dark-800 p-6 md:p-8 rounded-2xl shadow-xl transition-colors">

      {/* Profile Header */}
      <div className="flex flex-col items-center justify-center mb-8">
        <div className="w-24 h-24 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mb-4 ring-4 ring-emerald-50 dark:ring-emerald-900/10">
          <User size={40} className="text-emerald-600 dark:text-emerald-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Your Wellness Profile</h2>
        <p className="text-gray-500 dark:text-gray-400">Manage your personal stats and holistic goals</p>
      </div>

      {/* Tabs Navigation */}
      <div className="flex overflow-x-auto border-b border-gray-200 dark:border-dark-700 mb-8">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${activeTab === tab.id
                ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300'
                }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]">
        {activeTab === 'general' && <UserProfileGeneral />}
        {activeTab === 'goals' && <HolisticGoalsForm />}
        {activeTab === 'supplements' && <SupplementsManager />}
        {activeTab === 'health' && <HealthConsiderationsForm />}
      </div>
    </div>
  );
}