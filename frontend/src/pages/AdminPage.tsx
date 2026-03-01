import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { Course, User } from '../types';

// Modular Components
import { UserManager } from '../components/admin/UserManager';
import { CourseManager } from '../components/admin/CourseManager';
import { LessonManager } from '../components/admin/LessonManager';
import { AIHelper } from '../components/admin/AIHelper';
import { StatCard } from '../components/admin/StatCard';
import { NotificationsTab } from '../components/admin/NotificationsTab';
import { AchievementsTab } from '../components/admin/AchievementsTab';
import { SubmissionsTab } from '../components/admin/SubmissionsTab';

// Shared Components
import { useConfirm } from '../hooks/useConfirm';

const AdminPage = () => {
    const { user } = useAuthStore();
    const [activeTab, setActiveTab] = useState<'dashboard' | 'courses' | 'users' | 'notifications' | 'achievements' | 'submissions'>('dashboard');
    const [courses, setCourses] = useState<Course[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [stats, setStats] = useState<any>(null);
    const [aiStatus, setAiStatus] = useState<{ status: 'idle' | 'checking' | 'success' | 'error'; message: string }>({ status: 'idle', message: '' });
    const [isLoading, setIsLoading] = useState(true);
    const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
    const { confirm, ConfirmDialog } = useConfirm();

    const fetchData = async () => {
        try {
            setIsLoading(true);
            const [coursesRes, statsRes, usersRes] = await Promise.all([
                api.get('/admin/courses'),
                api.get('/admin/stats'),
                api.get('/admin/users')
            ]);
            setCourses(coursesRes.data);
            setStats(statsRes.data);
            setUsers(usersRes.data);
        } catch (error: any) {
            toast.error('მონაცემების ჩატვირთვა ვერ მოხერხდა');
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleCourseSelect = (course: Course) => {
        setSelectedCourse(course);
    };

    if (isLoading) {
        return (
            <div className="flex justify-center py-20">
                <div className="w-10 h-10 border-4 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in relative">
            {ConfirmDialog}

            {/* Header & Stats */}
            {user?.role === 'admin' && activeTab === 'dashboard' && stats && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    <StatCard label="მომხმარებელი" value={stats.total_users || stats.totalUsers || 0} icon="👥" color="primary" />
                    <StatCard label="კურსი" value={stats.total_courses || stats.totalCourses || 0} icon="📚" color="amber" />
                    <StatCard label="გავლილი ლექცია" value={stats.total_lessons || stats.totalLessonCompletions || 0} icon="✅" color="emerald" />
                    <StatCard label="სულ XP" value={formatXP(stats.total_xp_points || stats.totalXpPoints || 0)} icon="⚡" color="indigo" />
                    <StatCard label="სუბმიშენი" value={stats.total_submissions || stats.totalSubmissions || 0} icon="📝" color="rose" />
                </div>
            )}

            {/* Navigation Tabs */}
            <div className="flex overflow-x-auto pb-2 scrollbar-hide">
                <div className="flex bg-dark-800 p-1.5 rounded-2xl border border-dark-700 w-fit whitespace-nowrap share-shadow mx-auto">
                    {user?.role === 'admin' && (
                        <button onClick={() => setActiveTab('dashboard')} className={`px-5 py-2.5 rounded-xl text-sm font-bold flex items-center space-x-2 transition-all ${activeTab === 'dashboard' ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/30' : 'text-dark-400 hover:text-white'}`}>
                            <span>📊 Dashboard</span>
                        </button>
                    )}
                    <button onClick={() => { setActiveTab('courses'); setSelectedCourse(null); }} className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'courses' ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/30' : 'text-dark-400 hover:text-white'}`}>
                        📚 კურსები
                    </button>
                    {user?.role === 'admin' && (
                        <>
                            <button onClick={() => setActiveTab('users')} className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'users' ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/30' : 'text-dark-400 hover:text-white'}`}>
                                👥 მომხმარებლები
                            </button>
                            <button onClick={() => setActiveTab('notifications')} className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'notifications' ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/30' : 'text-dark-400 hover:text-white'}`}>
                                🔔 შეტყობინებები
                            </button>
                            <button onClick={() => setActiveTab('achievements')} className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'achievements' ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/30' : 'text-dark-400 hover:text-white'}`}>
                                🏆 მიღწევები
                            </button>
                            <button onClick={() => setActiveTab('submissions')} className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'submissions' ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/30' : 'text-dark-400 hover:text-white'}`}>
                                📝 სუბმიშენები
                            </button>
                        </>
                    )}
                </div>
            </div>

            {/* Tab Contents */}
            {activeTab === 'dashboard' && user?.role === 'admin' && (
                <div className="space-y-6">
                    <AIHelper status={aiStatus} onCheck={setAiStatus} />
                </div>
            )}

            {activeTab === 'courses' && (
                !selectedCourse ? (
                    <CourseManager
                        courses={courses}
                        onSelectCourse={handleCourseSelect}
                        onRefresh={fetchData}
                        isInstructor={user?.role === 'instructor'}
                    />
                ) : (
                    <LessonManager
                        course={selectedCourse}
                        onBack={() => setSelectedCourse(null)}
                        onRefreshCourses={fetchData}
                    />
                )
            )}

            {activeTab === 'users' && (
                <UserManager
                    users={users}
                    allCourses={courses}
                    currentUserId={user?.id || null}
                    onRefresh={fetchData}
                />
            )}

            {activeTab === 'notifications' && (
                <NotificationsTab users={users} />
            )}

            {activeTab === 'achievements' && (
                <AchievementsTab />
            )}

            {activeTab === 'submissions' && (
                <SubmissionsTab onRefresh={fetchData} />
            )}
        </div>
    );
};

// Stats Formatter helper
function formatXP(xp: number): string {
    if (xp >= 1000000) return (xp / 1000000).toFixed(1) + 'M';
    if (xp >= 1000) return (xp / 1000).toFixed(1) + 'k';
    return xp.toString();
}

export default AdminPage;
