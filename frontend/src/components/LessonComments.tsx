import { useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuthStore } from '../stores/authStore';
import toast from 'react-hot-toast';
import { HiChatAlt2, HiCheckCircle, HiTrash, HiReply, HiDotsVertical } from 'react-icons/hi';
import { formatDistanceToNow } from 'date-fns';
import { ka } from 'date-fns/locale';

interface Comment {
    id: string;
    user_id: string;
    lesson_id: string;
    parent_id: string | null;
    content: string;
    username: string;
    avatar_url: string | null;
    role: string;
    is_best_answer: boolean;
    is_pinned: boolean;
    created_at: string;
    replies: Comment[];
}

export default function LessonComments({ lessonId, courseCreatorId }: { lessonId: string, courseCreatorId?: string }) {
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState('');
    const [replyTo, setReplyTo] = useState<Comment | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const { user } = useAuthStore();

    const fetchComments = async () => {
        try {
            const { data } = await api.get(`/comments/lesson/${lessonId}`);
            setComments(data);
        } catch (err) {
            console.error('Failed to fetch comments');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (lessonId) fetchComments();
    }, [lessonId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        try {
            await api.post('/comments', {
                lessonId,
                content: newComment,
                parentId: replyTo?.id || null
            });
            setNewComment('');
            setReplyTo(null);
            fetchComments();
            toast.success('კომენტარი დაემატა');
        } catch (err) {
            toast.error('კომენტარის დამატება ვერ მოხერხდა');
        }
    };

    const handleMarkBest = async (commentId: string) => {
        try {
            await api.patch(`/comments/${commentId}/best-answer`);
            fetchComments();
            toast.success('მონიშნულია საუკეთესო პასუხად');
        } catch (err) {
            toast.error('მოქმედება ვერ შესრულდა');
        }
    };

    const handleDelete = async (commentId: string) => {
        if (!window.confirm('ნამდვილად გსურთ წაშლა?')) return;
        try {
            await api.delete(`/comments/${commentId}`);
            fetchComments();
            toast.success('კომენტარი წაიშალა');
        } catch (err) {
            toast.error('წაშლა ვერ მოხერხდა');
        }
    };

    const CommentItem = ({ comment, isReply = false }: { comment: Comment, isReply?: boolean }) => {
        const canManage = user?.role === 'admin' || user?.id === courseCreatorId;
        const isOwner = user?.id === comment.user_id;

        return (
            <div className={`group ${isReply ? 'ml-8 mt-3 border-l-2 border-dark-800 pl-4' : 'mb-6 bg-dark-900/30 rounded-2xl p-4 border border-dark-800/50'}`}>
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                        <img
                            src={comment.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${comment.username}`}
                            alt={comment.username}
                            className="w-8 h-8 rounded-full bg-dark-800 border border-dark-700"
                        />
                        <div>
                            <div className="flex items-center gap-2">
                                <span className={`text-sm font-bold ${comment.role === 'admin' ? 'text-accent-400' : 'text-white'}`}>
                                    {comment.username}
                                </span>
                                {comment.role === 'admin' && <span className="text-[10px] px-1.5 py-0.5 bg-accent-500/10 text-accent-400 rounded border border-accent-500/20 font-black uppercase">Admin</span>}
                                {comment.user_id === courseCreatorId && <span className="text-[10px] px-1.5 py-0.5 bg-primary-500/10 text-primary-400 rounded border border-primary-500/20 font-black uppercase">Instructor</span>}
                            </div>
                            <span className="text-[10px] text-dark-500">
                                {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true, locale: ka })}
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {comment.is_best_answer && (
                            <div className="flex items-center gap-1.5 px-2 py-1 bg-emerald-500/10 text-emerald-400 rounded-lg border border-emerald-500/20 text-[10px] font-bold uppercase tracking-wider">
                                <HiCheckCircle className="w-3.5 h-3.5" /> Best Answer
                            </div>
                        )}
                        <div className="opacity-0 group-hover:opacity-100 transition-all flex items-center gap-1">
                            {!isReply && (
                                <button onClick={() => setReplyTo(comment)} title="პასუხი" className="p-1.5 text-dark-400 hover:text-primary-400 transition-colors">
                                    <HiReply className="w-4 h-4" />
                                </button>
                            )}
                            {canManage && !comment.is_best_answer && (
                                <button onClick={() => handleMarkBest(comment.id)} title="საუკეთესო პასუხი" className="p-1.5 text-dark-400 hover:text-emerald-400 transition-colors">
                                    <HiCheckCircle className="w-4 h-4" />
                                </button>
                            )}
                            {(isOwner || user?.role === 'admin') && (
                                <button onClick={() => handleDelete(comment.id)} title="წაშლა" className="p-1.5 text-dark-400 hover:text-red-400 transition-colors">
                                    <HiTrash className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                <p className="mt-3 text-sm text-dark-200 leading-relaxed">
                    {comment.content}
                </p>

                {comment.replies.map(reply => (
                    <CommentItem key={reply.id} comment={reply} isReply />
                ))}
            </div>
        );
    };

    return (
        <div className="mt-12 pt-12 border-t border-dark-800">
            <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl bg-primary-500/10 flex items-center justify-center text-primary-400">
                    <HiChatAlt2 className="w-6 h-6" />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-white">კითხვა-პასუხი</h2>
                    <p className="text-sm text-dark-400">დასვით კითხვა ან დაეხმარეთ სხვებს</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="mb-10">
                {replyTo && (
                    <div className="flex items-center justify-between px-4 py-2 bg-primary-500/5 border-l-4 border-primary-500 rounded-r-xl mb-3">
                        <span className="text-xs text-primary-400">პასუხი {replyTo.username}-ს</span>
                        <button onClick={() => setReplyTo(null)} className="text-dark-500 hover:text-white">✕</button>
                    </div>
                )}
                <div className="relative">
                    <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder={replyTo ? "დაწერეთ პასუხი..." : "დასვით თქვენი კითხვა..."}
                        className="w-full bg-dark-900 border border-dark-700 rounded-2xl p-4 text-sm text-white focus:outline-none focus:border-primary-500 min-h-[100px] resize-none transition-all"
                    />
                    <button
                        type="submit"
                        disabled={!newComment.trim()}
                        className="absolute bottom-3 right-3 btn-primary py-1.5 px-4 text-xs font-bold disabled:opacity-50 disabled:pointer-events-none"
                    >
                        გაგზავნა
                    </button>
                </div>
            </form>

            {isLoading ? (
                <div className="space-y-4">
                    {[1, 2].map(i => <div key={i} className="h-24 bg-dark-900/50 rounded-2xl animate-pulse" />)}
                </div>
            ) : comments.length === 0 ? (
                <div className="text-center py-12 bg-dark-900/20 rounded-3xl border border-dashed border-dark-800">
                    <HiChatAlt2 className="w-12 h-12 mx-auto text-dark-700 mb-3" />
                    <p className="text-dark-500">ჯერ კითხვები არ არის. იყავი პირველი!</p>
                </div>
            ) : (
                <div className="space-y-2">
                    {comments.map(comment => (
                        <CommentItem key={comment.id} comment={comment} />
                    ))}
                </div>
            )}
        </div>
    );
}
