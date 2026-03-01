import React from 'react';
import { HiBeaker } from 'react-icons/hi';
import { toast } from 'react-hot-toast';
import api from '../../api/axios';

interface AIHelperProps {
    status: {
        status: 'idle' | 'checking' | 'success' | 'error';
        message?: string;
    };
    onCheck: (status: any) => void;
}

export const AIHelper: React.FC<AIHelperProps> = ({ status, onCheck }) => {
    const checkAIStatus = async () => {
        onCheck({ status: 'checking' });
        try {
            const res = await api.post('/admin/lessons/generate-content', {
                title: "Explain how AI works in a few words",
                courseTitle: "AI Connection Test"
            });
            if (res.data.content) {
                onCheck({ status: 'success', message: res.data.content });
                toast.success('AI კავშირი წარმატებულია! ✨');
            }
        } catch (error: any) {
            const errorMsg = error.response?.data?.error || 'კავშირი ვერ დამყარდა. გადაამოწმეთ API Key.';
            onCheck({ status: 'error', message: errorMsg });
            toast.error('AI პრობლემა: ' + errorMsg);
        }
    };

    return (
        <div className="card border-primary-500/20 bg-primary-500/5 hover:border-primary-500/40 transition-all">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-lg ${status.status === 'success' ? 'bg-green-500 shadow-green-500/20' :
                        status.status === 'error' ? 'bg-red-500 shadow-red-500/20' :
                            'bg-primary-500 shadow-primary-500/20'
                        }`}>
                        <HiBeaker className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-white leading-tight">AI ასისტენტის დიაგნოსტიკა</h3>
                        <p className="text-sm text-dark-300 mt-0.5">
                            {status.status === 'idle' && 'შეამოწმეთ Gemini AI-ს ხელმისაწვდომობა'}
                            {status.status === 'checking' && 'AI ფიქრობს... გთხოვთ დაელოდოთ'}
                            {status.status === 'success' && '✨ AI კავშირი შესანიშნავია!'}
                            {status.status === 'error' && `❌ შეცდომა: ${status.message}`}
                        </p>
                    </div>
                </div>
                <button
                    onClick={checkAIStatus}
                    disabled={status.status === 'checking'}
                    className={`whitespace-nowrap px-6 py-2.5 rounded-xl font-bold transition-all ${status.status === 'checking'
                        ? 'bg-dark-700 text-dark-400 cursor-not-allowed'
                        : 'bg-white text-dark-900 hover:bg-primary-50 hover:text-primary-600 shadow-xl'
                        }`}
                >
                    {status.status === 'checking' ? 'მოწმდება...' : 'ტესტირება (v2.0 Flash)'}
                </button>
            </div>
            {status.status === 'success' && status.message && (
                <div className="mt-4 p-4 bg-dark-900/80 rounded-xl border border-green-500/20 animate-fade-in">
                    <p className="text-xs text-dark-400 font-medium mb-1 uppercase tracking-wider">AI-ს პასუხი:</p>
                    <p className="text-sm text-white italic">" {status.message} "</p>
                </div>
            )}
        </div>
    );
};
