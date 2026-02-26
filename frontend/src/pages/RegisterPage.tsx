import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import toast from 'react-hot-toast';

export default function RegisterPage() {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errors, setErrors] = useState<{ username?: string; email?: string; password?: string; confirmPassword?: string }>({});
    const { register, isLoading, isAuthenticated } = useAuthStore();
    const navigate = useNavigate();

    // Bug 9: Redirect if already logged in
    useEffect(() => {
        if (isAuthenticated) navigate('/courses', { replace: true });
    }, [isAuthenticated, navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const newErrors: typeof errors = {};

        if (!username.trim()) {
            newErrors.username = 'გთხოვ შეიყვანო მომხმარებლის სახელი.';
        } else if (username.length < 3) {
            newErrors.username = 'მომხმარებლის სახელი უნდა შეიცავდეს მინიმუმ 3 სიმბოლოს.';
        }
        if (!email.trim()) {
            newErrors.email = 'გთხოვ შეიყვანო ელ-ფოსტა.';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            newErrors.email = 'გთხოვ შეიყვანო სწორი ელ-ფოსტის მისამართი.';
        }
        if (!password) {
            newErrors.password = 'გთხოვ შეიყვანო პაროლი.';
        } else if (password.length < 6) {
            newErrors.password = 'პაროლი უნდა შეიცავდეს მინიმუმ 6 სიმბოლოს.';
        }
        if (password && confirmPassword && password !== confirmPassword) {
            newErrors.confirmPassword = 'პაროლები არ ემთხვევა.';
        } else if (!confirmPassword) {
            newErrors.confirmPassword = 'გთხოვ დაადასტურო პაროლი.';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }
        setErrors({});

        try {
            await register(email, username, password);
            toast.success('რეგისტრაცია წარმატებულია! კეთილი იყოს თქვენი მობრძანება!');
            navigate('/courses');
        } catch (err: any) {
            toast.error(err.message);
        }
    };

    const clearError = (field: string) => setErrors(prev => ({ ...prev, [field]: undefined }));

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4 py-8 animate-fade-in">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <span className="text-4xl mb-4 block">🚀</span>
                    <h1 className="text-3xl font-bold text-white mb-2">რეგისტრაცია</h1>
                    <p className="text-dark-400">შექმენით უფასო ანგარიში და დაიწყეთ სწავლა</p>
                </div>

                <div className="card p-8">
                    <form onSubmit={handleSubmit} noValidate autoComplete="off" className="space-y-4">

                        <div>
                            <label className="block text-dark-300 text-sm font-medium mb-2">მომხმარებლის სახელი *</label>
                            <input type="text" value={username} onChange={(e) => { setUsername(e.target.value); clearError('username'); }}
                                autoComplete="username"
                                className={`input-field ${errors.username ? 'border-red-500' : ''}`} placeholder="giorgi_dev" />
                            {errors.username && <p className="text-red-400 text-xs mt-1">{errors.username}</p>}
                        </div>

                        <div>
                            <label className="block text-dark-300 text-sm font-medium mb-2">ელ-ფოსტა *</label>
                            <input type="email" value={email} onChange={(e) => { setEmail(e.target.value); clearError('email'); }}
                                autoComplete="username"
                                className={`input-field ${errors.email ? 'border-red-500' : ''}`} placeholder="your@email.com" />
                            {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
                        </div>

                        <div>
                            <label className="block text-dark-300 text-sm font-medium mb-2">პაროლი *</label>
                            <input type="password" value={password} onChange={(e) => { setPassword(e.target.value); clearError('password'); }}
                                autoComplete="new-password"
                                className={`input-field ${errors.password ? 'border-red-500' : ''}`} placeholder="მინიმუმ 6 სიმბოლო" />
                            {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
                        </div>

                        <div>
                            <label className="block text-dark-300 text-sm font-medium mb-2">პაროლის დადასტურება *</label>
                            <input type="password" value={confirmPassword} onChange={(e) => { setConfirmPassword(e.target.value); clearError('confirmPassword'); }}
                                autoComplete="new-password"
                                className={`input-field ${errors.confirmPassword ? 'border-red-500' : ''}`} placeholder="გაიმეორეთ პაროლი" />
                            {errors.confirmPassword && <p className="text-red-400 text-xs mt-1">{errors.confirmPassword}</p>}
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
