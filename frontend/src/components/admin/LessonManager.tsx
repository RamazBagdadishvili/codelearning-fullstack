import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import api from '../../api/axios';
import { Course, Lesson } from '../../types';
import CodeEditor from '../CodeEditor';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { HiEye, HiX, HiCode, HiBeaker } from 'react-icons/hi';

interface LessonManagerProps {
    course: Course;
    onBack: () => void;
    onRefreshCourses: () => void;
}

export const LessonManager: React.FC<LessonManagerProps> = ({ course, onBack, onRefreshCourses }) => {
    const [lessons, setLessons] = useState<any[]>([]);
    const [isCreatingLesson, setIsCreatingLesson] = useState(false);
    const [editingLessonId, setEditingLessonId] = useState<string | null>(null);
    const [draggedLessonIndex, setDraggedLessonIndex] = useState<number | null>(null);
    const [isSavingOrder, setIsSavingOrder] = useState(false);
    const [previewMode, setPreviewMode] = useState<'editor' | 'preview'>('editor');
    const [showFullPreview, setShowFullPreview] = useState(false);
    const [isGenerating, setIsGenerating] = useState({
        full: false,
        content: false,
        challenge: false,
        tests: false
    });

    const initialLessonForm = {
        title: '',
        slug: '',
        content: '',
        contentType: 'theory',
        starterCode: '',
        solutionCode: '',
        challengeText: '',
        testCases: [] as { testName: string, testCode: string }[],
        hints: '',
        language: 'html',
        xpReward: 10,
        sortOrder: lessons.length + 1
    };

    const [lessonForm, setLessonForm] = useState(initialLessonForm);

    useEffect(() => {
        // Sort lessons by sort_order
        const sorted = [...(course.lessons || [])].sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
        setLessons(sorted);
    }, [course]);

    const handleCreateLesson = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/admin/lessons', { ...lessonForm, courseId: course.id || course._id });
            toast.success('ლექცია წარმატებით შეიქმნა!');
            setIsCreatingLesson(false);
            setLessonForm(initialLessonForm);
            onRefreshCourses();
        } catch (err: any) {
            toast.error(err.response?.data?.error || 'შეცდომა');
        }
    };

    const handleUpdateLesson = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingLessonId) return;
        try {
            await api.put(`/admin/lessons/${editingLessonId}`, lessonForm);
            toast.success('ლექცია განახლდა!');
            setEditingLessonId(null);
            setLessonForm(initialLessonForm);
            onRefreshCourses();
        } catch (err: any) {
            toast.error(err.response?.data?.error || 'შეცდომა');
        }
    };

    const handleDeleteLesson = async (id: string, title: string) => {
        if (!window.confirm(`ნამდვილად გსურთ "${title}"-ის წაშლა?`)) return;
        try {
            await api.delete(`/admin/lessons/${id}`);
            toast.success('ლექცია წაიშალა');
            onRefreshCourses();
        } catch (err) {
            toast.error('წაშლა ვერ მოხერხდა');
        }
    };

    const startEditingLesson = async (lesson: any) => {
        try {
            const { data } = await api.get(`/admin/lessons/${lesson.id || lesson._id}`);
            setLessonForm({
                title: data.title,
                slug: data.slug,
                content: data.content,
                contentType: data.content_type || 'theory',
                starterCode: data.starter_code || '',
                solutionCode: data.solution_code || '',
                challengeText: data.challenge_text || '',
                testCases: data.test_cases || [],
                hints: data.hints || '',
                language: data.language || 'html',
                xpReward: data.xp_reward || 10,
                sortOrder: data.sort_order || 0
            });
            setEditingLessonId(data.id || data._id);
            setIsCreatingLesson(false);
        } catch (err) {
            toast.error('ჩატვირთვა ვერ მოხერხდა');
        }
    };

    const handleDragStart = (index: number) => setDraggedLessonIndex(index);
    const handleDragEnter = (targetIndex: number) => {
        if (draggedLessonIndex === null || draggedLessonIndex === targetIndex) return;
        const newList = [...lessons];
        const draggedItem = newList[draggedLessonIndex];
        newList.splice(draggedLessonIndex, 1);
        newList.splice(targetIndex, 0, draggedItem);
        setDraggedLessonIndex(targetIndex);
        setLessons(newList);
    };

    const handleSaveOrder = async () => {
        setIsSavingOrder(true);
        try {
            const lessonOrders = lessons.map((l, idx) => ({ id: l.id || l._id, sortOrder: idx + 1 }));
            await api.put('/admin/lessons/reorder', { lessonOrders });
            toast.success('რიგითობა შენახულია');
            onRefreshCourses();
        } catch (err) {
            toast.error('შენახვა ვერ მოხერხდა');
        } finally {
            setIsSavingOrder(false);
        }
    };

    // AI Generation functions
    const generateFullLesson = async () => {
        if (!lessonForm.title) return toast.error('მიუთითეთ სათაური');
        setIsGenerating({ ...isGenerating, full: true });
        try {
            const { data } = await api.post('/admin/lessons/generate-full', { topic: lessonForm.title, courseTitle: course.title, language: lessonForm.language });
            setLessonForm({ ...lessonForm, ...data });
            toast.success('ლექცია გენერირებულია ✨');
        } catch (err) { toast.error('გენერირება ვერ მოხერხდა'); }
        finally { setIsGenerating({ ...isGenerating, full: false }); }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-dark-800 p-4 rounded-xl border border-dark-700">
                <div className="flex items-center space-x-4">
                    <button onClick={onBack} className="text-dark-400 hover:text-white transition-colors bg-dark-700 p-2 rounded-lg">🔙</button>
                    <div>
                        <h2 className="text-xl font-bold text-white flex items-center space-x-2">
                            <span style={{ color: course.color }}>{course.icon}</span>
                            <span>{course.title}</span>
                        </h2>
                        <p className="text-dark-400 text-sm">ლექციების მართვა ({lessons.length})</p>
                    </div>
                </div>
                {!isCreatingLesson && !editingLessonId && (
                    <button onClick={() => { setIsCreatingLesson(true); setLessonForm(initialLessonForm); }} className="btn-primary py-2 px-4 text-sm">
                        + ახალი ლექცია
                    </button>
                )}
            </div>

            {(isCreatingLesson || editingLessonId) && (
                <div className="card p-6 border border-primary-500/50 shadow-lg mb-6">
                    <form onSubmit={editingLessonId ? handleUpdateLesson : handleCreateLesson} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                            <div>
                                <label className="block text-dark-300 text-sm mb-1">სათაური *</label>
                                <div className="flex gap-2">
                                    <input value={lessonForm.title} onChange={e => {
                                        const val = e.target.value;
                                        setLessonForm({ ...lessonForm, title: val, slug: val.toLowerCase().replace(/[^a-z0-9]+/g, '-') });
                                    }} className="input-field flex-1" required />
                                    <button type="button" onClick={generateFullLesson} disabled={isGenerating.full} className="btn-primary px-3 text-xs">✨ AI</button>
                                </div>
                            </div>
                            <div>
                                <label className="block text-dark-300 text-sm mb-1">Slug *</label>
                                <input value={lessonForm.slug} onChange={e => setLessonForm({ ...lessonForm, slug: e.target.value })} className="input-field" required />
                            </div>
                            <div>
                                <label className="block text-dark-300 text-sm mb-1">XP ჯილდო</label>
                                <input type="number" value={lessonForm.xpReward} onChange={e => setLessonForm({ ...lessonForm, xpReward: parseInt(e.target.value) })} className="input-field" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-dark-300 text-sm mb-1 uppercase font-bold text-[10px] tracking-wider text-primary-400">თეორია (Markdown)</label>
                            <div className="flex bg-dark-900 rounded-lg p-1 w-fit mb-2 border border-dark-700">
                                <button type="button" onClick={() => setPreviewMode('editor')} className={`px-4 py-1 text-xs rounded-md ${previewMode === 'editor' ? 'bg-primary-500 text-white' : 'text-dark-400'}`}>Editor</button>
                                <button type="button" onClick={() => setPreviewMode('preview')} className={`px-4 py-1 text-xs rounded-md ${previewMode === 'preview' ? 'bg-primary-500 text-white' : 'text-dark-400'}`}>Preview</button>
                            </div>
                            {previewMode === 'editor' ? (
                                <textarea value={lessonForm.content} onChange={e => setLessonForm({ ...lessonForm, content: e.target.value })} className="input-field min-h-[300px] font-mono text-sm" />
                            ) : (
                                <div className="bg-dark-900 p-6 rounded-xl border border-dark-700 prose prose-invert max-w-none min-h-[300px]">
                                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{lessonForm.content}</ReactMarkdown>
                                </div>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-dark-700">
                            <div>
                                <label className="block text-amber-500 text-xs font-bold mb-2">STARTER CODE</label>
                                <CodeEditor value={lessonForm.starterCode} onChange={v => setLessonForm({ ...lessonForm, starterCode: v })} language={lessonForm.language} height="200px" />
                            </div>
                            <div>
                                <label className="block text-emerald-500 text-xs font-bold mb-2">SOLUTION CODE</label>
                                <CodeEditor value={lessonForm.solutionCode} onChange={v => setLessonForm({ ...lessonForm, solutionCode: v })} language={lessonForm.language} height="200px" />
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <button type="submit" className="btn-primary flex-1 py-3 font-bold">შენახვა</button>
                            <button type="button" onClick={() => { setIsCreatingLesson(false); setEditingLessonId(null); }} className="px-6 py-3 bg-dark-700 text-white rounded-xl">გაუქმება</button>
                        </div>
                    </form>
                </div>
            )}

            {!isCreatingLesson && !editingLessonId && (
                <div className="space-y-3">
                    {lessons.length > 0 && (
                        <div className="flex justify-end mb-2">
                            <button onClick={handleSaveOrder} disabled={isSavingOrder} className="px-4 py-2 bg-primary-600 hover:bg-primary-500 text-white rounded-lg text-sm transition-all shadow-lg shadow-primary-500/20 font-bold">
                                {isSavingOrder ? '⏳ ინახება...' : '💾 რიგითობის შენახვა'}
                            </button>
                        </div>
                    )}
                    {lessons.map((lesson, idx) => (
                        <div key={lesson.id || lesson._id}
                            draggable
                            onDragStart={() => handleDragStart(idx)}
                            onDragEnter={() => handleDragEnter(idx)}
                            onDragOver={e => e.preventDefault()}
                            className="flex items-center justify-between p-4 bg-dark-800 rounded-xl border border-dark-700 hover:border-primary-500/30 transition-all cursor-move group">
                            <div className="flex items-center space-x-4">
                                <div className="text-dark-500 group-hover:text-primary-400 transition-colors">⋮⋮</div>
                                <div className="w-8 h-8 rounded-full bg-dark-700 flex items-center justify-center text-dark-400 text-xs font-bold">{idx + 1}</div>
                                <div>
                                    <h4 className="text-white font-medium">{lesson.title}</h4>
                                    <p className="text-dark-500 text-[10px] uppercase font-bold tracking-widest">{lesson.content_type}</p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => startEditingLesson(lesson)} className="p-2 bg-dark-700 hover:bg-amber-500/20 text-amber-500 rounded-lg transition-colors">✏️</button>
                                <button onClick={() => handleDeleteLesson(lesson.id || lesson._id, lesson.title)} className="p-2 bg-dark-700 hover:bg-red-500/20 text-red-500 rounded-lg transition-colors">🗑️</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
