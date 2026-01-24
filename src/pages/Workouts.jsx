import React from 'react'

import WorkoutForm from '../components/WorkoutForm'
import WeeklyWorkoutCalendar from '../components/WeeklyWorkoutCalendar'

function Workouts() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-dark-900 py-8 transition-colors">
      <div className="max-w-6xl mx-auto px-4">
        <WeeklyWorkoutCalendar />

        <div className="flex items-center gap-2 mb-4 mt-12">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">Log Extra Workout</h2>
          <span className="text-sm text-gray-500">(Optional)</span>
        </div>
        <WorkoutForm />
      </div>
    </div>
  )
}

export default Workouts
