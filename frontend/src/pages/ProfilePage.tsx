import { useEffect, useState } from 'react';
import { useAuthStore } from '../stores/authStore';
import { HiUser, HiMail, HiCalendar, HiPencil, HiCheck, HiX, HiStar, HiFire, HiTrendingUp, HiBadgeCheck, HiAcademicCap } from 'react-icons/hi';
import api from '../api/axios';
import { useConfirm } from '../hooks/useConfirm';
import toast from 'react-hot-toast';
import { formatXP } from '../utils/formatters';

export default function ProfilePage() {
    const { user, fetchProfile } = useAuthStore();
    const [progress, setProgress] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [editForm, setEditForm] = useState({ fullName: '', bio: '' });
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

    const startEditing = () => {
        setEditForm({
            fullName: user?.fullName || user?.username || '',
            bio: (user as any)?.bio || ''
        });
        setIsEditing(true);
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await api.put('/auth/profile', {
                fullName: editForm.fullName,
                bio: editForm.bio
            });
            await fetchProfile();
            setIsEditing(false);
            toast.success('პროფილი წარმატებით განახლდა!');
        } catch (err: any) {
            toast.error(err.response?.data?.error || 'პროფილის განახლება ვერ მოხერხდა.');
        } finally {
            setIsSaving(false);
        }
    };

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
                        {isEditing ? (
                            <div className="space-y-3">
                                <div>
                                    <label className="block text-dark-400 text-xs font-medium mb-1">სრული სახელი</label>
                                    <input
                                        type="text" value={editForm.fullName}
                                        onChange={e => setEditForm({ ...editForm, fullName: e.target.value })}
                                        className="input-field w-full max-w-xs" placeholder="სრული სახელი"
                                    />
                                </div>
                                <div>
                                    <label className="block text-dark-400 text-xs font-medium mb-1">ბიო (მაქს. 160 სიმბოლო)</label>
                                    <textarea
                                        value={editForm.bio}
                                        onChange={e => setEditForm({ ...editForm, bio: e.target.value.slice(0, 160) })}
                                        className="input-field w-full max-w-md resize-none" rows={2}
                                        placeholder="მოკლედ შენს შესახებ..."
                                        maxLength={160}
                                    />
                                    <span className="text-dark-600 text-xs">{editForm.bio.length}/160</span>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={handleSave} disabled={isSaving}
                                        className="px-4 py-2 bg-primary-600 hover:bg-primary-500 text-white rounded-xl text-sm font-bold transition-all disabled:opacity-50">
                                        {isSaving ? 'ინახება...' : 'შენახვა'}
                                    </button>
                                    <button onClick={() => setIsEditing(false)}
                                        className="px-4 py-2 bg-dark-700 hover:bg-dark-600 text-dark-300 rounded-xl text-sm font-medium transition-all">
                                        გაუქმება
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <>
                                <h1 className="text-2xl font-bold text-white">{user?.fullName || user?.username}</h1>
                                <p className="text-dark-400">@{user?.username}</p>
                                {(user as any)?.bio && <p className="text-dark-300 text-sm mt-1">{(user as any).bio}</p>}
                                <p className="text-dark-500 text-sm mt-1">{user?.email}</p>
                                <div className="mt-3 flex flex-wrap gap-2 items-center">
                                    {user?.role === 'admin' && <span className="badge-warning">👑 ადმინისტრატორი</span>}
                                    {user?.role === 'instructor' && <span className="badge-primary">👨‍🏫 ინსტრუქტორი</span>}
                                    {user?.role === 'student' && <span className="badge bg-dark-800 text-dark-300">🎓 სტუდენტი</span>}
                                    <button onClick={startEditing}
                                        className="ml-2 px-3 py-1.5 bg-dark-700 hover:bg-dark-600 text-primary-400 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5">
                                        <HiPencil className="w-3.5 h-3.5" /> პროფილის რედაქტირება
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* სტატისტიკა */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="card text-center p-6" title={`${user?.xpPoints || 0} XP`}>
                    <HiStar className="w-8 h-8 text-amber-400 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-white">{formatXP(user?.xpPoints || 0)}</div>
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
                        {(() => {
                            const currentLevel = user?.level || 1;
                            const xp = user?.xpPoints || 0;
                            const xpPerLevel = 100 * currentLevel;
                            const currentLevelXpStart = 100 * (currentLevel * (currentLevel - 1)) / 2;
                            const xpIntoLevel = xp - currentLevelXpStart;
                            const progressPct = Math.min(100, Math.max(0, Math.round((xpIntoLevel / xpPerLevel) * 100)));
                            const xpRemaining = Math.max(0, xpPerLevel - xpIntoLevel);
                            return (
                                <>
                                    <div className="flex justify-between text-sm text-dark-400 mb-2">
                                        <span>Level {currentLevel}</span>
                                        <span>Level {currentLevel + 1}</span>
                                    </div>
                                    <div className="progress-bar h-3">
                                        <div className="progress-fill" style={{ width: `${progressPct}%` }} />
                                    </div>
                                    <p className="text-dark-500 text-sm mt-1">
                                        {xpRemaining} XP შემდეგი level-ისთვის
                                    </p>
                                </>
                            );
                        })()}
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
