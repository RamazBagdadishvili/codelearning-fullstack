import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import api from '../../api/axios';
import { User, Course } from '../../types';
import { useConfirm } from '../../hooks/useConfirm';

interface ManageCoursesModalProps {
    user: User;
    allCourses: Course[];
    onClose: () => void;
}

export const ManageCoursesModal: React.FC<ManageCoursesModalProps> = ({ user, allCourses, onClose }) => {
    const [enrollments, setEnrollments] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedCourseId, setSelectedCourseId] = useState('');
    const { confirm, ConfirmDialog } = useConfirm();

    const fetchEnrollments = async () => {
        setIsLoading(true);
        try {
            const res = await api.get(`/admin/users/${user.id}/enrollments`);
            setEnrollments(res.data.enrollments);
        } catch (err) {
            toast.error('ჩარიცხვების ჩატვირთვა ვერ მოხერხდა');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchEnrollments();
    }, [user.id]);

    const handleEnroll = async () => {
        if (!selectedCourseId) return;
        try {
            await api.post(`/admin/users/${user.id}/enroll`, { courseId: selectedCourseId });
            toast.success('კურსი დაემატა');
            setSelectedCourseId('');
            fetchEnrollments();
        } catch (err: any) {
            toast.error(err.response?.data?.error || 'ჩარიცხვა ვერ მოხერხდა');
        }
    };

    const handleUnenroll = async (courseId: string, courseTitle: string) => {
        if (!(await confirm(`ნამდვილად გსურთ "${courseTitle}"-ის წაშლა მომხმარებლისთვის? წაიშლება კურსის პროგრესიც!`))) return;
        try {
            await api.delete(`/admin/users/${user.id}/unenroll/${courseId}`);
            toast.success('კურსი ამოიშალა');
            fetchEnrollments();
        } catch (err: any) {
            toast.error(err.response?.data?.error || 'წაშლა ვერ მოხერხდა');
        }
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-md animate-fade-in p-4">
            <div className="bg-dark-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden border border-dark-600 flex flex-col shadow-2xl shadow-primary-500/10">
                {/* Header */}
                <div className="p-5 border-b border-dark-700 flex justify-between items-center bg-dark-800/50">
                    <div>
                        <h3 className="text-xl font-bold text-white">📚 კურსების მართვა</h3>
                        <p className="text-dark-400 text-sm">{user.username} ({user.email})</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-dark-700 rounded-lg text-dark-400 hover:text-white transition-colors">✕</button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {/* Add New Course */}
                    <div className="bg-dark-900/50 p-4 rounded-xl border border-primary-500/20">
                        <label className="block text-primary-400 text-xs font-bold uppercase tracking-wider mb-3">ახალი კურსის დამატება</label>
                        <div className="flex gap-2">
                            <select
                                value={selectedCourseId}
                                onChange={(e) => setSelectedCourseId(e.target.value)}
                                className="input-field flex-1 text-sm py-2"
                            >
                                <option value="">აირჩიეთ კურსი...</option>
                                {allCourses.filter(c => !enrollments.find(e => e.course_id === c.id)).map(course => (
                                    <option key={course.id} value={course.id}>{course.title} (Level {course.level})</option>
                                ))}
                            </select>
                            <button
                                onClick={handleEnroll}
                                disabled={!selectedCourseId}
                                className="btn-primary px-6 py-2 text-sm disabled:opacity-50 disabled:grayscale"
                            >
                                დამატება
                            </button>
                        </div>
                    </div>

                    {/* Enrolled Courses */}
                    <div className="space-y-3">
                        <label className="block text-dark-400 text-xs font-bold uppercase tracking-wider">არჩეული კურსები ({enrollments.length})</label>
                        {isLoading ? (
                            <div className="text-center py-10"><div className="w-8 h-8 border-2 border-primary-500/30 border-t-primary-500 rounded-full animate-spin mx-auto" /></div>
                        ) : enrollments.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {enrollments.map(en => (
                                    <div key={en.course_id} className="bg-dark-900 p-3 rounded-xl border border-dark-700 flex items-center justify-between group">
                                        <div className="flex items-center space-x-3 overflow-hidden">
                                            <div className="w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center text-lg" style={{ backgroundColor: `${en.color}20`, color: en.color }}>
                                                {en.icon}
                                            </div>
                                            <div className="overflow-hidden">
                                                <div className="text-white text-sm font-bold truncate">{en.title}</div>
                                                <div className="text-dark-500 text-[10px]">{en.enrolled_at ? new Date(en.enrolled_at).toLocaleDateString('ka-GE') : 'N/A'}</div>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleUnenroll(en.course_id, en.title)}
                                            className="p-2 text-dark-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                                            title="კურსიდან ამოშლა"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-10 bg-dark-900/30 border border-dark-800 border-dashed rounded-xl text-dark-500 text-sm">
                                მომხმარებელს არ აქვს არჩეული კურსები.
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-dark-700 bg-dark-800/50 flex justify-end">
                    <button onClick={onClose} className="px-6 py-2 bg-dark-700 hover:bg-dark-600 text-white rounded-xl font-bold text-sm transition-all focus:ring-2 focus:ring-primary-500/50 outline-none">
                        დახურვა
                    </button>
                </div>
            </div>
            {ConfirmDialog}
        </div>
    );
};
