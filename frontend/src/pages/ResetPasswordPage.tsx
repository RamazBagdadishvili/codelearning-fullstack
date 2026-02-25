import { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';

export default function ResetPasswordPage() {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { token } = useParams();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            return toast.error('პაროლები არ ემთხვევა');
        }

        setIsLoading(true);
        try {
            const { data } = await api.post(`/auth/reset-password/${token}`, { password });
            toast.success(data.message || 'პაროლი წარმატებით შეიცვალა!');
            navigate('/login');
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
                    <span className="text-4xl mb-4 block">🔑</span>
                    <h1 className="text-3xl font-bold text-white mb-2">ახალი პაროლი</h1>
                    <p className="text-dark-400">შეიყვანეთ თქვენი ახალი პაროლი</p>
                </div>

                <div className="card p-8">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-dark-300 text-sm font-medium mb-2">ახალი პაროლი</label>
                            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                                className="input-field" placeholder="••••••••" required minLength={6} />
                        </div>

                        <div>
                            <label className="block text-dark-300 text-sm font-medium mb-2">გაიმეორეთ პაროლი</label>
                            <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                                className="input-field" placeholder="••••••••" required minLength={6} />
                        </div>

                        <button type="submit" disabled={isLoading} className="btn-primary w-full py-3">
                            {isLoading ? 'იტვირთება...' : 'პაროლის განახლება'}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <Link to="/login" className="text-dark-400 hover:text-white text-sm font-medium flex items-center justify-center gap-2">
                            დაბრუნება შესვლაზე
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
