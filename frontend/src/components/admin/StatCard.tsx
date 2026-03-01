import React from 'react';

interface StatCardProps {
    label: string;
    value: number | string;
    icon: string;
    color?: 'primary' | 'amber' | 'emerald' | 'indigo' | 'rose';
}

export const StatCard: React.FC<StatCardProps> = ({ label, value, icon, color }) => {
    const colorClasses: Record<string, string> = {
        primary: 'bg-primary-500/10 text-primary-400 border-primary-500/20',
        amber: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
        emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
        indigo: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
        rose: 'bg-rose-500/10 text-rose-400 border-rose-500/20'
    };

    const currentClass = colorClasses[color || 'primary'];

    return (
        <div className={`card p-5 group hover:border-primary-500/30 transition-all duration-300 relative overflow-hidden`}>
            <div className={`absolute -right-4 -top-4 w-20 h-20 rounded-full blur-3xl opacity-10 ${color === 'amber' ? 'bg-amber-500' : color === 'emerald' ? 'bg-emerald-500' : 'bg-primary-500'}`} />
            <div className="flex items-center space-x-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-inner border ${currentClass}`}>
                    {icon}
                </div>
                <div className="text-left">
                    <div className="text-2xl font-black text-white group-hover:scale-105 transition-transform origin-left">{value || 0}</div>
                    <div className="text-dark-400 text-xs font-medium uppercase tracking-wider">{label}</div>
                </div>
            </div>
        </div>
    );
};
