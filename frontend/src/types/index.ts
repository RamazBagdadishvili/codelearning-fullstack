export type UserRole = 'admin' | 'instructor' | 'student';

export interface User {
    id: string;
    username: string;
    email: string;
    role: UserRole;
    xp: number;
    xp_points?: number;
    level: number;
    avatarUrl?: string;
    isActive: boolean;
    is_active?: boolean;
    createdAt: string;
    created_at?: string;
    full_name?: string;
}

export interface Course {
    _id: string;
    id?: string;
    title: string;
    description: string;
    short_description?: string;
    shortDescription?: string;
    slug: string;
    thumbnailUrl?: string;
    instructorId?: string;
    created_by?: string;
    isPublished: boolean;
    order: number;
    lessonCount?: number;
    averageRating?: number;
    studentCount?: number;
    progress?: number;
    lessons?: Lesson[];
    color?: string;
    icon?: string;
    category?: string;
    difficulty?: 'beginner' | 'intermediate' | 'advanced';
    level?: number;
    estimated_hours?: number;
    estimatedHours?: number;
}

export interface TestCase {
    testName: string;
    testCode: string;
    input?: string;
    expectedOutput?: string;
    isHidden?: boolean;
}

export interface Lesson {
    _id: string;
    id: string;
    courseId: string;
    title: string;
    description: string;
    content: string;
    slug: string;
    type: 'theory' | 'challenge' | 'quiz';
    content_type?: 'theory' | 'challenge' | 'quiz';
    order: number;
    sort_order?: number;
    xpReward: number;
    xp_reward?: number;
    initialCode?: string;
    starter_code?: string;
    solutionCode?: string;
    solution_code?: string;
    testCases?: TestCase[];
    test_cases?: TestCase[] | string;
    challenge_text?: string;
    challengeText?: string;
    hints?: string[] | string;
    theoryContent?: string;
    videoUrl?: string;
    language?: string;
}

export interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
}
