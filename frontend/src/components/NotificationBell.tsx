import { useState, useEffect, useRef } from 'react';
import { HiBell, HiCheck, HiTrash, HiX } from 'react-icons/hi';
import { useNotificationStore } from '../stores/notificationStore';
import { useAuthStore } from '../stores/authStore';
import { formatDistanceToNow } from 'date-fns';
import { ka } from 'date-fns/locale/ka';

export default function NotificationBell() {
    const { isAuthenticated } = useAuthStore();
    const { notifications, unreadCount, fetchNotifications, markAsRead, markAllRead, deleteNotification } = useNotificationStore();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isAuthenticated) {
            fetchNotifications();
            // Poll every 1 minute
            const interval = setInterval(fetchNotifications, 60000);
            return () => clearInterval(interval);
        }
    }, [isAuthenticated]);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // UX-1: Close on Escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setIsOpen(false);
        };
        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, []);

    if (!isAuthenticated) return null;

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                aria-label="შეტყობინებები"
                className="relative p-2 text-dark-300 hover:text-white rounded-lg hover:bg-dark-800 transition-all"
            >
                <HiBell className="w-6 h-6" />
                {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-dark-900 animate-pulse">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 glass rounded-2xl shadow-2xl border border-dark-700 overflow-hidden z-50 animate-slide-down">
                    <div className="p-4 border-b border-dark-700 flex items-center justify-between bg-dark-800/50">
                        <h3 className="font-bold text-white flex items-center">
                            <HiBell className="mr-2 text-primary-400" /> შეტყობინებები
                        </h3>
                        <div className="flex items-center space-x-3">
                            {unreadCount > 0 && (
                                <button
                                    onClick={() => markAllRead()}
                                    className="text-xs text-primary-400 hover:text-primary-300 font-medium"
                                >
                                    ყველას მონიშვნა
                                </button>
                            )}
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-dark-500 hover:text-white transition-colors p-1 rounded-lg hover:bg-dark-700"
                                title="დახურვა"
                            >
                                <HiX className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    <div className="max-h-[70vh] overflow-y-auto">
                        {notifications?.length === 0 ? (
                            <div className="p-8 text-center text-dark-500">
                                <HiBell className="w-12 h-12 mx-auto mb-2 opacity-20" />
                                <p>შეტყობინებები არ არის</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-dark-700/50">
                                {notifications?.map((notif) => (
                                    <div
                                        key={notif.id}
                                        className={`p-4 hover:bg-dark-800/50 transition-colors relative group ${!notif.is_read ? 'bg-primary-500/5' : ''}`}
                                    >
                                        {!notif.is_read && (
                                            <div className="absolute left-2 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-primary-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
                                        )}
                                        <div className="flex justify-between items-start mb-1">
                                            <span className={`text-[10px] uppercase tracking-wider font-bold px-1.5 py-0.5 rounded ${notif.type === 'announcement' ? 'text-amber-400 bg-amber-400/10' :
                                                notif.type === 'achievement' ? 'text-emerald-400 bg-emerald-400/10' :
                                                    'text-primary-400 bg-primary-400/10'
                                                }`}>
                                                {notif.type}
                                            </span>
                                            <span className="text-[10px] text-dark-500">
                                                {notif.created_at ? formatDistanceToNow(new Date(notif.created_at), { addSuffix: true, locale: ka }) : ''}
                                            </span>
                                        </div>
                                        <h4 className={`text-sm font-semibold mb-1 ${notif.is_read ? 'text-dark-200' : 'text-white'}`}>
                                            {notif.title}
                                        </h4>
                                        <p className="text-xs text-dark-400 leading-relaxed mb-3">
                                            {notif.message}
                                        </p>
                                        <div className="flex items-center space-x-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                            {!notif.is_read && (
                                                <button
                                                    onClick={() => markAsRead(notif.id)}
                                                    className="text-[10px] flex items-center text-emerald-400 hover:text-emerald-300"
                                                >
                                                    <HiCheck className="mr-1" /> წაკითხულად მონიშვნა
                                                </button>
                                            )}
                                            <button
                                                onClick={() => deleteNotification(notif.id)}
                                                className="text-[10px] flex items-center text-red-500 hover:text-red-400"
                                            >
                                                <HiTrash className="mr-1" /> წაშლა
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
