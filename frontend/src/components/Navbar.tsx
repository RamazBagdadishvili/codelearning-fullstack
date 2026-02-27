import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { useState, useEffect } from 'react';
import { HiUser, HiLogout, HiCog, HiBookOpen, HiChartBar, HiStar, HiLogin, HiUserAdd, HiArrowLeft, HiPlay } from 'react-icons/hi';
import NotificationBell from './NotificationBell';

export default function Navbar() {
    const { isAuthenticated, user, logout, initialize } = useAuthStore();
    const [isScrolled, setIsScrolled] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => { initialize(); }, []);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 10);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = () => { logout(); navigate('/'); };

    const lastLessonUrl = localStorage.getItem('lastLessonUrl') || '/courses';

    const mobileTabs = [
        { path: '/courses', icon: <HiBookOpen className="w-5 h-5" />, label: 'კურსები' },
        { path: '/leaderboard', icon: <HiChartBar className="w-5 h-5" />, label: 'ლიდერბორდი' },
        {
            path: lastLessonUrl,
            icon: (
                <div className="flex items-center justify-center w-12 h-12 bg-primary-500 rounded-full text-white -mt-8 shadow-lg shadow-primary-500/40 border-4 border-dark-900">
                    <HiPlay className="w-6 h-6 ml-0.5" />
                </div>
            ),
            label: 'სწავლა',
            isSpecial: true
        },
        { path: '/achievements', icon: <HiStar className="w-5 h-5" />, label: 'მიღწევები' },
        {
            path: isAuthenticated ? '#' : '/login',
            icon: isAuthenticated ? <HiLogout className="w-5 h-5" /> : <HiLogin className="w-5 h-5" />,
            label: isAuthenticated ? 'გასვლა' : 'შესვლა',
            onClick: isAuthenticated ? (e: React.MouseEvent) => { e.preventDefault(); handleLogout(); } : undefined
        },
    ];

    return (
        <>
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
                                        <Link to="/admin" aria-label="მართვის პანელი" className="flex items-center px-2.5 py-2 text-amber-400 hover:text-amber-300 rounded-lg hover:bg-dark-800 transition-all" title="მართვის პანელი">
                                            <HiCog className="w-5 h-5" />
                                        </Link>
                                    )}
                                    <NotificationBell />
                                    <button aria-label="გამოსვლა" onClick={handleLogout} className="ml-2 px-3 py-2 text-dark-400 hover:text-red-400 rounded-lg hover:bg-dark-800 transition-all">
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

                        {/* Mobile Right Controls (Notifications & Profile) */}
                        <div className="md:hidden flex items-center space-x-3">
                            {isAuthenticated && (
                                <>
                                    <NotificationBell />
                                    <Link to="/profile" className="flex items-center">
                                        {user?.avatarUrl ? (
                                            <img
                                                src={user.avatarUrl}
                                                alt="პროფილი"
                                                className="w-8 h-8 rounded-full border border-primary-500/50 object-cover"
                                            />
                                        ) : (
                                            <div className="w-8 h-8 rounded-full bg-dark-800 border border-dark-700 flex items-center justify-center text-primary-400">
                                                <HiUser className="w-5 h-5" />
                                            </div>
                                        )}
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            {/* Mobile Bottom Tab Bar */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 bg-dark-900 border-t border-dark-800 z-[60] flex justify-around items-center pb-[env(safe-area-inset-bottom)] px-1">
                {mobileTabs.map((tab, idx) => {
                    const isHashBack = tab.path === '#back';
                    const isLogout = tab.path === '#' && isAuthenticated;
                    const isActive = !isHashBack && !isLogout && (location.pathname === tab.path || (tab.path !== '/' && location.pathname.startsWith(tab.path)));

                    const content = (
                        <div className={`flex flex-col items-center justify-center w-full py-2 gap-1 transition-colors ${isActive ? 'text-primary-400' : 'text-dark-400 hover:text-dark-200'}`}>
                            {tab.icon}
                            {!tab.isSpecial && <span className="text-[9px] font-bold tracking-tight text-center">{tab.label}</span>}
                            {tab.isSpecial && <span className="text-[9px] font-black tracking-tight text-primary-400 -mt-1">{tab.label}</span>}
                        </div>
                    );

                    if (tab.onClick) {
                        return (
                            <button key={idx} onClick={tab.onClick} className="flex-1 outline-none">
                                {content}
                            </button>
                        );
                    }

                    return (
                        <Link key={tab.path} to={tab.path} className="flex-1">
                            {content}
                        </Link>
                    );
                })}
            </div>
        </>
    );
}
