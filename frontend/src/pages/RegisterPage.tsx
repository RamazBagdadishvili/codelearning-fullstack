import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import toast from 'react-hot-toast';

export default function RegisterPage() {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const { register, isLoading } = useAuthStore();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            toast.error('პაროლები არ ემთხვევა!');
            return;
        }
        if (password.length < 6) {
            toast.error('პაროლი უნდა იყოს მინიმუმ 6 სიმბოლო!');
            return;
        }
        try {
            await register(email, username, password);
            toast.success('რეგისტრაცია წარმატებულია! კეთილი იყოს თქვენი მობრძანება!');
            navigate('/courses');
        } catch (err: any) {
            toast.error(err.message);
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4 py-8 animate-fade-in">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <span className="text-4xl mb-4 block">🚀</span>
                    <h1 className="text-3xl font-bold text-white mb-2">რეგისტრაცია</h1>
                    <p className="text-dark-400">შექმენით უფასო ანგარიში და დაიწყეთ სწავლა</p>
                </div>

                <div className="card p-8">
                    <form onSubmit={handleSubmit} className="space-y-4">

                        <div>
                            <label className="block text-dark-300 text-sm font-medium mb-2">მომხმარებლის სახელი *</label>
                            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)}
                                className="input-field" placeholder="giorgi_dev" required minLength={3} />
                        </div>

                        <div>
                            <label className="block text-dark-300 text-sm font-medium mb-2">ელ-ფოსტა *</label>
                            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                                className="input-field" placeholder="your@email.com" required />
                        </div>

                        <div>
                            <label className="block text-dark-300 text-sm font-medium mb-2">პაროლი *</label>
                            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                                className="input-field" placeholder="მინიმუმ 6 სიმბოლო" required minLength={6} />
                        </div>

                        <div>
                            <label className="block text-dark-300 text-sm font-medium mb-2">პაროლის დადასტურება *</label>
                            <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                                className="input-field" placeholder="გაიმეორეთ პაროლი" required />
                        </div>

                        <button type="submit" disabled={isLoading} className="btn-primary w-full py-3">
                            {isLoading ? 'იტვირთება...' : 'რეგისტრაცია'}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-dark-400">
                            უკვე გაქვთ ანგარიში?{' '}
                            <Link to="/login" className="text-primary-400 hover:text-primary-300 font-medium">შესვლა</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
