import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import api from '../../api/axios';
import { useConfirm } from '../../hooks/useConfirm';
import CodeEditor from '../CodeEditor';

interface SubmissionsTabProps {
    onRefresh: () => void;
}

export const SubmissionsTab: React.FC<SubmissionsTabProps> = ({ onRefresh }) => {
    const [submissions, setSubmissions] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [viewingSubmission, setViewingSubmission] = useState<any>(null);
    const { confirm, ConfirmDialog } = useConfirm();

    const fetchSubs = async () => {
        setIsLoading(true);
        try {
            const res = await api.get(`/admin/submissions?status=${filter}&limit=50`);
            setSubmissions(res.data.submissions);
        } catch (err) { toast.error('ვერ ჩაიტვირთა სუბმიშენები'); }
        finally { setIsLoading(false); }
    };

    useEffect(() => {
        fetchSubs();
    }, [filter]);

    if (isLoading) return <div className="text-center py-10 text-dark-400">იტვირთება...</div>;

    const handleClear = async () => {
        if (!(await confirm('ნამდვილად გსურთ ყველა სუბმიშენის გასუფთავება? ეს მოქმედება შეუქცევადია!'))) return;
        try {
            const res = await api.delete('/admin/submissions/clear');
            toast.success(res.data.message);
            setSubmissions([]);
            onRefresh();
        } catch (err: any) { toast.error('გასუფთავება ვერ მოხერხდა'); }
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center mb-4">
                <div className="flex space-x-2">
                    <button onClick={() => setFilter('all')} className={`px-4 py-1.5 rounded-lg text-sm ${filter === 'all' ? 'bg-primary-600 text-white' : 'bg-dark-800 text-dark-400'}`}>ყველა</button>
                    <button onClick={() => setFilter('passed')} className={`px-4 py-1.5 rounded-lg text-sm ${filter === 'passed' ? 'bg-green-600/20 text-green-400 border border-green-500/50' : 'bg-dark-800 text-dark-400'}`}>გავლილი</button>
                    <button onClick={() => setFilter('failed')} className={`px-4 py-1.5 rounded-lg text-sm ${filter === 'failed' ? 'bg-red-600/20 text-red-400 border border-red-500/50' : 'bg-dark-800 text-dark-400'}`}>ჩაჭრილი</button>
                </div>
                <button onClick={handleClear} className="px-4 py-1.5 rounded-lg text-sm bg-red-600/10 text-red-500 border border-red-500/30 hover:bg-red-600 hover:text-white transition-all">🗑️ გასუფთავება</button>
            </div>

            <div className="bg-dark-800 rounded-xl border border-dark-700 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-dark-300">
                        <thead className="bg-dark-900 text-dark-400 uppercase text-xs">
                            <tr>
                                <th className="px-4 py-3">თარიღი</th>
                                <th className="px-4 py-3">მომხმარებელი</th>
                                <th className="px-4 py-3">ლექცია / კურსი</th>
                                <th className="px-4 py-3">სტატუსი</th>
                                <th className="px-4 py-3 text-right">კოდი</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-dark-700">
                            {submissions.map(sub => (
                                <tr key={sub.id} className="hover:bg-dark-700/50">
                                    <td className="px-4 py-3">{new Date(sub.created_at).toLocaleString('ka-GE')}</td>
                                    <td className="px-4 py-3">
                                        <div className="font-medium text-white">{sub.username}</div>
                                        <div className="text-xs">{sub.email}</div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="text-white">{sub.lesson_title}</div>
                                        <div className="text-xs">{sub.course_title}</div>
                                    </td>
                                    <td className="px-4 py-3">
                                        {sub.passed ?
                                            <span className="bg-green-500/20 text-green-400 px-2 py-0.5 rounded text-xs">Passed (+{sub.score})</span> :
                                            <span className="bg-red-500/20 text-red-500 px-2 py-0.5 rounded text-xs">Failed</span>}
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <button onClick={() => setViewingSubmission(sub)} className="text-primary-400 hover:text-white transition-colors text-xs py-1.5 px-3 bg-primary-500/10 hover:bg-primary-500 rounded-lg border border-primary-500/20">ნახვა</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {viewingSubmission && (
                <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/80 backdrop-blur-md animate-fade-in p-4">
                    <div className="bg-dark-800 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden border border-dark-600 flex flex-col shadow-2xl">
                        <div className="p-5 border-b border-dark-700 flex justify-between items-center">
                            <div>
                                <h3 className="text-lg font-bold text-white">💻 კოდის ნახვა</h3>
                                <p className="text-dark-400 text-xs">{viewingSubmission.username} - {viewingSubmission.lesson_title}</p>
                            </div>
                            <button onClick={() => setViewingSubmission(null)} className="p-2 hover:bg-dark-700 rounded-lg text-dark-400 hover:text-white transition-colors">✕</button>
                        </div>
                        <div className="flex-1 overflow-hidden p-6 bg-dark-950">
                            <CodeEditor value={viewingSubmission.code} onChange={() => { }} language={viewingSubmission.language || 'html'} readOnly={true} height="100%" />
                        </div>
                        <div className="p-4 border-t border-dark-700 flex justify-end">
                            <button onClick={() => setViewingSubmission(null)} className="btn-primary px-6 py-2 text-sm">დახურვა</button>
                        </div>
                    </div>
                </div>
            )}
            {ConfirmDialog}
        </div>
    );
};
