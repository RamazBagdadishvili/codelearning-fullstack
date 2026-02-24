import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { useEffect } from 'react';

export default function InstructorRoute({ children }: { children: React.ReactNode }) {
    const { isAuthenticated, user, fetchProfile } = useAuthStore();

    // If authenticated but user data hasn't loaded yet, fetch profile and show loading
    useEffect(() => {
        if (isAuthenticated && !user) {
            fetchProfile();
        }
    }, [isAuthenticated, user]);

    if (!isAuthenticated) return <Navigate to="/login" replace />;

    // Wait for user data to load before checking role
    if (!user) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="w-10 h-10 border-4 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" />
            </div>
        );
    }

    if (user.role !== 'admin' && user.role !== 'instructor') return <Navigate to="/" replace />;
    return <>{children}</>;
}
