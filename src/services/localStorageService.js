/**
 * Local Storage Service
 * Drop-in replacement for Appwrite services that uses localStorage
 * Mirrors the same API as config.js for seamless switching
 */

const STORAGE_KEYS = {
  USER_PROFILE: 'fitness_user_profile',
  WORKOUTS: 'fitness_workouts',
  DAILY_GOALS: 'fitness_daily_goals',
  WEEKLY_GOALS: 'fitness_weekly_goals',
  WEIGHT_PROGRESS: 'fitness_weight_progress',
  GUEST_USER: 'fitness_guest_user',
  CUSTOM_PROGRAMS: 'fitness_custom_programs',
  CUSTOM_MEAL_PLANS: 'fitness_custom_meal_plans',
  DAILY_NUTRITION: 'fitness_daily_nutrition',
};

// Helper to generate unique IDs
const generateId = () => `local_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

// Helper to get/set localStorage with JSON parsing
const getStorage = (key) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('LocalStorage read error:', error);
    return null;
  }
};

const setStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error('LocalStorage write error:', error);
    return false;
  }
};

class LocalStorageService {
  // ==================== USER PROFILE ====================

  async createUserProfile({ name, age, weight, hight, fitnessGoals, docId }) {
    const profile = {
      $id: docId || generateId(),
      name,
      age,
      weight,
      hight,
      fitnessGoals,
      $createdAt: new Date().toISOString(),
      $updatedAt: new Date().toISOString(),
    };

    setStorage(STORAGE_KEYS.USER_PROFILE, profile);
    return profile;
  }

  async updateUserProfile(docId, { name, age, weight, hight, fitnessGoals }) {
    const existing = getStorage(STORAGE_KEYS.USER_PROFILE) || {};
    const updated = {
      ...existing,
      name: name ?? existing.name,
      age: age ?? existing.age,
      weight: weight ?? existing.weight,
      hight: hight ?? existing.hight,
      fitnessGoals: fitnessGoals ?? existing.fitnessGoals,
      $updatedAt: new Date().toISOString(),
    };

    setStorage(STORAGE_KEYS.USER_PROFILE, updated);
    return updated;
  }

  async getUserInformation(collectionId, docId) {
    // For local storage, we ignore collectionId and just return profile
    const profile = getStorage(STORAGE_KEYS.USER_PROFILE);
    if (!profile) {
      return false;
    }
    return profile;
  }

  // ==================== WORKOUTS ====================

  async addWorkout(userId, { date, workout, duration, calories }) {
    const workouts = getStorage(STORAGE_KEYS.WORKOUTS) || [];

    const newWorkout = {
      $id: generateId(),
      Date: date,
      Workout: workout,
      Duration: duration,
      CaloriesBurned: calories,
      userId,
      $createdAt: new Date().toISOString(),
    };

    workouts.push(newWorkout);
    setStorage(STORAGE_KEYS.WORKOUTS, workouts);
    return newWorkout;
  }

  async getAllWorkoutHistory(userId) {
    const workouts = getStorage(STORAGE_KEYS.WORKOUTS) || [];
    // Filter by userId if provided, otherwise return all
    const filtered = userId
      ? workouts.filter(w => w.userId === userId)
      : workouts;

    return {
      documents: filtered,
      total: filtered.length,
    };
  }

  // ==================== DAILY GOALS ====================

  async DailyGoals(docId, {
    caloriesBurned,
    outOfCaloriesBurned,
    stepsTaken,
    targetSteps,
    SpendWorkoutTime,
    outOfWorkoutTime,
  }) {
    const goals = {
      $id: docId || generateId(),
      caloriesBurned,
      outOfCaloriesBurned,
      stepsTaken,
      targetSteps,
      spendWorkoutTimeMinutes: SpendWorkoutTime,
      outOfWorkoutTimeMinutes: outOfWorkoutTime,
      $createdAt: new Date().toISOString(),
      $updatedAt: new Date().toISOString(),
    };

    setStorage(STORAGE_KEYS.DAILY_GOALS, goals);
    return goals;
  }

  async updateGoals(docId, {
    caloriesBurned,
    outOfCaloriesBurned,
    stepsTaken,
    targetSteps,
    SpendWorkoutTime,
    outOfWorkoutTime,
  }) {
    const existing = getStorage(STORAGE_KEYS.DAILY_GOALS) || {};
    const updated = {
      ...existing,
      caloriesBurned: caloriesBurned ?? existing.caloriesBurned,
      outOfCaloriesBurned: outOfCaloriesBurned ?? existing.outOfCaloriesBurned,
      stepsTaken: stepsTaken ?? existing.stepsTaken,
      targetSteps: targetSteps ?? existing.targetSteps,
      spendWorkoutTimeMinutes: SpendWorkoutTime ?? existing.spendWorkoutTimeMinutes,
      outOfWorkoutTimeMinutes: outOfWorkoutTime ?? existing.outOfWorkoutTimeMinutes,
      $updatedAt: new Date().toISOString(),
    };

    setStorage(STORAGE_KEYS.DAILY_GOALS, updated);
    return updated;
  }

  // ==================== WEEKLY GOALS ====================

  async weeklyGoals(docId, {
    caloriesBurned,
    outOfCaloriesBurned,
    stepsTaken,
    targetSteps,
    spendWorkoutTimeMinutes,
    outOfWorkoutTimeMinutes,
  }) {
    const goals = {
      $id: docId || generateId(),
      caloriesBurned,
      outOfCaloriesBurned,
      stepsTaken,
      targetSteps,
      spendWorkoutTimeMinutes,
      outOfWorkoutTimeMinutes,
      $createdAt: new Date().toISOString(),
      $updatedAt: new Date().toISOString(),
    };

    setStorage(STORAGE_KEYS.WEEKLY_GOALS, goals);
    return goals;
  }

  async updateWeeklyGoals(docId, {
    caloriesBurned,
    stepsTaken,
    spendWorkoutTimeMinutes,
  }) {
    const existing = getStorage(STORAGE_KEYS.WEEKLY_GOALS) || {};
    const updated = {
      ...existing,
      caloriesBurned: caloriesBurned ?? existing.caloriesBurned,
      stepsTaken: stepsTaken ?? existing.stepsTaken,
      spendWorkoutTimeMinutes: spendWorkoutTimeMinutes ?? existing.spendWorkoutTimeMinutes,
      $updatedAt: new Date().toISOString(),
    };

    setStorage(STORAGE_KEYS.WEEKLY_GOALS, updated);
    return updated;
  }

  // ==================== WEIGHT PROGRESS ====================

  async addWeight(weight, userId) {
    const weights = getStorage(STORAGE_KEYS.WEIGHT_PROGRESS) || [];

    const newWeight = {
      $id: generateId(),
      weight,
      userId,
      $createdAt: new Date().toISOString(),
    };

    weights.push(newWeight);
    setStorage(STORAGE_KEYS.WEIGHT_PROGRESS, weights);
    return newWeight;
  }

  async getAllWeights(userId) {
    const weights = getStorage(STORAGE_KEYS.WEIGHT_PROGRESS) || [];
    const filtered = userId
      ? weights.filter(w => w.userId === userId)
      : weights;

    return {
      documents: filtered,
      total: filtered.length,
    };
  }

  // ==================== GUEST USER ====================

  getGuestUser() {
    let guest = getStorage(STORAGE_KEYS.GUEST_USER);
    if (!guest) {
      guest = {
        $id: generateId(),
        name: 'Guest User',
        email: 'guest@local',
        isGuest: true,
        $createdAt: new Date().toISOString(),
      };
      setStorage(STORAGE_KEYS.GUEST_USER, guest);
    }
    return guest;
  }

  clearAllData() {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  }

  // ==================== CUSTOM PROGRAMS ====================

  async saveCustomProgram(program) {
    const programs = getStorage(STORAGE_KEYS.CUSTOM_PROGRAMS) || [];
    const existingIndex = programs.findIndex(p => p.id === program.id);

    const savedProgram = {
      ...program,
      $id: program.id,
      $createdAt: program.$createdAt || new Date().toISOString(),
      $updatedAt: new Date().toISOString(),
    };

    if (existingIndex >= 0) {
      programs[existingIndex] = savedProgram;
    } else {
      programs.push(savedProgram);
    }

    setStorage(STORAGE_KEYS.CUSTOM_PROGRAMS, programs);
    return savedProgram;
  }

  async getCustomPrograms() {
    return getStorage(STORAGE_KEYS.CUSTOM_PROGRAMS) || [];
  }

  async getCustomProgramById(id) {
    const programs = getStorage(STORAGE_KEYS.CUSTOM_PROGRAMS) || [];
    return programs.find(p => p.id === id) || null;
  }

  async deleteCustomProgram(id) {
    const programs = getStorage(STORAGE_KEYS.CUSTOM_PROGRAMS) || [];
    const filtered = programs.filter(p => p.id !== id);
    setStorage(STORAGE_KEYS.CUSTOM_PROGRAMS, filtered);
    return true;
  }

  // ==================== MEAL PLANS ====================

  async saveMealPlan(plan) {
    const plans = getStorage(STORAGE_KEYS.CUSTOM_MEAL_PLANS) || [];
    const existingIndex = plans.findIndex(p => p.id === plan.id);
    const savedPlan = {
      ...plan,
      $id: plan.id,
      $updatedAt: new Date().toISOString(),
      $createdAt: plan.$createdAt || new Date().toISOString(),
    };

    if (existingIndex >= 0) {
      plans[existingIndex] = savedPlan;
    } else {
      plans.push(savedPlan);
    }

    setStorage(STORAGE_KEYS.CUSTOM_MEAL_PLANS, plans);
    return savedPlan;
  }

  async getMealPlans() {
    return getStorage(STORAGE_KEYS.CUSTOM_MEAL_PLANS) || [];
  }

  async deleteMealPlan(id) {
    const plans = getStorage(STORAGE_KEYS.CUSTOM_MEAL_PLANS) || [];
    const filtered = plans.filter(p => p.id !== id);
    setStorage(STORAGE_KEYS.CUSTOM_MEAL_PLANS, filtered);
    return true;
  }

  // ==================== NUTRITION LOGS ====================

  async saveNutritionLog(date, log) {
    const logs = getStorage(STORAGE_KEYS.DAILY_NUTRITION) || [];
    const index = logs.findIndex(l => l.date === date);

    if (index >= 0) {
      logs[index] = { ...logs[index], ...log, $updatedAt: new Date().toISOString() };
    } else {
      logs.push({
        $id: generateId(),
        date,
        ...log,
        $createdAt: new Date().toISOString()
      });
    }

    setStorage(STORAGE_KEYS.DAILY_NUTRITION, logs);
    return logs.find(l => l.date === date);
  }

  async getNutritionLog(date) {
    const logs = getStorage(STORAGE_KEYS.DAILY_NUTRITION) || [];
    return logs.find(l => l.date === date) || null;
  }
}

const localStorageService = new LocalStorageService();
export default localStorageService;
export { STORAGE_KEYS };
