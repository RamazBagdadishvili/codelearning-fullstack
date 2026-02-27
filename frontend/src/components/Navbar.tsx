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

    useEffect(() => {
        initialize();
    }, [initialize]);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 10);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const lastLessonUrl = localStorage.getItem('lastLessonUrl') || '/courses';

    // ძირითადი ტაბები (Mobile)
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
            label: 'განაგრძე სწავლა',
            isSpecial: true
        },
        { path: '/achievements', icon: <HiStar className="w-5 h-5" />, label: 'მიღწევები' }
    ];

    // ავტორიზაციის ღილაკი ცალკე (Mobile)
    const authTab = isAuthenticated
        ? { path: '#', icon: <HiLogout className="w-5 h-5" />, label: 'გასვლა', onClick: (e: React.MouseEvent) => { e.preventDefault(); handleLogout(); } }
        : { path: '/login', icon: <HiLogin className="w-5 h-5" />, label: 'შესვლა' };

    return (
        <>
            <nav className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled ? 'glass shadow-lg shadow-dark-950/50' : 'bg-transparent'}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* ლოგო + ვერსიის ნიშანი */}
                        <Link to="/" className="flex items-center space-x-2 group">
                            <span className="text-2xl">💻</span>
                            <div className="flex flex-col">
                                <span className="text-xl font-bold gradient-text">CodeLearning</span>
                                <span className="text-[8px] text-primary-500 opacity-50">v2.1</span>
                            </div>
                        </Link>

                        {/* Desktop მენიუ */}
                        <div className="hidden md:flex items-center space-x-1">
                            <Link to="/courses" className="px-4 py-2 text-dark-300 hover:text-white rounded-lg hover:bg-dark-800">კურსები</Link>
                            <Link to="/leaderboard" className="px-4 py-2 text-dark-300 hover:text-white rounded-lg hover:bg-dark-800">ლიდერბორდი</Link>

                            {isAuthenticated ? (
                                <>
                                    <Link to={lastLessonUrl} className="px-4 py-2 text-primary-400 hover:text-primary-300 font-bold rounded-lg hover:bg-dark-800 flex items-center space-x-1.5">
                                        <HiPlay className="w-4 h-4" />
                                        <span>განაგრძე სწავლა</span>
                                    </Link>
                                    <Link to="/achievements" className="px-4 py-2 text-dark-300 hover:text-white rounded-lg hover:bg-dark-800">მიღწევები</Link>
                                    <Link to="/profile" className="px-4 py-2 text-dark-300 hover:text-white rounded-lg hover:bg-dark-800 flex items-center space-x-2">
                                        <HiUser className="w-4 h-4" />
                                        <span>პროფილი</span>
                                    </Link>
                                    {(user?.role === 'admin' || user?.role === 'instructor') && (
                                        <Link to="/admin" className="px-2.5 py-2 text-amber-400 hover:text-amber-300 rounded-lg hover:bg-dark-800">
                                            <HiCog className="w-5 h-5" />
                                        </Link>
                                    )}
                                    <NotificationBell />
                                    <button onClick={handleLogout} className="ml-2 px-3 py-2 text-dark-400 hover:text-red-400 rounded-lg hover:bg-dark-800 flex items-center space-x-1">
                                        <HiLogout className="w-5 h-5" />
                                        <span className="text-sm">გასვლა</span>
                                    </button>
                                </>
                            ) : (
                                <div className="flex items-center space-x-2 ml-4">
                                    <Link to="/login" className="btn-secondary text-sm">შესვლა</Link>
                                    <Link to="/register" className="btn-primary text-sm">რეგისტრაცია</Link>
                                </div>
                            )}
                        </div>

                        {/* Mobile Header (Notifications & Profile) */}
                        <div className="md:hidden flex items-center space-x-3">
                            {isAuthenticated && (
                                <>
                                    <NotificationBell />
                                    <Link to="/profile" className="w-8 h-8 rounded-full overflow-hidden border border-primary-500/50">
                                        {user?.avatarUrl ? (
                                            <img src={user.avatarUrl} alt="პროფილი" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full bg-dark-800 flex items-center justify-center text-primary-400">
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

            {/* Mobile Bottom Bar */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 bg-dark-900 border-t border-dark-800 z-[60] flex justify-around items-center pb-2 pt-1 px-1">
                {[...mobileTabs, authTab].map((tab, idx) => {
                    const isActive = location.pathname === tab.path;

                    const content = (
                        <div className={`flex flex-col items-center justify-center py-1 gap-1 ${isActive ? 'text-primary-400' : 'text-dark-400'}`}>
                            {tab.icon}
                            <span className={`text-[9px] ${tab.isSpecial ? 'font-black text-primary-400' : 'font-medium'}`}>
                                {tab.label}
                            </span>
                        </div>
                    );

                    if ('onClick' in tab && tab.onClick) {
                        return (
                            <button key={idx} onClick={tab.onClick} className="flex-1 fill-none outline-none">
                                {content}
                            </button>
                        );
                    }

                    return (
                        <Link key={tab.path + idx} to={tab.path} className="flex-1">
                            {content}
                        </Link>
                    );
                })}
            </div>
        </>
    );
}
