/**
 * Service Provider
 * Automatically selects between Appwrite and localStorage based on configuration
 */

import localStorageService from './localStorageService';

// Check if Appwrite is configured
const isAppwriteConfigured = () => {
    const projectId = import.meta.env.VITE_APPWRITE_PROJECT_ID;
    return projectId && projectId !== 'your_project_id' && projectId.length > 0;
};

// Check if Supabase is configured
const isSupabaseConfigured = () => {
    const url = import.meta.env.VITE_SUPABASE_URL;
    return url && url !== 'your_supabase_url' && url.length > 0;
};

// Check if user is in guest mode
const isGuestMode = () => {
    return localStorage.getItem('fitness_guest_mode') === 'true';
};

// Set guest mode
export const setGuestMode = (enabled) => {
    localStorage.setItem('fitness_guest_mode', enabled ? 'true' : 'false');
};

// Get the current mode
export const getServiceMode = () => {
    if (isGuestMode()) return 'local';
    if (isSupabaseConfigured()) return 'supabase';
    if (isAppwriteConfigured()) return 'appwrite';
    return 'local';
};

// Dynamic service provider
let dataService = localStorageService;
let authService = null;

// Initialize services
export const initializeServices = async () => {
    const mode = getServiceMode();

    if (mode === 'supabase') {
        try {
            const supabaseModule = await import('./supabaseService');
            const authModule = await import('./supabaseAuthService');

            dataService = supabaseModule.default;
            authService = authModule.default;

            console.log('Using Supabase backend');
        } catch (error) {
            console.warn('Failed to load Supabase, falling back to localStorage:', error);
            dataService = localStorageService;
        }
    } else if (mode === 'appwrite') {
        try {
            // Dynamically import Appwrite services only when configured
            const configModule = await import('../Appwrite/config');
            const authModule = await import('../Appwrite/auth');

            dataService = configModule.default;
            authService = authModule.default;

            console.log('Using Appwrite backend');
        } catch (error) {
            console.warn('Failed to load Appwrite, falling back to localStorage:', error);
            dataService = localStorageService;
        }
    } else {
        console.log('Using localStorage (guest mode)');
        dataService = localStorageService;
    }

    return { dataService, authService, mode };
};

// Guest auth service that mimics Appwrite auth API
const guestAuthService = {
    async getCurrentUser() {
        const guest = localStorageService.getGuestUser();
        return guest;
    },

    async login() {
        // In guest mode, just return the guest user
        return localStorageService.getGuestUser();
    },

    async createAccount({ name }) {
        // Create/update guest with name
        const guest = localStorageService.getGuestUser();
        guest.name = name || guest.name;
        localStorage.setItem('fitness_guest_user', JSON.stringify(guest));
        return guest;
    },

    async logout() {
        // Clear guest mode but keep data for next session
        setGuestMode(false);
        console.log('Guest logged out');
    },

    async googleAuth() {
        console.warn('Google Auth not available in guest mode');
        throw new Error('Please configure Appwrite for Google authentication');
    },
};

// Export functions to get current services
export const getDataService = () => dataService;

export const getAuthService = () => {
    const mode = getServiceMode();
    if (mode === 'local' || !authService) {
        return guestAuthService;
    }
    return authService;
};

// Export default for backwards compatibility
export default {
    getDataService,
    getAuthService,
    initializeServices,
    setGuestMode,
    getServiceMode,
    isAppwriteConfigured,
};
