import { useEffect, useState } from 'react';
import api from '../api/axios';
import { useAuthStore } from '../stores/authStore';
import { formatXP } from '../utils/formatters';
import { HiFire, HiCalendar, HiGlobe } from 'react-icons/hi';

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
                <div className="flex justify-center items-end gap-2 sm:gap-4 mb-8 sm:mb-12 px-2">
                    {[leaderboard[1], leaderboard[0], leaderboard[2]].map((u, i) => {
                        const rank = i === 0 ? 2 : i === 1 ? 1 : 3;
                        const heights = ['h-24 sm:h-32', 'h-32 sm:h-40', 'h-20 sm:h-28'];
                        return (
                            <div key={u.id} className="flex flex-col items-center flex-1 max-w-[100px] sm:max-w-none">
                                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-lg sm:text-xl font-bold text-white mb-2 shadow-lg shadow-primary-500/20">
                                    {u.username?.charAt(0).toUpperCase()}
                                </div>
                                <p className="text-white font-semibold text-[10px] sm:text-sm mb-0.5 truncate w-full text-center">{u.username}</p>
                                <p className="text-amber-400 text-[10px] sm:text-sm font-bold" title={`${u.xp_points} XP`}>⚡{formatXP(u.xp_points)}</p>
                                <div className={`${heights[i]} w-full mt-3 rounded-t-xl bg-gradient-to-t 
                  ${rank === 1 ? 'from-amber-600 to-amber-400' : rank === 2 ? 'from-slate-500 to-slate-300' : 'from-orange-700 to-orange-500'}
                  flex items-start justify-center pt-3`}>
                                    <span className="text-xl sm:text-3xl">{getRankBadge(rank)}</span>
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
