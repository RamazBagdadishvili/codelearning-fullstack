import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import toast from 'react-hot-toast';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login, isLoading } = useAuthStore();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await login(email, password);
            toast.success('წარმატებით შეხვედით!');
            navigate('/courses');
        } catch (err: any) {
            toast.error(err.message);
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4 animate-fade-in">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <span className="text-4xl mb-4 block">💻</span>
                    <h1 className="text-3xl font-bold text-white mb-2">შესვლა</h1>
                    <p className="text-dark-400">შედით თქვენს ანგარიშში სწავლის გასაგრძელებლად</p>
                </div>

                <div className="card p-8">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-dark-300 text-sm font-medium mb-2">ელ-ფოსტა</label>
                            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                                className="input-field" placeholder="your@email.com" required />
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label className="text-dark-300 text-sm font-medium">პაროლი</label>
                                <Link to="/forgot-password" title="პაროლის აღდგენა" className="text-xs text-primary-400 hover:text-primary-300">
                                    დაგავიწყდათ პაროლი?
                                </Link>
                            </div>
                            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                                className="input-field" placeholder="••••••••" required />
                        </div>

                        <button type="submit" disabled={isLoading} className="btn-primary w-full py-3">
                            {isLoading ? 'იტვირთება...' : 'შესვლა'}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-dark-400">
                            არ გაქვთ ანგარიში?{' '}
                            <Link to="/register" className="text-primary-400 hover:text-primary-300 font-medium">რეგისტრაცია</Link>
                        </p>
                    </div>

                </div>
            </div>
        </div>
    );
}
