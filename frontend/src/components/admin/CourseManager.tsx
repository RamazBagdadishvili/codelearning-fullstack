import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import api from '../../api/axios';
import { Course } from '../../types';

interface CourseManagerProps {
    courses: Course[];
    onRefresh: () => void;
    onSelectCourse: (course: Course) => void;
    isInstructor?: boolean;
}

export const CourseManager: React.FC<CourseManagerProps> = ({ courses, onRefresh, onSelectCourse, isInstructor }) => {
    const [isCreatingCourse, setIsCreatingCourse] = useState(false);
    const [editingCourseId, setEditingCourseId] = useState<string | null>(null);

    const initialCourseForm = {
        title: '',
        description: '',
        shortDescription: '',
        slug: '',
        category: 'HTML',
        level: 1,
        difficulty: 'beginner' as 'beginner' | 'intermediate' | 'advanced',
        color: '#3b82f6',
        icon: '📚',
        estimatedHours: 1
    };

    const [courseForm, setCourseForm] = useState(initialCourseForm);

    const handleCreateCourse = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/admin/courses', courseForm);
            toast.success('კურსი წარმატებით შეიქმნა!');
            setIsCreatingCourse(false);
            setCourseForm(initialCourseForm);
            onRefresh();
        } catch (err: any) {
            toast.error(err.response?.data?.error || 'კურსის შექმნა ვერ მოხერხდა.');
        }
    };

    const handleUpdateCourse = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingCourseId) return;
        try {
            await api.put(`/admin/courses/${editingCourseId}`, courseForm);
            toast.success('კურსი განახლდა!');
            setEditingCourseId(null);
            setCourseForm(initialCourseForm);
            onRefresh();
        } catch (err: any) {
            toast.error(err.response?.data?.error || 'განახლება ვერ მოხერხდა.');
        }
    };

    const handleDeleteCourse = async (id: string, title: string) => {
        if (!window.confirm(`ნამდვილად გსურთ "${title}"-ის წაშლა? წაიშლება ყველა ლექციაც!`)) return;
        try {
            await api.delete(`/admin/courses/${id}`);
            toast.success('კურსი წაიშალა');
            onRefresh();
        } catch (err) {
            toast.error('წაშლა ვერ მოხერხდა');
        }
    };

    const handleCloneCourse = async (id: string) => {
        try {
            const { data } = await api.post(`/admin/courses/${id}/clone`);
            toast.success(data.message);
            onRefresh();
        } catch (err: any) {
            toast.error(err.response?.data?.error || 'დუბლირება ვერ მოხერხდა');
        }
    };

    const startEditingCourse = (course: Course) => {
        setEditingCourseId(course.id || course._id);
        setCourseForm({
            title: course.title,
            description: course.description,
            shortDescription: course.shortDescription || course.short_description || '',
            slug: course.slug,
            category: course.category || 'HTML',
            level: course.level || 1,
            difficulty: course.difficulty || 'beginner',
            color: course.color || '#3b82f6',
            icon: course.icon || '📚',
            estimatedHours: course.estimatedHours || course.estimated_hours || 1
        });
        setIsCreatingCourse(false);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-dark-800 p-4 rounded-xl border border-dark-700">
                <h2 className="text-xl font-bold text-white">არსებული კურსები ({courses.length})</h2>
                <button onClick={() => { setIsCreatingCourse(!isCreatingCourse); setEditingCourseId(null); setCourseForm(initialCourseForm); }} className="btn-primary py-2 px-4 text-sm">
                    {isCreatingCourse ? 'გაუქმება' : '+ ახალი კურსი'}
                </button>
            </div>

            {(isCreatingCourse || editingCourseId) && (
                <div className={`card p-6 border ${editingCourseId ? 'border-amber-500/30' : 'border-primary-500/30'}`}>
                    <h2 className="text-lg font-bold text-white mb-4">{editingCourseId ? '📝 კურსის რედაქტირება' : 'ახალი კურსის შექმნა'}</h2>
                    <form onSubmit={editingCourseId ? handleUpdateCourse : handleCreateCourse} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-dark-300 text-sm mb-1">სათაური</label>
                                <input value={courseForm.title} onChange={e => {
                                    const newTitle = e.target.value;
                                    const autoSlug = newTitle.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-');
                                    setCourseForm(prev => ({
                                        ...prev,
                                        title: newTitle,
                                        slug: prev.slug === '' || prev.slug === newTitle.substring(0, newTitle.length - 1).toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-') ? autoSlug : prev.slug
                                    }));
                                }}
                                    className="input-field" required />
                            </div>
                            <div>
                                <label className="block text-dark-300 text-sm mb-1">ბმულის მისამართი (Slug)</label>
                                <input value={courseForm.slug} onChange={e => setCourseForm({ ...courseForm, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                                    className="input-field" required placeholder="მაგ: html-course" />
                            </div>
                            <div>
                                <label className="block text-dark-300 text-sm mb-1">კატეგორია</label>
                                <select value={courseForm.category} onChange={e => setCourseForm({ ...courseForm, category: e.target.value })}
                                    className="input-field">
                                    {['HTML', 'CSS', 'JavaScript', 'React', 'TypeScript', 'Tools', 'Projects'].map(c => (
                                        <option key={c} value={c}>{c}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-dark-300 text-sm mb-1">Level (1-9)</label>
                                <input type="number" min="1" max="9" value={courseForm.level}
                                    onChange={e => setCourseForm({ ...courseForm, level: parseInt(e.target.value) })}
                                    className="input-field" required />
                            </div>
                            <div>
                                <label className="block text-dark-300 text-sm mb-1">სირთულე</label>
                                <select value={courseForm.difficulty} onChange={e => setCourseForm({ ...courseForm, difficulty: e.target.value as any })}
                                    className="input-field">
                                    <option value="beginner">დამწყები</option>
                                    <option value="intermediate">საშუალო</option>
                                    <option value="advanced">მოწინავე</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-dark-300 text-sm mb-1">სავარაუდო საათები</label>
                                <input type="number" value={courseForm.estimatedHours}
                                    onChange={e => setCourseForm({ ...courseForm, estimatedHours: parseFloat(e.target.value) })}
                                    className="input-field" />
                            </div>
                            <div>
                                <label className="block text-dark-300 text-sm mb-1">Color (Hex)</label>
                                <div className="flex space-x-2">
                                    <input type="color" value={courseForm.color} onChange={e => setCourseForm({ ...courseForm, color: e.target.value })} className="h-10 border-none bg-transparent cursor-pointer" />
                                    <input type="text" value={courseForm.color} onChange={e => setCourseForm({ ...courseForm, color: e.target.value })} className="input-field flex-1" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-dark-300 text-sm mb-1">Icon (Emoji/Text)</label>
                                <input type="text" value={courseForm.icon} onChange={e => setCourseForm({ ...courseForm, icon: e.target.value })} className="input-field" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-dark-300 text-sm mb-1">მოკლე აღწერა</label>
                            <input value={courseForm.shortDescription} onChange={e => setCourseForm({ ...courseForm, shortDescription: e.target.value })}
                                className="input-field" />
                        </div>
                        <div>
                            <label className="block text-dark-300 text-sm mb-1">სრული აღწერა</label>
                            <textarea value={courseForm.description} onChange={e => setCourseForm({ ...courseForm, description: e.target.value })}
                                className="input-field min-h-[80px]" />
                        </div>
                        <div className="flex space-x-3">
                            <button type="submit" className={`flex-1 py-2.5 rounded-xl font-bold text-sm text-white transition-colors ${editingCourseId ? 'bg-amber-600 hover:bg-amber-700' : 'btn-primary'}`}>
                                {editingCourseId ? '💾 განახლება' : 'კურსის შექმნა'}
                            </button>
                            <button type="button" onClick={() => { setIsCreatingCourse(false); setEditingCourseId(null); setCourseForm(initialCourseForm); }}
                                className="px-6 py-2.5 rounded-xl font-bold text-sm bg-dark-700 text-dark-300 hover:text-white transition-colors">
                                გაუქმება
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {courses.map(course => (
                    <div key={course.id || course._id} className="card p-5 border border-dark-700 hover:border-primary-500/50 transition-colors flex flex-col">
                        <div className="flex items-center space-x-3 mb-3">
                            <div className="w-10 h-10 rounded-lg flex items-center justify-center text-xl" style={{ backgroundColor: `${course.color}20`, color: course.color }}>
                                {course.icon}
                            </div>
                            <div>
                                <h3 className="text-white font-bold">{course.title}</h3>
                                <p className="text-dark-400 text-xs">Level {course.level} • {course.category}</p>
                            </div>
                        </div>
                        <div className="text-sm text-dark-300 flex-1 mb-4">
                            {course.lessonCount || course.lessons?.length || 0} ლექცია
                        </div>
                        <div className="flex space-x-2 mt-auto">
                            <button onClick={() => onSelectCourse(course)} className="flex-1 bg-dark-700 hover:bg-dark-600 text-primary-400 py-1.5 rounded-lg text-sm font-medium transition-colors">📋 ლექციები</button>
                            <button onClick={() => handleCloneCourse(course.id || course._id)} className="bg-dark-700 hover:bg-indigo-500/20 text-indigo-400 py-1.5 px-3 rounded-lg text-sm font-medium transition-colors" title="დუბლირება">📑</button>
                            <button onClick={() => startEditingCourse(course)} className="bg-dark-700 hover:bg-amber-500/20 text-amber-400 py-1.5 px-3 rounded-lg text-sm font-medium transition-colors">✏️</button>
                            <button onClick={() => handleDeleteCourse(course.id || course._id, course.title)} className="bg-dark-700 hover:bg-red-500/20 text-red-500 py-1.5 px-3 rounded-lg text-sm transition-colors">🗑️</button>
                        </div>
                    </div>
                ))}
                {courses.length === 0 && (
                    <div className="col-span-full text-center py-10 text-dark-400 bg-dark-800 rounded-xl border border-dark-700 border-dashed">
                        კურსები არ მოიძებნა. დაამატეთ ახალი კურსი.
                    </div>
                )}
            </div>
        </div>
    );
};
