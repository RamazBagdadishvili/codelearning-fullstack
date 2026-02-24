import { create } from 'zustand';
import api from '../api/axios';

interface Course {
    id: string;
    title: string;
    slug: string;
    description: string;
    short_description: string;
    category: string;
    difficulty: string;
    level: number;
    icon: string;
    color: string;
    estimated_hours: number;
    total_lessons: number;
    lesson_count?: number;
    enrolled_count?: number;
}

interface CourseState {
    courses: Course[];
    currentCourse: Course | null;
    lessons: any[];
    userProgress: any[];
    isEnrolled: boolean;
    isLoading: boolean;
    filters: { level?: number; category?: string; difficulty?: string; search?: string };
    fetchCourses: (filters?: any) => Promise<void>;
    fetchCourse: (slug: string) => Promise<void>;
    setFilters: (filters: any) => void;
    setUserProgress: (progress: any[]) => void;
    setIsEnrolled: (enrolled: boolean) => void;
}

export const useCourseStore = create<CourseState>((set) => ({
    courses: [],
    currentCourse: null,
    lessons: [],
    userProgress: [],
    isEnrolled: false,
    isLoading: false,
    filters: {},

    fetchCourses: async (filters = {}) => {
        // BUG-10: Only show loading when there are actual filter params to prevent flicker when clearing search
        const hasFilters = filters.level || filters.category || filters.difficulty || filters.search;
        if (hasFilters) set({ isLoading: true });
        try {
            const params = new URLSearchParams();
            if (filters.level) params.append('level', filters.level);
            if (filters.category) params.append('category', filters.category);
            if (filters.difficulty) params.append('difficulty', filters.difficulty);
            if (filters.search) params.append('search', filters.search);

            const { data } = await api.get(`/courses?${params.toString()}`);
            set({ courses: data.courses, isLoading: false });
        } catch {
            set({ isLoading: false });
        }
    },

    fetchCourse: async (slug: string) => {
        set({ isLoading: true });
        try {
            const { data } = await api.get(`/courses/${slug}`);
            set({
                currentCourse: data.course,
                lessons: data.lessons,
                userProgress: data.userProgress || [],
                isEnrolled: data.isEnrolled || false,
                isLoading: false
            });
        } catch {
            set({ isLoading: false });
        }
    },

    setFilters: (filters) => set({ filters }),
    setUserProgress: (progress) => set({ userProgress: progress }),
    setIsEnrolled: (enrolled) => set({ isEnrolled: enrolled }),
}));

