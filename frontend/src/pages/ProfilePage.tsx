import { useEffect, useState } from 'react';
import { useAuthStore } from '../stores/authStore';
import api from '../api/axios';
import { HiAcademicCap, HiCode, HiFire, HiStar, HiTrendingUp } from 'react-icons/hi';
import { useConfirm } from '../hooks/useConfirm';

export default function ProfilePage() {
    const { user, fetchProfile } = useAuthStore();
    const [progress, setProgress] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const { confirm, ConfirmDialog } = useConfirm();

    useEffect(() => {
        const load = async () => {
            await fetchProfile();
            try {
                const { data } = await api.get('/progress');
                setProgress(data);
            } catch { }
            setIsLoading(false);
        };
        load();
    }, []);

    if (isLoading) {
        return (
            <div className="flex justify-center py-20">
                <div className="w-10 h-10 border-4 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="page-container animate-fade-in">
            {/* პროფილის Header */}
            <div className="card p-8 mb-8">
                <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                    <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-4xl font-bold text-white">
                        {user?.username?.charAt(0).toUpperCase()}
                    </div>
                    <div className="text-center md:text-left flex-1">
                        <h1 className="text-2xl font-bold text-white">{user?.fullName || user?.username}</h1>
                        <p className="text-dark-400">@{user?.username}</p>
                        <p className="text-dark-500 text-sm mt-1">{user?.email}</p>
                        <div className="mt-3 flex flex-wrap gap-2">
                            {user?.role === 'admin' && <span className="badge-warning">👑 ადმინისტრატორი</span>}
                            {user?.role === 'instructor' && <span className="badge-primary">👨‍🏫 ინსტრუქტორი</span>}
                            {user?.role === 'student' && <span className="badge bg-dark-800 text-dark-300">🎓 სტუდენტი</span>}
                        </div>
                    </div>
                </div>
            </div>

            {/* სტატისტიკა */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="card text-center p-6">
                    <HiStar className="w-8 h-8 text-amber-400 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-white">{user?.xpPoints || 0}</div>
                    <div className="text-dark-400 text-sm">XP ქულა</div>
                </div>
                <div className="card text-center p-6">
                    <HiTrendingUp className="w-8 h-8 text-primary-400 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-white">Lv.{user?.level || 1}</div>
                    <div className="text-dark-400 text-sm">დონე</div>
                </div>
                <div className="card text-center p-6">
                    <HiFire className="w-8 h-8 text-orange-400 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-white">{user?.streakDays || 0}</div>
                    <div className="text-dark-400 text-sm">დღიანი სტრიქი</div>
                </div>
                <div className="card text-center p-6">
                    <HiAcademicCap className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-white">{user?.stats?.completedLessons || 0}</div>
                    <div className="text-dark-400 text-sm">დასრულებული ლექცია</div>
                </div>
            </div>

            {/* Level პროგრესი */}
            <div className="card p-6 mb-8">
                <h2 className="text-lg font-bold text-white mb-4">Level პროგრესი</h2>
                <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-2xl font-bold text-white">
                        {user?.level || 1}
                    </div>
                    <div className="flex-1">
                        <div className="flex justify-between text-sm text-dark-400 mb-2">
                            <span>Level {user?.level}</span>
                            <span>Level {(user?.level || 1) + 1}</span>
                        </div>
                        <div className="progress-bar h-3">
                            <div className="progress-fill" style={{ width: `${((user?.xpPoints || 0) % 100)}%` }} />
                        </div>
                        <p className="text-dark-500 text-sm mt-1">
                            {100 - ((user?.xpPoints || 0) % 100)} XP შემდეგი level-ისთვის
                        </p>
                    </div>
                </div>
            </div>

            {/* აქტიური კურსები */}
            {progress?.courses && progress.courses.length > 0 && (
                <div>
                    <h2 className="text-lg font-bold text-white mb-4">ჩემი კურსები</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {progress.courses.map((course: any) => (
                            <div key={course.id} className="card p-5 relative group">
                                <button
                                    onClick={async () => {
                                        if (!(await confirm(`ნამდვილად გსურთ კურსის "${course.title}" ამოშლა?`))) return;
                                        try {
                                            await api.delete(`/courses/${course.id}/unenroll`);
                                            // Refresh progress
                                            const { data } = await api.get('/progress');
                                            setProgress(data);
                                        } catch (err: any) {
                                            // Optional: toast error
                                        }
                                    }}
                                    className="absolute top-4 right-4 p-2 text-dark-500 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                                    title="კურსის ამოშლა"
                                >
                                    🗑️
                                </button>
                                <div className="flex items-center space-x-3 mb-3">
                                    <span className="text-2xl">{course.icon}</span>
                                    <div>
                                        <h3 className="text-white font-semibold">{course.title}</h3>
                                        <p className="text-dark-500 text-sm">Level {course.level}</p>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between text-sm text-dark-400 mb-2">
                                    <span>{course.completed_lessons}/{course.total_lessons} ლექცია</span>
                                    <span>{Math.round(course.progress_percentage || (course.total_lessons > 0 ? (course.completed_lessons / course.total_lessons) * 100 : 0))}%</span>
                                </div>
                                <div className="progress-bar h-2">
                                    <div className="progress-fill" style={{ width: `${course.progress_percentage || (course.total_lessons > 0 ? (course.completed_lessons / course.total_lessons) * 100 : 0)}%` }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            <ConfirmDialog />
        </div>
    );
}
