import React, { useState } from 'react';
import { User, Target, Pill, HeartPulse, CheckCircle, Utensils, Brain, DollarSign, BookOpen, Briefcase, Camera } from 'lucide-react';

import { useSearchParams, useNavigate } from 'react-router-dom';
import { STORAGE_KEYS } from '../services/localStorageService';
import UserProfileGeneral from './UserProfileGeneral';
import HolisticGoalsForm from './HolisticGoalsForm';
import SupplementsManager from './SupplementsManager';
import HealthConsiderationsForm from './HealthConsiderationsForm';

export default function UserProfileForm() {
  const [activeTab, setActiveTab] = useState('general');
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const isOnboarding = searchParams.get('onboarding') === 'true';
  const [avatarPreview, setAvatarPreview] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const completeOnboarding = () => {
    localStorage.setItem(STORAGE_KEYS.ONBOARDING_COMPLETE, 'true');
    navigate('/dashboard');
  };

  const tabs = [
    { id: 'general', label: 'General', icon: User },
    { id: 'fitness', label: 'Fitness', icon: Target },
    { id: 'nutrition', label: 'Nutrition', icon: Utensils },
    { id: 'mindfulness', label: 'Mindfulness', icon: Brain },
    { id: 'financial', label: 'Financial', icon: DollarSign },
    { id: 'intellectual', label: 'Intellectual', icon: BookOpen },
    { id: 'career', label: 'Career', icon: Briefcase },
    { id: 'supplements', label: 'Supplements', icon: Pill },
    { id: 'health', label: 'Health', icon: HeartPulse },
  ];

  return (
    <div className="w-full max-w-5xl mt-10 mx-auto bg-white dark:bg-dark-800 p-6 md:p-8 rounded-2xl shadow-xl transition-colors">

      {/* Profile Header */}
      <div className="flex flex-col items-center justify-center mb-8">
        <div className="relative group cursor-pointer w-32 h-32 mb-4">
          <div className={`w-32 h-32 rounded-full overflow-hidden flex items-center justify-center ring-4 ring-emerald-50 dark:ring-emerald-900/10 ${!avatarPreview ? 'bg-emerald-100 dark:bg-emerald-900/30' : ''}`}>
            {avatarPreview ? (
              <img src={avatarPreview} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <User size={48} className="text-emerald-600 dark:text-emerald-400" />
            )}
          </div>
          <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <Camera className="text-white w-8 h-8" />
          </div>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
          {isOnboarding ? "Complete Your Profile" : "Your Wellness Profile"}
        </h2>
        <p className="text-gray-500 dark:text-gray-400">
          {isOnboarding ? "Just a few more details to personalize your experience" : "Manage your personal stats and holistic goals"}
        </p>
      </div>

      {/* Tabs Navigation */}
      <div className="flex overflow-x-auto border-b border-gray-200 dark:border-dark-700 mb-8 pb-1 scrollbar-hide">
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
        {activeTab === 'fitness' && <HolisticGoalsForm section="fitness" />}
        {activeTab === 'nutrition' && <HolisticGoalsForm section="nutrition" />}
        {activeTab === 'mindfulness' && <HolisticGoalsForm section="mindfulness" />}
        {activeTab === 'financial' && <HolisticGoalsForm section="financial" />}
        {activeTab === 'intellectual' && <HolisticGoalsForm section="intellectual" />}
        {activeTab === 'career' && <HolisticGoalsForm section="career" />}
        {activeTab === 'supplements' && <SupplementsManager />}
        {activeTab === 'health' && <HealthConsiderationsForm />}
      </div>

      {isOnboarding && (
        <div className="mt-12 pt-8 border-t border-gray-100 dark:border-dark-700 flex justify-center">
          <button
            onClick={completeOnboarding}
            className="flex items-center gap-2 px-10 py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-2xl shadow-lg transform hover:scale-105 transition-all"
          >
            <CheckCircle className="w-5 h-5" />
            Finish Setup & Open Dashboard
          </button>
        </div>
      )}
    </div>
  );
}