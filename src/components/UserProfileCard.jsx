import React from 'react'
import { User } from 'lucide-react'

export default function UserProfile({
  name,
  age,
  weight,
  height,
  fitnessGoals,
}) {
  return (
    <div className="bg-white dark:bg-dark-800 p-6 rounded-2xl shadow-sm transition-colors">
      <div className="flex items-center justify-center mb-4">
        <div className="bg-emerald-100 dark:bg-emerald-900/30 rounded-full p-4">
          <User className="h-12 w-12 text-emerald-600 dark:text-emerald-400" />
        </div>
      </div>
      <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-1">{name}</h2>
      <p className="text-gray-500 dark:text-gray-400 text-center mb-6 text-sm">Fitness Enthusiast</p>

      <div className="grid grid-cols-2 gap-y-6 gap-x-4 text-center">
        <div>
          <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{age}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mt-1">Age</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{weight}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mt-1">Weight (kg)</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{height}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mt-1">Height (in)</p>
        </div>
        <div className="col-span-2">
          <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400 capitalize">{fitnessGoals}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mt-1">Fitness Goal</p>
        </div>
      </div>
    </div>
  )
}