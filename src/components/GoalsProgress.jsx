/* eslint-disable react/prop-types */


import React, { useState, useEffect } from 'react';
import { Target, Footprints, Clock } from 'lucide-react';
import { getAuthService, getDataService, getServiceMode } from '../services/serviceProvider';

export default function GoalsProgress({ tittle = "n/a", }) {
  const [dailyData, setDailyData] = useState(null);
  const [weeklyData, setWeeklyData] = useState(null);

  const [loading, setLoading] = useState(true);


  const fetchData = React.useCallback(async (userId) => {
    try {
      const dataService = getDataService();

      // For local storage, we use simplified goal fetching
      const getDailyGoals = await dataService.getUserInformation('dailygoals', userId);
      if (getDailyGoals) {
        setDailyData(getDailyGoals);
      } else {
        // Set default goals for guest mode
        setDailyData({
          caloriesBurned: 0,
          outOfCaloriesBurned: 500,
          stepsTaken: 0,
          targetSteps: 10000,
          spendWorkoutTimeMinutes: 0,
          outOfWorkoutTimeMinutes: 60
        });
      }

      if (tittle === "Weekly Goals") {
        const getWeeklyData = await dataService.getUserInformation('weeklygoals', userId);
        if (getWeeklyData) {
          setWeeklyData(getWeeklyData);
        } else {
          setWeeklyData({
            caloriesBurned: 0,
            stepsTaken: 0,
            spendWorkoutTimeMinutes: 0
          });
        }
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }, [tittle])


  React.useEffect(() => {
    const userAuthenticate = async () => {
      const authService = getAuthService();
      const getUser = await authService.getCurrentUser();
      if (getUser) {
        fetchData(getUser.$id);
      }
    };
    userAuthenticate();
  }, [fetchData])

  // console.log("dailyGoals data::", dailyData)
  // console.log("weeklyGoals data::", weeklyData)



  // Reset weekly goals at the start of a new week
  const resetWeeklyGoals = async () => {
    const currentDay = new Date().getDay(); // Get the current day (0 is Sunday)

    if (currentDay === 0) {
      try {
        const authService = getAuthService();
        const dataService = getDataService();
        const currentUser = await authService.getCurrentUser();
        const resetData = {
          caloriesBurned: 0,
          stepsTaken: 0,
          spendWorkoutTimeMinutes: 0,
        };

        await dataService.updateWeeklyGoals(currentUser.$id, resetData);
        setWeeklyData(resetData); // Reset the state in the UI
      } catch (error) {
        console.error('Error resetting weekly goals:', error);
      }
    }
  };


  // Check and reset weekly goals at the start of each week
  useEffect(() => {
    resetWeeklyGoals();
  }, []);

  if (loading) {
    return <div className="text-gray-900 dark:text-white">Loading...</div>;
  }



  return (
    <div className="bg-white dark:bg-dark-800 p-6 rounded-lg shadow-md transition-colors">
      <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">{tittle}</h2>
      <div className="space-y-4">
        {tittle === "Daily Goals" && (
          <>
            <GoalItem
              label="Calories Burned"
              icon={<Target className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mr-2" />}
              progress={dailyData?.caloriesBurned || 0}
              target={dailyData?.outOfCaloriesBurned || 0}
            />
            <GoalItem
              label="Steps Taken"
              icon={<Footprints className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mr-2" />}
              progress={dailyData?.stepsTaken || 0}
              target={dailyData?.targetSteps || 0}
            />
            <GoalItem
              label="Workout Time"
              icon={<Clock className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mr-2" />}
              progress={dailyData?.spendWorkoutTimeMinutes || 0}
              target={dailyData?.outOfWorkoutTimeMinutes || 0}
            />
          </>
        )}

        {tittle === "Weekly Goals" && (
          <>
            <GoalItem
              label="Calories Burned"
              icon={<Target className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mr-2" />}
              progress={weeklyData?.caloriesBurned || 0}
              target={dailyData?.outOfCaloriesBurned * 7 || 0} // Weekly target = daily * 7
            />
            <GoalItem
              label="Steps Taken"
              icon={<Footprints className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mr-2" />}
              progress={weeklyData?.stepsTaken || 0}
              target={dailyData?.targetSteps * 7 || 0}
            />
            <GoalItem
              label="Workout Time"
              icon={<Clock className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mr-2" />}
              progress={weeklyData?.spendWorkoutTimeMinutes || 0}
              target={dailyData?.outOfWorkoutTimeMinutes * 7 || 0}
            />
          </>
        )}
      </div>
    </div>
  );
}

// Helper component for rendering progress bars
function GoalItem({ label, icon, progress, target }) {
  return (
    <div className="flex items-center">
      {icon}
      <div className="flex-1">
        <div className="flex justify-between text-sm mb-1">
          <span className="font-medium text-gray-700 dark:text-gray-300">{label}</span>
          <span className="text-gray-600 dark:text-gray-400">{progress}/{target}</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-dark-600 rounded-full h-2.5">
          <div
            className="bg-emerald-600 dark:bg-emerald-500 h-2.5 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${(progress / target) * 100}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}