import React from 'react';
import { Calendar, Clock, Flame } from 'lucide-react';
import { getAuthService, getDataService } from '../services/serviceProvider';
import { Loader } from 'rsuite';

function WorkoutHistory({
  width = '',
  marginTop = '',
  marginLR = '',
  renderHistory = false,

}) {
  const [workouts, setWorkouts] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  // Date formatting function
  const formatDate = (isoString) => {
    const date = new Date(isoString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const getAllworkout = async () => {
    try {
      const authService = getAuthService();
      const dataService = getDataService();
      const currentUser = await authService.getCurrentUser();
      if (currentUser) {
        const listWorkout = await dataService.getAllWorkoutHistory(currentUser.$id);
        if (listWorkout) {
          setWorkouts(listWorkout.documents || []);
        }
      }
    } catch (error) {
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    getAllworkout();


  }, []);

  const firstFiveHistory = workouts.slice(0, 5);
  const renderWorkout = renderHistory ? workouts : firstFiveHistory;

  return (
    <div
      className={`bg-white dark:bg-dark-800 p-6 mt-8 rounded-lg shadow-md overflow-x-auto transition-colors ${width} ${marginTop} ${marginLR}`}
    >
      {loading ? (
        <div className="flex justify-center items-center h-full">
          <Loader size="sm" />
        </div>
      ) : (
        <>
          <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Workout History</h2>
          <table className="w-full min-w-max table-auto border-collapse">
            <thead>
              <tr className="bg-gray-100 dark:bg-dark-700 text-left text-gray-600 dark:text-gray-300 border-b dark:border-dark-600">
                <th className="py-2 px-4 font-semibold">Date</th>
                <th className="py-2 px-4 font-semibold">Workout</th>
                <th className="py-2 px-4 font-semibold">Duration</th>
                <th className="py-2 px-4 font-semibold">Calories</th>
              </tr>
            </thead>
            <tbody>
              {renderWorkout.map((workout) => (
                <tr key={workout.$id} className="border-b dark:border-dark-700 hover:bg-gray-50 dark:hover:bg-dark-700/50 transition-colors">
                  <td className="py-2 px-4">
                    <div className="flex items-center text-gray-700 dark:text-gray-300">
                      <Calendar className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mr-2" />
                      {formatDate(workout.Date)} {/* Format date here */}
                    </div>
                  </td>
                  <td className="py-2 px-4 text-gray-700 dark:text-gray-300">{workout.Workout}</td>
                  <td className="py-2 px-4">
                    <div className="flex items-center text-gray-700 dark:text-gray-300">
                      <Clock className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mr-2" />
                      {workout.Duration}
                    </div>
                  </td>
                  <td className="py-2 px-4">
                    <div className="flex items-center text-gray-700 dark:text-gray-300">
                      <Flame className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mr-2" />
                      {`${workout.CaloriesBurned} kcals`}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}

export default WorkoutHistory;
