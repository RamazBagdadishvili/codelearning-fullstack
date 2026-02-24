import { create } from 'zustand';
import api from '../api/axios';

interface User {
    id: string;
    email: string;
    username: string;
    fullName: string;
    role: string;
    xpPoints: number;
    level: number;
    streakDays: number;
    avatarUrl?: string;
    stats?: {
        completedLessons: number;
        enrolledCourses: number;
        totalAchievements: number;
        totalSubmissions: number;
    };
}

interface AuthState {
    user: User | null;
    token: string | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, username: string, password: string, fullName?: string) => Promise<void>;
    logout: () => void;
    fetchProfile: () => Promise<void>;
    initialize: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
    user: null,
    token: localStorage.getItem('token'),
    isLoading: false,
    isAuthenticated: !!localStorage.getItem('token'),

    login: async (email, password) => {
        set({ isLoading: true });
        try {
            const { data } = await api.post('/auth/login', { email, password });
            localStorage.setItem('token', data.token);
            set({ user: data.user, token: data.token, isAuthenticated: true, isLoading: false });
        } catch (error: any) {
            set({ isLoading: false });
            throw new Error(error.response?.data?.error || 'შესვლა ვერ მოხერხდა.');
        }
    },

    register: async (email, username, password, fullName) => {
        set({ isLoading: true });
        try {
            const { data } = await api.post('/auth/register', { email, username, password, fullName });
            localStorage.setItem('token', data.token);
            set({ user: data.user, token: data.token, isAuthenticated: true, isLoading: false });
        } catch (error: any) {
            set({ isLoading: false });
            throw new Error(error.response?.data?.error || 'რეგისტრაცია ვერ მოხერხდა.');
        }
    },

    logout: () => {
        localStorage.removeItem('token');
        set({ user: null, token: null, isAuthenticated: false });
    },

    fetchProfile: async () => {
        try {
            const { data } = await api.get('/auth/me');
            set({ user: data.user, isAuthenticated: true });
        } catch {
            localStorage.removeItem('token');
            set({ user: null, token: null, isAuthenticated: false });
        }
    },

    initialize: () => {
        const token = localStorage.getItem('token');
        if (token) {
            get().fetchProfile();
        }
    },
}));
