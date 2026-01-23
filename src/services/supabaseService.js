import { supabase } from '../supabase/supabase';

export class SupabaseService {
    // ==================== USER PROFILE ====================
    async createUserProfile({ name, age, weight, hight, fitnessGoals, docId }) {
        if (!supabase) return null;
        try {
            const { data, error } = await supabase
                .from('profiles')
                .upsert({
                    id: docId || undefined,
                    name,
                    age,
                    weight,
                    height: hight, // mapping from 'hight' to 'height'
                    fitness_goals: fitnessGoals,
                    updated_at: new Date().toISOString(),
                })
                .select()
                .single();

            if (error) throw error;
            return data;
        } catch (error) {
            console.error("Supabase createUserProfile error:", error);
            throw error;
        }
    }

    async updateUserProfile(docId, updates) {
        if (!supabase) return null;
        try {
            const { data, error } = await supabase
                .from('profiles')
                .update({
                    ...updates,
                    updated_at: new Date().toISOString(),
                })
                .eq('id', docId)
                .select()
                .single();

            if (error) throw error;
            return data;
        } catch (error) {
            console.error("Supabase updateUserProfile error:", error);
            throw error;
        }
    }

    async getUserInformation(collectionId, docId) {
        if (!supabase) return null;
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', docId)
                .single();

            if (error) return null;
            return data;
        } catch (error) {
            console.error("Supabase getUserInformation error:", error);
            return null;
        }
    }

    // ==================== WORKOUTS ====================
    async addWorkout(userId, { date, workout, duration, calories }) {
        if (!supabase) return null;
        try {
            const { data, error } = await supabase
                .from('workout_logs')
                .insert({
                    user_id: userId,
                    date,
                    name: workout,
                    duration,
                    calories_burn: calories,
                })
                .select()
                .single();

            if (error) throw error;
            return data;
        } catch (error) {
            console.error("Supabase addWorkout error:", error);
            throw error;
        }
    }

    async getAllWorkoutHistory(userId) {
        if (!supabase) return { documents: [], total: 0 };
        try {
            const { data, error, count } = await supabase
                .from('workout_logs')
                .select('*', { count: 'exact' })
                .eq('user_id', userId)
                .order('date', { ascending: false });

            if (error) throw error;
            return {
                documents: data,
                total: count,
            };
        } catch (error) {
            console.error("Supabase getAllWorkoutHistory error:", error);
            return { documents: [], total: 0 };
        }
    }

    // Note: Other methods (DailyGoals, weeklyGoals, addWeight, etc.) 
    // should be implemented mirroring the structure above.
    // For now, these core methods provide the foundation.
}

const supabaseService = new SupabaseService();
export default supabaseService;
