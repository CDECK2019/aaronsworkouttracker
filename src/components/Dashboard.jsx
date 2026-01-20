import React from 'react';
import { HolisticOverview } from './index';
import { getDataService, getAuthService, getServiceMode } from '../services/serviceProvider';

import { Link } from 'react-router-dom';
import { Dumbbell, PlayCircle, Utensils } from 'lucide-react';

export default function Dashboard() {
  const [profile, setProfile] = React.useState({
    name: 'Guest User',
    age: 'n/a',
    weight: 'n/a',
    hight: 'n/a',
    fitnessGoals: 'Stay healthy',
  });

  const [loading, setLoading] = React.useState(true);
  const [isGuest, setIsGuest] = React.useState(true);

  const getUserInfo = async () => {
    try {
      const authService = getAuthService();
      const dataService = getDataService();
      const mode = getServiceMode();

      setIsGuest(mode === 'local');

      const userData = await authService.getCurrentUser();

      if (userData) {
        // Try to get existing profile
        const existingProfile = await dataService.getUserInformation(null, userData.$id);

        if (existingProfile && existingProfile !== false) {
          const { name = 'Guest User', age = 'n/a', weight = 'n/a', hight = 'n/a', fitnessGoals = 'Stay healthy' } = existingProfile;
          setProfile({ name, age, weight, hight, fitnessGoals });
        } else if (mode === 'local') {
          // For guest mode, use default profile
          setProfile({
            name: userData.name || 'Guest User',
            age: 'n/a',
            weight: 'n/a',
            hight: 'n/a',
            fitnessGoals: 'Stay healthy',
          });
        }
      }
    } catch (error) {
      console.error('Error fetching user information:', error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    getUserInfo();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-dark-900 text-gray-800 dark:text-gray-100 font-sans transition-colors">
      {/* Main Content */}
      <main className="max-w-10xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row">
          {/* Dashboard Content */}
          <div className="flex-1 space-y-8 mt-8 md:mt-0">

            {loading ? (
              <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
              </div>
            ) : (
              <>
                {/* Guest Mode Banner */}
                {isGuest && (
                  <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl p-4 text-white mb-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold">Welcome to Fitness World! 🎉</h3>
                        <p className="text-sm text-emerald-100">You're in guest mode. Your data is saved locally on this device.</p>
                      </div>
                      <Link
                        to="/login"
                        className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium transition-colors"
                      >
                        Create Account
                      </Link>
                    </div>
                  </div>
                )}

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <Link
                    to="/exercises"
                    className="flex items-center gap-4 p-6 bg-white dark:bg-dark-800 rounded-xl shadow-sm hover:shadow-md transition-shadow group"
                  >
                    <div className="p-3 bg-emerald-100 dark:bg-emerald-900/50 rounded-xl group-hover:bg-emerald-200 dark:group-hover:bg-emerald-800/50 transition-colors">
                      <Dumbbell className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 dark:text-gray-100">Exercise Library</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Browse 50+ exercises with instructions</p>
                    </div>
                  </Link>
                  <Link
                    to="/programs"
                    className="flex items-center gap-4 p-6 bg-white dark:bg-dark-800 rounded-xl shadow-sm hover:shadow-md transition-shadow group"
                  >
                    <div className="p-3 bg-teal-100 dark:bg-teal-900/50 rounded-xl group-hover:bg-teal-200 dark:group-hover:bg-teal-800/50 transition-colors">
                      <PlayCircle className="w-8 h-8 text-teal-600 dark:text-teal-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 dark:text-gray-100">Workout Programs</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Follow structured training plans</p>
                    </div>
                  </Link>
                  <Link
                    to="/nutrition"
                    className="flex items-center gap-4 p-6 bg-white dark:bg-dark-800 rounded-xl shadow-sm hover:shadow-md transition-shadow group"
                  >
                    <div className="p-3 bg-orange-100 dark:bg-orange-900/50 rounded-xl group-hover:bg-orange-200 dark:group-hover:bg-orange-800/50 transition-colors">
                      <Utensils className="w-8 h-8 text-orange-600 dark:text-orange-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 dark:text-gray-100">Nutrition Tracker</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Log meals and track macros</p>
                    </div>
                  </Link>
                </div>


                <HolisticOverview />



                {/* <ExerciseSuggestions /> Removed as per redesign */}
                {/* </div> */}
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
