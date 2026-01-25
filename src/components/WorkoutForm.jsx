import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { CalendarIcon, Dumbbell, Clock, Flame, CheckCircle, XCircle } from 'lucide-react'
import localStorageService from '../services/localStorageService'
import { toast, ToastContainer, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function WorkoutForm() {
  const { register, handleSubmit, reset, formState: { errors } } = useForm()
  const [loading, setLoading] = useState(false)

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      // Use placeholder ID for now as we are in local mode
      // fast and responsive
      const result = await localStorageService.addWorkout('user_id_placeholder', {
        date: data.date,
        workout: data.workout,
        duration: data.duration,
        calories: data.calories
      })

      if (result) {
        toast.success("Workout logged successfully!");
        reset()
        // Dispatch event so Calendar updates immediately
        window.dispatchEvent(new Event('fitness_data_changed'));
      } else {
        toast.error("Failed to log workout.");
      }
    } catch (error) {
      console.error(error)
      toast.error("Something went wrong.");
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full bg-white dark:bg-dark-800 p-8 rounded-2xl shadow-lg border border-gray-100 dark:border-dark-700 transition-colors animate-fade-in">
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={true}
        transition={Slide}
        theme="colored"
      />

      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
          <Dumbbell className="w-6 h-6 text-blue-600 dark:text-blue-400" />
        </div>
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">Add Custom Session</h2>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Date Input */}
          <div>
            <label htmlFor="date" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Date
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <CalendarIcon className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="date"
                id="date"
                {...register("date", { required: "Date is required" })}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-dark-700 border border-gray-200 dark:border-dark-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white transition-all outline-none"
              />
            </div>
            {errors.date && <p className="mt-1 text-xs text-red-500 flex items-center gap-1"><XCircle size={10} /> {errors.date.message}</p>}
          </div>

          {/* Workout Name Input */}
          <div>
            <label htmlFor="workout" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Workout Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Dumbbell className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                id="workout"
                {...register("workout", { required: "Name is required" })}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-dark-700 border border-gray-200 dark:border-dark-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white transition-all outline-none"
                placeholder="e.g. Upper Body Power"
              />
            </div>
            {errors.workout && <p className="mt-1 text-xs text-red-500 flex items-center gap-1"><XCircle size={10} /> {errors.workout.message}</p>}
          </div>

          {/* Duration Input */}
          <div>
            <label htmlFor="duration" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Duration (min)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Clock className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="number"
                id="duration"
                {...register("duration", {
                  required: "Required",
                  min: { value: 1, message: "Must be > 0" },
                  valueAsNumber: true
                })}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-dark-700 border border-gray-200 dark:border-dark-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white transition-all outline-none"
                placeholder="45"
              />
            </div>
            {errors.duration && <p className="mt-1 text-xs text-red-500 flex items-center gap-1"><XCircle size={10} /> {errors.duration.message}</p>}
          </div>

          {/* Calories Input */}
          <div>
            <label htmlFor="calories" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Calories
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Flame className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="number"
                id="calories"
                {...register("calories", {
                  required: "Required",
                  min: { value: 0, message: "Must be > 0" },
                  valueAsNumber: true
                })}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-dark-700 border border-gray-200 dark:border-dark-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white transition-all outline-none"
                placeholder="300"
              />
            </div>
            {errors.calories && <p className="mt-1 text-xs text-red-500 flex items-center gap-1"><XCircle size={10} /> {errors.calories.message}</p>}
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => reset()}
            className="px-6 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-dark-700 hover:bg-gray-200 dark:hover:bg-dark-600 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            Clear
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-lg shadow-blue-500/20 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center gap-2"
          >
            {loading ? 'Adding...' : 'Log Session'}
          </button>
        </div>
      </form>
    </div>
  )
}
export default WorkoutForm