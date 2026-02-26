import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCourseStore } from '../stores/courseStore';
import { useAuthStore } from '../stores/authStore';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { HiCheck, HiLockClosed, HiPlay } from 'react-icons/hi';
import { useConfirm } from '../hooks/useConfirm';

export default function CourseDetailPage() {
    const { slug } = useParams<{ slug: string }>();
    const { currentCourse, lessons, userProgress, isEnrolled, isLoading, fetchCourse, setUserProgress, setIsEnrolled } = useCourseStore();
    const { isAuthenticated, user } = useAuthStore();

    const { confirm, ConfirmDialog } = useConfirm();

    useEffect(() => {
        if (slug) {
            fetchCourse(slug);
        }
    }, [slug]);

    const handleEnroll = async () => {
        if (!currentCourse) return;
        try {
            await api.post(`/courses/${currentCourse.id}/enroll`);
            setIsEnrolled(true);
            toast.success('წარმატებით ჩაირიცხეთ კურსზე!');
            // Refresh course data to get updated userProgress
            if (slug) fetchCourse(slug);
        } catch (err: any) {
            toast.error(err.response?.data?.error || 'შეცდომა');
        }
    };

    const handleUnenroll = async () => {
        if (!currentCourse) return;
        if (!(await confirm('ნამდვილად გსურთ კურსიდან ამოწერა? წაიშლება თქვენი პროგრესიც.'))) return;
        try {
            await api.delete(`/courses/${currentCourse.id}/unenroll`);
            setIsEnrolled(false);
            setUserProgress([]);
            toast.success('წარმატებით ამოეწერეთ კურსიდან.');
        } catch (err: any) {
            toast.error(err.response?.data?.error || 'შეცდომა');
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center py-20">
                <div className="w-10 h-10 border-4 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" />
            </div>
        );
    }

    if (!currentCourse) {
        return (
            <div className="page-container text-center text-dark-400 py-20">
                <div className="text-6xl mb-4 opacity-30">📚</div>
                <p className="text-lg mb-6">კურსი ვერ მოიძებნა.</p>
                <Link to="/courses" className="btn-primary px-6 py-2.5 inline-flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" /></svg>
                    კურსებზე დაბრუნება
                </Link>
            </div>
        );
    }

    const completedCount = userProgress.filter(p => p.status === 'completed').length;
    const progressPercent = lessons.length > 0 ? Math.round((completedCount / lessons.length) * 100) : 0;

    return (
        <div className="page-container animate-fade-in">
            {/* Back Button */}
            <Link to="/courses" className="inline-flex items-center text-dark-400 hover:text-white mb-4 transition-colors text-sm font-medium">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" /></svg>
                კურსებზე დაბრუნება
            </Link>

            {/* Header */}
            <div className="card mb-6 p-6 md:p-7">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-5">
                    <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-2xl" style={{ backgroundColor: `${currentCourse.color || '#6366f1'}15` }}>
                                {currentCourse.icon}
                            </div>
                            <span className="text-xs px-2 py-0.5 rounded-md bg-primary-500/10 text-primary-400 font-medium">Level {currentCourse.level}</span>
                        </div>
                        <h1 className="text-2xl font-bold text-white mb-2">{currentCourse.title}</h1>
                        <p className="text-dark-300 text-sm max-w-2xl leading-relaxed">{currentCourse.description}</p>

                        <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-dark-400">
                            <span>📚 {lessons.length} ლექცია</span>
                            <span>⏱️ {currentCourse.estimated_hours}სთ</span>
                            <span>📊 {currentCourse.difficulty === 'beginner' ? 'დამწყები' : currentCourse.difficulty === 'intermediate' ? 'საშუალო' : 'მოწინავე'}</span>
                            <span>👥 {currentCourse.enrolled_count || 0} ჩარიცხული</span>
                        </div>
                    </div>

                    <div className="flex flex-col items-center space-y-3">
                        {isAuthenticated ? (
                            <>
                                {progressPercent > 0 && (
                                    <div className="text-center mb-2">
                                        <div className="text-2xl font-bold text-white">{progressPercent}%</div>
                                        <div className="text-dark-400 text-sm">დასრულებული</div>
                                        <div className="progress-bar w-32 mt-2">
                                            <div className="progress-fill" style={{ width: `${progressPercent}%` }} />
                                        </div>
                                    </div>
                                )}
                                {isEnrolled ? (
                                    <div className="flex flex-col items-center space-y-2">
                                        <div className="bg-emerald-500/20 text-emerald-400 px-8 py-2.5 rounded-xl font-bold border border-emerald-500/20 w-full text-center">
                                            ✅ ჩარიცხული
                                        </div>
                                        <button
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                handleUnenroll();
                                            }}
                                            className="text-xs text-dark-500 hover:text-red-500 transition-colors px-4 py-1 hover:bg-red-500/5 rounded-lg"
                                        >
                                            კურსიდან ამოწერა
                                        </button>
                                    </div>
                                ) : (
                                    <button onClick={handleEnroll} className="btn-primary px-8">
                                        ჩარიცხვა
                                    </button>
                                )}
                            </>
                        ) : (
                            <Link to="/register" className="btn-primary px-8">
                                დარეგისტრირდი სწავლისთვის
                            </Link>
                        )}
                    </div>
                </div>
            </div>

            {/* ლექციების სია */}
            <div className="flex items-center justify-between mb-8 mt-12">
                <h2 className="text-xl font-bold text-white flex items-center">
                    <span className="w-2 h-8 bg-primary-500 rounded-full mr-3 shadow-lg shadow-primary-500/20" />
                    სასწავლო გზა
                </h2>
                <div className="text-xs text-dark-400 font-medium bg-dark-900/50 px-3 py-1.5 rounded-lg border border-dark-800">
                    {completedCount} / {lessons.length} დასრულებული
                </div>
            </div>

            <div className="relative pl-4 sm:pl-6 space-y-6 pb-20">
                {/* Path Line Connector */}
                {lessons.length > 1 && (
                    <div className="absolute left-[20px] sm:left-[28px] top-4 bottom-4 w-1 bg-gradient-to-b from-primary-500 via-primary-500/20 to-transparent rounded-full z-0 opacity-30 shadow-[0_0_15px_rgba(99,102,241,0.2)]" />
                )}

                {(lessons || []).map((lesson: any, index: number) => {
                    const progress = (userProgress || []).find(p => p.lesson_id === lesson.id);
                    const isCompleted = progress?.status === 'completed';

                    // Locking logic: lesson is locked if it's not the first one AND the previous one is not completed
                    const isPreviousCompleted = index === 0 || userProgress.some(p => p.lesson_id === lessons[index - 1].id && p.status === 'completed');
                    const isLocked = !isCompleted && !isPreviousCompleted && user?.role !== 'admin';
                    const isActive = !isLocked && !isCompleted;

                    const content = (
                        <div className={`relative z-10 card flex items-center justify-between group p-3 sm:p-5 transition-all duration-300
                            ${isLocked ? 'opacity-60 grayscale-[0.5] cursor-not-allowed border-dark-800 bg-dark-900/40' : 'hover:border-primary-500/40 hover:shadow-xl hover:shadow-primary-500/5 cursor-pointer hover:-translate-y-0.5'}
                            ${isCompleted ? 'border-emerald-500/20 bg-emerald-500/5' : ''}
                            ${isActive ? 'border-primary-500/30 bg-primary-500/5 ring-1 ring-primary-500/10' : ''}`}>

                            <div className="flex items-center space-x-3 sm:space-x-4 flex-1 min-w-0">
                                {/* Lesson Number/Status Icon */}
                                <div className={`w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl flex items-center justify-center font-bold text-xs sm:text-sm transition-all duration-300 shadow-sm shrink-0
                                    ${isCompleted ? 'bg-emerald-500 text-white shadow-emerald-500/20' :
                                        isLocked ? 'bg-dark-800 text-dark-600 border border-dark-700' :
                                            'bg-primary-500 text-white shadow-lg shadow-primary-500/30'}`}>
                                    {isCompleted ? <HiCheck className="w-5 h-5 stroke-2" /> : index + 1}

                                    {/* Active Pulse Effect */}
                                    {isActive && (
                                        <div className="absolute w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-primary-500 animate-ping opacity-20" />
                                    )}
                                </div>

                                <div className="min-w-0 pr-2">
                                    <h3 className={`font-bold text-sm sm:text-lg transition-colors leading-tight ${isLocked ? 'text-dark-400' : 'text-white group-hover:text-primary-400'}`}>
                                        {lesson.title}
                                    </h3>
                                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1">
                                        <span className="flex items-center text-[10px] sm:text-xs font-medium text-dark-400">
                                            {lesson.content_type === 'theory' ? (
                                                <><span className="mr-1">📖</span> თეორია</>
                                            ) : lesson.content_type === 'practice' ? (
                                                <><span className="mr-1">💻</span> პრაქტიკა</>
                                            ) : (
                                                <><span className="mr-1">📝</span> ქვიზი</>
                                            )}
                                        </span>
                                        <span className="flex items-center text-[10px] sm:text-xs font-semibold text-amber-400/80">
                                            <span className="mr-1">⚡</span> {lesson.xp_reward} XP
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center shrink-0">
                                {isCompleted && (
                                    <span className="hidden sm:inline-block badge-success py-1 px-3 rounded-lg shadow-sm">
                                        დასრულებული
                                    </span>
                                )}
                                {isLocked ? (
                                    <HiLockClosed className="w-6 h-6 text-dark-700" />
                                ) : !isCompleted ? (
                                    <div className="flex items-center gap-3">
                                        <span className="hidden md:inline-block text-xs font-bold text-primary-400 opacity-0 group-hover:opacity-100 transition-opacity translate-x-2 group-hover:translate-x-0">
                                            {index === 0 ? 'დაწყება' : 'გაგრძელება'}
                                        </span>
                                        <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-primary-500/10 text-primary-400 group-hover:bg-primary-500 group-hover:text-white transition-all transform duration-300">
                                            <HiPlay className="w-6 h-6 ml-0.5" />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-emerald-500/10 text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white transition-colors duration-300">
                                        <HiPlay className="w-6 h-6 ml-0.5" />
                                    </div>
                                )}
                            </div>
                        </div>
                    );

                    if (isLocked || !isAuthenticated) {
                        return (
                            <div key={lesson.id} onClick={() => !isAuthenticated && toast.error('გთხოვთ გაიაროთ ავტორიზაცია')}>
                                {content}
                            </div>
                        );
                    }

                    return (
                        <Link key={lesson.id} to={`/lesson/${slug}/${lesson.slug}`}>
                            {content}
                        </Link>
                    );
                })}
            </div>

            {lessons.length === 0 && (
                <div className="card py-12 text-center">
                    <p className="text-dark-400">ამ კურსში ჯერ არ არის ლექციები.</p>
                </div>
            )}
            <ConfirmDialog />
        </div>
    );
}

