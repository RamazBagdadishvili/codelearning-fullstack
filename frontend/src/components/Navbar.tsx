import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { useState, useEffect } from 'react';
import { HiMenu, HiX, HiUser, HiLogout, HiCog } from 'react-icons/hi';
import NotificationBell from './NotificationBell';


export default function Navbar() {
    const { isAuthenticated, user, logout, initialize } = useAuthStore();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const navigate = useNavigate();

    useEffect(() => { initialize(); }, []);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 10);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = () => { logout(); navigate('/'); setIsMenuOpen(false); };

    return (
        <nav className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled ? 'glass shadow-lg shadow-dark-950/50' : 'bg-transparent'}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* ლოგო */}
                    <Link to="/" className="flex items-center space-x-2 group">
                        <span className="text-2xl">💻</span>
                        <span className="text-xl font-bold gradient-text group-hover:opacity-80 transition-opacity">
                            CodeLearning
                        </span>
                    </Link>

                    {/* Desktop მენიუ */}
                    <div className="hidden md:flex items-center space-x-1">
                        <Link to="/courses" className="px-4 py-2 text-dark-300 hover:text-white rounded-lg hover:bg-dark-800 transition-all">
                            კურსები
                        </Link>
                        <Link to="/leaderboard" className="px-4 py-2 text-dark-300 hover:text-white rounded-lg hover:bg-dark-800 transition-all">
                            ლიდერბორდი
                        </Link>

                        {isAuthenticated ? (
                            <>
                                <Link to="/achievements" className="px-4 py-2 text-dark-300 hover:text-white rounded-lg hover:bg-dark-800 transition-all">
                                    მიღწევები
                                </Link>
                                <Link to="/profile" className="px-4 py-2 text-dark-300 hover:text-white rounded-lg hover:bg-dark-800 transition-all flex items-center space-x-2">
                                    <HiUser className="w-4 h-4" />
                                    <span>პროფილი</span>
                                </Link>
                                {(user?.role === 'admin' || user?.role === 'instructor') && (
                                    <Link to="/admin" className="flex items-center px-2.5 py-2 text-amber-400 hover:text-amber-300 rounded-lg hover:bg-dark-800 transition-all" title="მართვის პანელი">
                                        <HiCog className="w-5 h-5" />
                                    </Link>
                                )}
                                <div className="flex items-center space-x-1.5 ml-1.5 px-2.5 py-1.5 bg-dark-800 rounded-xl border border-dark-700">
                                    <span className="text-amber-400 text-xs font-medium truncate max-w-[80px]">⚡ {user?.xpPoints || 0} XP</span>
                                    <span className="text-dark-500">|</span>
                                    <span className="text-primary-400 text-xs font-medium">Lv.{user?.level || 1}</span>
                                </div>
                                <NotificationBell />
                                <button onClick={handleLogout} className="ml-2 px-3 py-2 text-dark-400 hover:text-red-400 rounded-lg hover:bg-dark-800 transition-all">
                                    <HiLogout className="w-5 h-5" />
                                </button>
                            </>
                        ) : (
                            <div className="flex items-center space-x-2 ml-4">
                                <Link to="/login" className="btn-secondary text-sm">შესვლა</Link>
                                <Link to="/register" className="btn-primary text-sm">რეგისტრაცია</Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile ტოგლი */}
                    <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden text-dark-300 hover:text-white p-2">
                        {isMenuOpen ? <HiX className="w-6 h-6" /> : <HiMenu className="w-6 h-6" />}
                    </button>
                </div>

                {/* Mobile მენიუ */}
                {isMenuOpen && (
                    <div className="md:hidden glass rounded-xl mt-2 p-4 animate-slide-down">
                        <div className="flex flex-col space-y-2">
                            <Link to="/courses" onClick={() => setIsMenuOpen(false)} className="px-4 py-3 text-dark-200 hover:text-white rounded-lg hover:bg-dark-800">კურსები</Link>
                            <Link to="/leaderboard" onClick={() => setIsMenuOpen(false)} className="px-4 py-3 text-dark-200 hover:text-white rounded-lg hover:bg-dark-800">ლიდერბორდი</Link>
                            {isAuthenticated ? (
                                <>
                                    <Link to="/achievements" onClick={() => setIsMenuOpen(false)} className="px-4 py-3 text-dark-200 hover:text-white rounded-lg hover:bg-dark-800">მიღწევები</Link>
                                    <Link to="/profile" onClick={() => setIsMenuOpen(false)} className="px-4 py-3 text-dark-200 hover:text-white rounded-lg hover:bg-dark-800">პროფილი</Link>
                                    {(user?.role === 'admin' || user?.role === 'instructor') && <Link to="/admin" onClick={() => setIsMenuOpen(false)} className="px-4 py-3 text-amber-400 rounded-lg hover:bg-dark-800">მართვის პანელი</Link>}
                                    <div className="flex items-center space-x-3 px-4 py-2">
                                        <span className="text-amber-400 text-sm">⚡ {user?.xpPoints} XP</span>
                                        <span className="text-primary-400 text-sm">Level {user?.level}</span>
                                    </div>
                                    <button onClick={handleLogout} className="px-4 py-3 text-red-400 hover:bg-dark-800 rounded-lg text-left">გამოსვლა</button>
                                </>
                            ) : (
                                <div className="flex flex-col space-y-2 pt-2 border-t border-dark-700">
                                    <Link to="/login" onClick={() => setIsMenuOpen(false)} className="btn-secondary text-center">შესვლა</Link>
                                    <Link to="/register" onClick={() => setIsMenuOpen(false)} className="btn-primary text-center">რეგისტრაცია</Link>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}
