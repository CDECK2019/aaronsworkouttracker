import { supabase } from '../supabase/supabase';

export class SupabaseAuthService {
    async createAccount({ email, password, name }) {
        if (!supabase) return null;
        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: name,
                    },
                },
            });
            if (error) throw error;
            return data.user;
        } catch (error) {
            console.error("Supabase createAccount error::", error);
            throw error;
        }
    }

    async login({ email, password }) {
        if (!supabase) return null;
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });
            if (error) throw error;
            return data.session;
        } catch (error) {
            console.error("Supabase login error::", error);
            throw error;
        }
    }

    async getCurrentUser() {
        if (!supabase) return null;
        try {
            const { data: { user }, error } = await supabase.auth.getUser();
            if (error) throw error;
            return user;
        } catch (error) {
            console.log("Supabase getCurrentUser error::", error);
            return null;
        }
    }

    async logout() {
        if (!supabase) return;
        try {
            const { error } = await supabase.auth.signOut();
            if (error) throw error;
            console.log("User logged out successfully");
        } catch (error) {
            console.error("Supabase logout error::", error);
        }
    }

    async googleAuth() {
        if (!supabase) return;
        try {
            const { data, error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: window.location.origin + '/dashboard',
                },
            });
            if (error) throw error;
            return data;
        } catch (error) {
            console.error("Supabase Google login error::", error);
            throw error;
        }
    }
}

const authService = new SupabaseAuthService();
export default authService;
