import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import toast from 'react-hot-toast';
import { HiEye, HiEyeOff } from 'react-icons/hi';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
    const { login, isLoading, isAuthenticated } = useAuthStore();
    const navigate = useNavigate();

    // Bug 9: Redirect if already logged in
    useEffect(() => {
        if (isAuthenticated) navigate('/courses', { replace: true });
    }, [isAuthenticated, navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const newErrors: { email?: string; password?: string } = {};

        if (!email.trim()) {
            newErrors.email = 'გთხოვ შეიყვანო ელ-ფოსტა.';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            newErrors.email = 'გთხოვ შეიყვანო სწორი ელ-ფოსტის მისამართი.';
        }
        if (!password) {
            newErrors.password = 'გთხოვ შეიყვანო პაროლი.';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }
        setErrors({});

        try {
            await login(email, password);
            toast.success('წარმატებით შეხვედით!');
            // Bug 9: Role-based redirect
            const user = useAuthStore.getState().user;
            if (user?.role === 'admin') {
                navigate('/admin');
            } else {
                navigate('/courses');
            }
        } catch (err: any) {
            toast.error(err.message);
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4 animate-fade-in">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">შესვლა</h1>
                    <p className="text-dark-400">შედით თქვენს ანგარიშში სწავლის გასაგრძელებლად</p>
                </div>

                <div className="card p-8">
                    <form onSubmit={handleSubmit} noValidate className="space-y-5">
                        <div>
                            <label className="block text-dark-300 text-sm font-medium mb-2">ელ-ფოსტა</label>
                            <input type="email" value={email} onChange={(e) => { setEmail(e.target.value); setErrors(prev => ({ ...prev, email: undefined })); }}
                                autoComplete="username"
                                className={`input-field ${errors.email ? 'border-red-500' : ''}`} placeholder="name@example.com" />
                            {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label className="text-dark-300 text-sm font-medium">პაროლი</label>
                                <Link to="/forgot-password" title="პაროლის აღდგენა" className="text-xs text-primary-400 hover:text-primary-300">
                                    დაგავიწყდათ პაროლი?
                                </Link>
                            </div>
                            <div className="relative">
                                <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => { setPassword(e.target.value); setErrors(prev => ({ ...prev, password: undefined })); }}
                                    autoComplete="current-password"
                                    className={`input-field pr-10 ${errors.password ? 'border-red-500' : ''}`} placeholder="••••••••" />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 flex items-center pr-3 text-dark-400 hover:text-white" aria-label={showPassword ? "პაროლის დამალვა" : "პაროლის გამოჩენა"}>
                                    {showPassword ? <HiEyeOff className="w-5 h-5" /> : <HiEye className="w-5 h-5" />}
                                </button>
                            </div>
                            {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
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
