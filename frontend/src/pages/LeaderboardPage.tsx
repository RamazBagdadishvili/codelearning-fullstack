import { useEffect, useState } from 'react';
import api from '../api/axios';
import { useAuthStore } from '../stores/authStore';

export default function LeaderboardPage() {
    const [leaderboard, setLeaderboard] = useState<any[]>([]);
    const [userRank, setUserRank] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const { user } = useAuthStore();

    useEffect(() => {
        const fetch = async () => {
            try {
                const { data } = await api.get('/leaderboard');
                setLeaderboard(data.leaderboard);
                setUserRank(data.userRank);
            } catch { }
            setIsLoading(false);
        };
        fetch();
    }, []);

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
            </div>

            {/* ტოპ 3 */}
            {leaderboard.length >= 3 && (
                <div className="flex justify-center items-end gap-4 mb-12">
                    {[leaderboard[1], leaderboard[0], leaderboard[2]].map((u, i) => {
                        const rank = i === 0 ? 2 : i === 1 ? 1 : 3;
                        const heights = ['h-32', 'h-40', 'h-28'];
                        return (
                            <div key={u.id} className="flex flex-col items-center">
                                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-xl font-bold text-white mb-2">
                                    {u.username?.charAt(0).toUpperCase()}
                                </div>
                                <p className="text-white font-semibold text-sm mb-1">{u.username}</p>
                                <p className="text-amber-400 text-sm font-bold">⚡ {u.xp_points} XP</p>
                                <div className={`${heights[i]} w-24 mt-4 rounded-t-xl bg-gradient-to-t 
                  ${rank === 1 ? 'from-amber-600 to-amber-400' : rank === 2 ? 'from-slate-500 to-slate-300' : 'from-orange-700 to-orange-500'}
                  flex items-start justify-center pt-4`}>
                                    <span className="text-3xl">{getRankBadge(rank)}</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* სრული სია */}
            <div className="card overflow-hidden">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-dark-800">
                            <th className="text-left text-dark-400 font-medium p-4 text-sm">#</th>
                            <th className="text-left text-dark-400 font-medium p-4 text-sm">მომხმარებელი</th>
                            <th className="text-right text-dark-400 font-medium p-4 text-sm">XP</th>
                            <th className="text-right text-dark-400 font-medium p-4 text-sm hidden sm:table-cell">Level</th>
                            <th className="text-right text-dark-400 font-medium p-4 text-sm hidden md:table-cell">ლექციები</th>
                            <th className="text-right text-dark-400 font-medium p-4 text-sm hidden md:table-cell">სტრიქი</th>
                        </tr>
                    </thead>
                    <tbody>
                        {(leaderboard || []).map((u: any) => (
                            <tr key={u.id} className={`border-b border-dark-800/50 hover:bg-dark-800/50 transition-colors
                ${u.id === user?.id ? 'bg-primary-500/5 border-primary-500/20' : ''}`}>
                                <td className="p-2 sm:p-4 font-bold text-base sm:text-lg text-center sm:text-left">{getRankBadge(parseInt(u.rank))}</td>
                                <td className="p-2 sm:p-4">
                                    <div className="flex items-center space-x-2 sm:space-x-3">
                                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-primary-600 to-accent-600 flex items-center justify-center text-white font-bold text-xs sm:text-base shrink-0">
                                            {u.username?.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-white font-medium text-sm sm:text-base truncate">{u.full_name || u.username}</p>
                                            <p className="text-dark-500 text-xs truncate">@{u.username}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-2 sm:p-4 text-right text-amber-400 font-bold text-sm sm:text-base whitespace-nowrap">⚡ {u.xp_points}</td>
                                <td className="p-4 text-right text-primary-400 font-medium hidden sm:table-cell">Lv.{u.level}</td>
                                <td className="p-4 text-right text-dark-300 hidden md:table-cell">{u.completed_lessons}</td>
                                <td className="p-4 text-right text-orange-400 hidden md:table-cell">🔥 {u.streak_days}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {leaderboard.length === 0 && (
                    <p className="text-center text-dark-500 py-10">ლიდერბორდი ცარიელია.</p>
                )}
            </div>
        </div>
    );
}
