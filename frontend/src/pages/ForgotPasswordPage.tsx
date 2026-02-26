import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSent, setIsSent] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const { data } = await api.post('/auth/forgot-password', { email });
            toast.success(data.message || 'აღდგენის ბმული გამოიგზავნა!');
            setIsSent(true);
        } catch (err: any) {
            toast.error(err.response?.data?.error || err.message || 'მოხდა შეცდომა');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4 animate-fade-in">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <span className="text-4xl mb-4 block">🔒</span>
                    <h1 className="text-3xl font-bold text-white mb-2">პაროლის აღდგენა</h1>
                    <p className="text-dark-400">შეიყვანეთ თქვენი ელ-ფოსტა აღდგენის ბმულის მისაღებად</p>
                </div>

                <div className="card p-8">
                    {!isSent ? (
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="block text-dark-300 text-sm font-medium mb-2">ელ-ფოსტა</label>
                                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                                    className="input-field" placeholder="your@email.com" required />
                            </div>

                            <button type="submit" disabled={isLoading} className="btn-primary w-full py-3">
                                {isLoading ? 'იტვირთება...' : 'ბმულის გაგზავნა'}
                            </button>
                        </form>
                    ) : (
                        <div className="text-center space-y-4">
                            <div className="bg-emerald-500/10 text-emerald-400 p-4 rounded-xl border border-emerald-500/20">
                                ინსტრუქცია გაიგზავნა თქვენს ელ-ფოსტაზე: <strong>{email}</strong>
                            </div>
                            <p className="text-dark-400 text-sm">
                                გთხოვთ შეამოწმოთ თქვენი შემოსული წერილები (და Spam საქაღალდეც).
                            </p>
                            <button onClick={() => setIsSent(false)} className="text-primary-400 hover:underline text-sm font-medium">
                                თავიდან გაგზავნა
                            </button>
                        </div>
                    )}

                    <div className="mt-6 text-center">
                        <Link to="/login" className="text-dark-400 hover:text-white text-sm font-medium flex items-center justify-center gap-2">
                            <span>←</span> დაბრუნება შესვლაზე
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
