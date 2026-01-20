import React from 'react';
import { Plus, Dumbbell, Activity, RefreshCw, Check, Heart, Weight, RefreshCcw, BicepsFlexed } from 'lucide-react';
import serviceProvider, { getAuthService, getDataService } from '../services/serviceProvider';

export default function ExerciseSuggestions() {

  const [suggestions, setSuggestions] = React.useState(null); // Suggestions state
  const [checkedState, setCheckedState] = React.useState([]); // Checked state for exercises
  const [hasData, setHasData] = React.useState(true); // To track if we have enough data

  const getExercisesByMuscle = async (muscle) => {
    try {
      const response = await fetch(`https://api.api-ninjas.com/v1/exercises?muscle=${muscle}`, {
        method: 'GET',
        headers: {
          'X-Api-Key': `${conf.exerciseApiNinja}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const result = await response.json();

      if (result.length === 0) {
        // If no exercises are returned, set data flag to false
        setHasData(false);
      } else {
        // Shuffle and select 3 random exercises
        const shuffled = result.sort(() => 0.5 - Math.random());
        const randomThreeExercises = shuffled.slice(0, 3);
        setSuggestions(randomThreeExercises);
        setHasData(true); // We have data, so reset the flag
      }

    } catch (error) {
      console.error('Error:', error.message);
      setHasData(false); // Set flag to false on error
    }
  };

  const getData = async (userID) => {
    try {
      const dataService = getDataService();
      const getWorkout = await dataService.getAllWorkoutHistory(userID);
      if (getWorkout && getWorkout.documents.length > 0) {
        // Sort the workout history by Date (most recent first)
        const recentWorkout = getWorkout.documents.reduce((mostRecent, currentWorkout) => {
          return new Date(currentWorkout.Date) > new Date(mostRecent.Date)
            ? currentWorkout
            : mostRecent;
        });

        switch (recentWorkout.Workout.toLowerCase()) {
          case "tricep":
            getExercisesByMuscle("triceps");
            break;
          case "lower back":
          case "back":
            getExercisesByMuscle("lower_back");
            break;
          case "middle back":
            getExercisesByMuscle("middle_back");
            break;
          case "leg":
            getExercisesByMuscle("adductors");
            break;
          case "running":
            getExercisesByMuscle("quadriceps");
            break;
          case "deadlifting":
          case "weightlifting":
            getExercisesByMuscle("hamstrings");
            break;
          default:
            getExercisesByMuscle(recentWorkout.Workout);
            break;
        }


      } else {
        setHasData(false); // No workout data found
        console.log('No workout data found!');
      }
    } catch (error) {
      console.log(error);
      setHasData(false); // Handle error
    }
  };

  // Icon mapping based on exercise type
  const getExerciseIcon = (type) => {
    switch (type) {
      case 'strength':
        return <Dumbbell className="w-6 h-6 text-emerald-600 dark:text-emerald-400 mr-3" />;
      case 'cardio':
        return <RefreshCcw className="w-6 h-6 text-emerald-600 dark:text-emerald-400 mr-3" />;
      case 'stretching':
        return <RefreshCw className="w-6 h-6 text-emerald-600 dark:text-emerald-400 mr-3" />;
      case 'Aerobic':
        return <Heart className="w-6 h-6 text-emerald-600 dark:text-emerald-400 mr-3" />;
      case 'powerlifting':
        return <Weight className="w-6 h-6 text-emerald-600 dark:text-emerald-400 mr-3" />;
      case 'strongman':
        return <BicepsFlexed className="w-6 h-6 text-emerald-600 dark:text-emerald-400 mr-3" />;
      default:
        return <Activity className="w-6 h-6 text-emerald-600 dark:text-emerald-400 mr-3" />;
    }
  };

  // Update checkedState when suggestions are updated
  React.useEffect(() => {
    if (suggestions) {
      setCheckedState(new Array(suggestions.length).fill(false));
    }
  }, [suggestions]);

  // Toggle the specific exercise's checked state
  const handleToggle = (index) => {
    const updatedCheckedState = checkedState.map((item, idx) =>
      idx === index ? !item : item
    );
    setCheckedState(updatedCheckedState);
  };

  React.useEffect(() => {
    const getCurrentUser = async () => {
      const authService = getAuthService();
      const currentUser = await authService.getCurrentUser();
      if (currentUser) {
        getData(currentUser.$id);
      } else {
        console.log("current user not found!");
        setHasData(false); // No current user
      }
    };
    getCurrentUser();
  }, []);

  return (
    <div className="bg-white dark:bg-dark-800 p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Exercise Suggestions</h2>
      {!hasData ? (
        <div className="flex items-center justify-center h-40">
          <p className="text-2xl font-bold text-gray-400 dark:text-gray-500 text-center">Not enough data available.</p>
        </div>
      ) : suggestions ? (
        <div className="space-y-4">
          {suggestions.map((exercise, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center">
                {getExerciseIcon(exercise.type)}
                <div>
                  <p className="font-semibold text-gray-800 dark:text-white">{exercise.name}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{exercise.type}</p>
                </div>
              </div>
              <button
                onClick={() => handleToggle(index)}
                className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 transition-colors duration-200"
              >
                {checkedState[index] ? (
                  <Check className="h-6 w-6 text-green-500" />
                ) : (
                  <Plus className="h-6 w-6" />
                )}
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-600 dark:text-gray-400">Loading exercises...</p>
      )}
    </div>
  );
}
