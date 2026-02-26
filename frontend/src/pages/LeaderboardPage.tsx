import { useEffect, useState } from 'react';
import api from '../api/axios';
import { useAuthStore } from '../stores/authStore';
import { formatXP } from '../utils/formatters';
import { HiFire, HiCalendar, HiGlobe, HiLightningBolt } from 'react-icons/hi';

export default function LeaderboardPage() {
    const [leaderboard, setLeaderboard] = useState<any[]>([]);
    const [userRank, setUserRank] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [timeframe, setTimeframe] = useState<'week' | 'month' | 'all'>('all');
    const { user } = useAuthStore();

    useEffect(() => {
        const fetch = async () => {
            setIsLoading(true);
            try {
                const { data } = await api.get(`/leaderboard?timeframe=${timeframe}`);
                setLeaderboard(data.leaderboard);
                setUserRank(data.userRank);
            } catch { }
            setIsLoading(false);
        };
        fetch();
    }, [timeframe]);

    const getRankBadge = (rank: number) => {
        if (rank === 1) return '🥇';
        if (rank === 2) return '🥈';
        if (rank === 3) return '🥉';
        return `#${rank}`;
    };

    if (isLoading) {
        return <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" /></div>;
    }

    return (
        <div className="page-container animate-fade-in">
            <div className="text-center mb-8">
                <h1 className="section-title">🏆 ლიდერბორდი</h1>
                <p className="text-dark-400">ტოპ მოსწავლეები XP ქულების მიხედვით</p>
                {userRank && (
                    <p className="text-primary-400 mt-2">თქვენი პოზიცია: #{userRank}</p>
                )}

                {/* Timeframe Filters */}
                <div className="flex items-center justify-center mt-6">
                    <div className="bg-dark-900 border border-dark-800 rounded-xl p-1 flex gap-1">
                        <button
                            onClick={() => setTimeframe('week')}
                            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${timeframe === 'week' ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30' : 'text-dark-400 hover:text-white hover:bg-dark-800'}`}
                        >
                            <HiFire className="w-4 h-4" /> კვირა
                        </button>
                        <button
                            onClick={() => setTimeframe('month')}
                            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${timeframe === 'month' ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30' : 'text-dark-400 hover:text-white hover:bg-dark-800'}`}
                        >
                            <HiCalendar className="w-4 h-4" /> თვე
                        </button>
                        <button
                            onClick={() => setTimeframe('all')}
                            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${timeframe === 'all' ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30' : 'text-dark-400 hover:text-white hover:bg-dark-800'}`}
                        >
                            <HiGlobe className="w-4 h-4" /> სრული
                        </button>
                    </div>
                </div>
            </div>

            {/* ტოპ 3 */}
            {leaderboard.length >= 3 && (
                <div className="flex justify-center items-end gap-2 sm:gap-6 mb-12 sm:mb-16 px-4">
                    {[leaderboard[1], leaderboard[0], leaderboard[2]].map((u, i) => {
                        const rank = i === 0 ? 2 : i === 1 ? 1 : 3;
                        const heights = ['h-28 sm:h-36', 'h-40 sm:h-52', 'h-24 sm:h-32'];
                        const isFirst = rank === 1;

                        return (
                            <div key={u.id} className="flex flex-col items-center flex-1 max-w-[120px] sm:max-w-[160px] relative group">
                                {isFirst && timeframe === 'week' && (
                                    <div className="absolute -top-12 left-1/2 -translate-x-1/2 whitespace-nowrap px-3 py-1 bg-amber-500 text-dark-950 text-[10px] font-black rounded-full shadow-lg shadow-amber-500/30 animate-bounce flex items-center gap-1">
                                        👑 WEEKLY CHAMPION
                                    </div>
                                )}

                                <div className={`relative mb-4 ${isFirst ? 'scale-110 sm:scale-125' : ''}`}>
                                    <div className={`w-14 h-14 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-600 flex items-center justify-center text-xl sm:text-2xl font-black text-white shadow-2xl transition-transform group-hover:rotate-6
                                        ${isFirst ? 'ring-4 ring-amber-400 ring-offset-4 ring-offset-dark-950' : ''}`}>
                                        {u.username?.charAt(0).toUpperCase()}
                                    </div>
                                    <div className={`absolute -bottom-2 -right-2 w-6 h-6 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center text-sm sm:text-lg shadow-lg
                                        ${isFirst ? 'bg-amber-400' : rank === 2 ? 'bg-slate-300' : 'bg-orange-500'}`}>
                                        {getRankBadge(rank)}
                                    </div>
                                </div>

                                <div className="text-center mb-3">
                                    <p className="text-white font-black text-[10px] sm:text-base truncate w-full max-w-[80px] sm:max-w-none">
                                        {u.username}
                                    </p>
                                    <p className="text-amber-400 text-[10px] sm:text-sm font-black flex items-center justify-center gap-1">
                                        <HiLightningBolt className="w-3 h-3" /> {formatXP(u.xp_points)}
                                    </p>
                                </div>

                                <div className={`${heights[i]} w-full rounded-t-2xl bg-gradient-to-t relative overflow-hidden transition-all group-hover:brightness-110
                                    ${rank === 1 ? 'from-amber-600/20 via-amber-500/40 to-amber-400/60 border-x border-t border-amber-400/30 shadow-[0_-10px_40px_-10px_rgba(251,191,36,0.3)]' :
                                        rank === 2 ? 'from-slate-600/20 via-slate-500/40 to-slate-300/60 border-x border-t border-slate-300/30' :
                                            'from-orange-800/20 via-orange-700/40 to-orange-500/60 border-x border-t border-orange-500/30'}`}>
                                    {isFirst && (
                                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/shattered.png')] opacity-10" />
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* სრული სია */}
            <div className="card overflow-hidden p-0 border-dark-800">
                <div className="hidden sm:block">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-dark-800 bg-dark-800/30">
                                <th className="text-left text-dark-400 font-medium p-4 text-sm">#</th>
                                <th className="text-left text-dark-400 font-medium p-4 text-sm">მომხმარებელი</th>
                                <th className="text-right text-dark-400 font-medium p-4 text-sm">XP</th>
                                <th className="text-right text-dark-400 font-medium p-4 text-sm hidden sm:table-cell">Level</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(leaderboard || []).map((u: any) => (
                                <tr key={u.id} className={`border-b border-dark-800/50 hover:bg-dark-800/50 transition-colors
                                    ${u.id === user?.id ? 'bg-primary-500/5 border-primary-500/20' : ''}`}>
                                    <td className="p-4 font-bold text-lg">{getRankBadge(parseInt(u.rank))}</td>
                                    <td className="p-4">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-600 to-accent-600 flex items-center justify-center text-white font-bold">
                                                {u.username?.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="text-white font-medium">{u.full_name || u.username}</p>
                                                <p className="text-dark-500 text-sm">@{u.username}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4 text-right text-amber-400 font-bold" title={`${u.xp_points} XP`}>⚡ {formatXP(u.xp_points)}</td>
                                    <td className="p-4 text-right text-primary-400 font-medium hidden sm:table-cell">Lv.{u.level}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Mobile List View */}
                <div className="sm:hidden divide-y divide-dark-800">
                    {(leaderboard || []).map((u: any) => (
                        <div key={u.id} className={`p-4 flex items-center justify-between gap-3 ${u.id === user?.id ? 'bg-primary-500/10' : ''}`}>
                            <div className="flex items-center gap-3 min-w-0">
                                <span className="text-base font-bold text-dark-400 w-6 shrink-0">{getRankBadge(parseInt(u.rank))}</span>
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-600 to-accent-600 flex items-center justify-center text-white font-bold shrink-0">
                                    {u.username?.charAt(0).toUpperCase()}
                                </div>
                                <div className="min-w-0">
                                    <p className="text-white font-bold text-sm truncate">{u.full_name || u.username}</p>
                                    <p className="text-dark-500 text-xs truncate">@{u.username}</p>
                                </div>
                            </div>
                            <div className="text-right shrink-0">
                                <div className="text-amber-400 font-bold text-sm">⚡{formatXP(u.xp_points)}</div>
                                <div className="text-primary-500 text-[10px] font-medium">Lv.{u.level}</div>
                            </div>
                        </div>
                    ))}
                </div>

                {leaderboard.length === 0 && (
                    <p className="text-center text-dark-500 py-10">ლიდერბორდი ცარიელია.</p>
                )}
            </div>
        </div>
    );
}
