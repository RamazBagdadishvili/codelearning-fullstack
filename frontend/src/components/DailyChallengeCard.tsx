import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { HiLightningBolt, HiArrowRight, HiClock } from 'react-icons/hi';

interface DailyChallenge {
    id: string;
    lesson_id: string;
    title: string;
    slug: string;
    course_slug: string;
    course_title: string;
    xp_reward: number;
    xp_multiplier: number;
}

export default function DailyChallengeCard() {
    const [challenge, setChallenge] = useState<DailyChallenge | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchDaily = async () => {
            try {
                const { data } = await api.get('/lessons/daily');
                setChallenge(data.challenge);
            } catch (err) {
                console.error('Failed to fetch daily challenge');
            } finally {
                setIsLoading(false);
            }
        };
        fetchDaily();
    }, []);

    if (isLoading) return (
        <div className="w-full h-48 bg-dark-900/50 rounded-3xl animate-pulse border border-dark-800" />
    );

    if (!challenge) return null;

    return (
        <div className="relative group overflow-hidden">
            {/* Background Glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary-600/20 to-accent-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-2xl" />

            <div className="relative bg-dark-900/80 backdrop-blur-xl border border-primary-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden">
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <HiLightningBolt className="w-32 h-32 -mr-8 -mt-8 text-primary-500" />
                </div>

                <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10">
                    {/* XP Badge */}
                    <div className="flex-shrink-0 relative">
                        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-600 flex flex-col items-center justify-center text-white shadow-lg shadow-primary-500/30 transform group-hover:scale-110 transition-transform duration-500">
                            <span className="text-2xl sm:text-3xl font-black">2X</span>
                            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest">XP</span>
                        </div>
                        <div className="absolute -bottom-2 -right-2 bg-dark-950 px-2 py-1 rounded-lg border border-primary-500/30 text-[10px] font-black text-primary-400 animate-pulse">
                            ACTIVE
                        </div>
                    </div>

                    <div className="flex-1 text-center md:text-left">
                        <div className="flex flex-wrap justify-center md:justify-start items-center gap-3 mb-3">
                            <span className="px-3 py-1 bg-primary-500/10 text-primary-400 text-[10px] font-black uppercase tracking-widest rounded-full border border-primary-500/20 flex items-center gap-1.5">
                                <HiLightningBolt className="w-3 h-3" /> Daily Challenge
                            </span>
                            <span className="text-dark-500 text-xs flex items-center gap-1">
                                <HiClock className="w-3.5 h-3.5" /> სრულდება 24 სთ-ში
                            </span>
                        </div>

                        <h2 className="text-xl sm:text-2xl font-black text-white mb-2 leading-tight">
                            {challenge.title}
                        </h2>
                        <p className="text-dark-400 text-sm sm:text-base mb-1">
                            კურსიდან: <span className="text-dark-200 font-bold">{challenge.course_title}</span>
                        </p>
                        <div className="text-primary-400 text-sm font-bold">
                            ჯილდო: <span className="text-white bg-primary-500/20 px-2 py-0.5 rounded ml-1">{challenge.xp_reward * challenge.xp_multiplier} XP</span>
                        </div>
                    </div>

                    <div className="flex-shrink-0 w-full md:w-auto">
                        <Link
                            to={`/lesson/${challenge.course_slug}/${challenge.slug}`}
                            className="w-full btn-primary px-8 py-4 flex items-center justify-center gap-2 text-lg group/btn shadow-xl shadow-primary-500/20"
                        >
                            დაწყება
                            <HiArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
