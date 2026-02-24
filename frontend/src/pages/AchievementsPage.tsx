import { useEffect, useState } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';

export default function AchievementsPage() {
    const [achievements, setAchievements] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetch = async () => {
            try {
                // მიღწევების შემოწმება
                await api.post('/achievements/check');
                const { data } = await api.get('/achievements');
                setAchievements(data.achievements);
            } catch { }
            setIsLoading(false);
        };
        fetch();
    }, []);

    const earned = (achievements || []).filter(a => a.earned);
    const notEarned = (achievements || []).filter(a => !a.earned);

    if (isLoading) {
        return <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" /></div>;
    }

    return (
        <div className="page-container animate-fade-in">
            <div className="text-center mb-8">
                <h1 className="section-title">🏅 მიღწევები</h1>
                <p className="text-dark-400">მოაგროვეთ ბეჯები სწავლის პროცესში</p>
                <p className="text-primary-400 mt-2">{earned.length}/{achievements.length} მოპოვებული</p>
            </div>

            {/* პროგრეს ბარი */}
            <div className="card p-6 mb-8">
                <div className="flex justify-between text-sm text-dark-400 mb-2">
                    <span>მიღწევების პროგრესი</span>
                    <span>{Math.round((earned.length / Math.max(achievements.length, 1)) * 100)}%</span>
                </div>
                <div className="progress-bar h-3">
                    <div className="progress-fill" style={{ width: `${(earned.length / Math.max(achievements.length, 1)) * 100}%` }} />
                </div>
            </div>

            {/* მოპოვებული */}
            {earned.length > 0 && (
                <div className="mb-10">
                    <h2 className="text-xl font-bold text-white mb-4">✅ მოპოვებული ({earned.length})</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {earned.map(a => (
                            <div key={a.id} className="card p-5 border-amber-500/20 bg-amber-500/5">
                                <div className="flex items-center space-x-4">
                                    <div className="w-14 h-14 rounded-xl flex items-center justify-center text-3xl"
                                        style={{ backgroundColor: `${a.badge_color}20` }}>
                                        {a.badge_icon}
                                    </div>
                                    <div>
                                        <h3 className="text-white font-semibold">{a.title}</h3>
                                        <p className="text-dark-400 text-sm">{a.description}</p>
                                        <div className="flex items-center space-x-2 mt-1">
                                            <span className="text-amber-400 text-sm font-medium">⚡ +{a.xp_reward} XP</span>
                                            <span className="text-dark-600 text-xs">
                                                {new Date(a.earned_at).toLocaleDateString('ka-GE')}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* მოუპოვებელი */}
            {notEarned.length > 0 && (
                <div>
                    <h2 className="text-xl font-bold text-white mb-4">🔒 მოუპოვებელი ({notEarned.length})</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {notEarned.map(a => (
                            <div key={a.id} className="card p-5 opacity-60">
                                <div className="flex items-center space-x-4">
                                    <div className="w-14 h-14 rounded-xl bg-dark-800 flex items-center justify-center text-3xl grayscale">
                                        {a.badge_icon}
                                    </div>
                                    <div>
                                        <h3 className="text-dark-300 font-semibold">{a.title}</h3>
                                        <p className="text-dark-500 text-sm">{a.description}</p>
                                        <span className="text-dark-500 text-sm">⚡ +{a.xp_reward} XP</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
