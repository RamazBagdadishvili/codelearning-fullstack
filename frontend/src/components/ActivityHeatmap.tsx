import { useMemo } from 'react';

interface ActivityHeatmapProps {
    data?: { date: string; count: string | number }[];
}

export default function ActivityHeatmap({ data = [] }: ActivityHeatmapProps) {
    const { days, weeks, maxCount } = useMemo(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const countMap = new Map();
        let max = 0;

        if (Array.isArray(data)) {
            data.forEach(item => {
                const d = new Date(item.date);
                d.setHours(0, 0, 0, 0);
                const count = Number(item.count);
                countMap.set(d.getTime(), count);
                if (count > max) max = count;
            });
        }

        const result = [];
        // 12 კვირა * 7 დღე = 84 დღე.
        // Today is at the end, so we go from 83 days ago to 0
        for (let i = 83; i >= 0; i--) {
            const d = new Date(today);
            d.setDate(d.getDate() - i);
            const count = countMap.get(d.getTime()) || 0;
            result.push({ date: d, count });
        }

        const w = [];
        for (let i = 0; i < result.length; i += 7) {
            w.push(result.slice(i, i + 7));
        }

        return { days: result, weeks: w, maxCount: max || 10 };
    }, [data]);

    const getIntensityClass = (count: number) => {
        if (count === 0) return 'bg-dark-800/50 hover:bg-dark-700/50';
        // Normalize against max or fixed thresholds
        if (count < 3) return 'bg-primary-500/30 hover:bg-primary-500/40 border border-primary-500/10';
        if (count < 6) return 'bg-primary-500/60 hover:bg-primary-500/70 border border-primary-500/30 shadow-[0_0_8px_rgba(56,189,248,0.1)]';
        if (count < 10) return 'bg-primary-500 hover:bg-primary-400 border border-primary-400 shadow-[0_0_12px_rgba(56,189,248,0.3)]';

        return 'bg-primary-400 hover:bg-primary-300 font-bold shadow-[0_0_15px_rgba(56,189,248,0.6)] border border-primary-300';
    };

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('ka-GE', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    return (
        <div className="card p-6 border border-dark-800 bg-dark-900/40">
            <h2 className="text-lg font-bold text-white mb-5 flex items-center justify-between">
                <span>აქტივობა</span>
                <span className="text-xs text-dark-400 font-medium">ბოლო 12 კვირა</span>
            </h2>

            <div className="overflow-x-auto custom-scrollbar pb-2">
                <div className="flex gap-1.5 min-w-max">
                    {/* Y-Axis Labels */}
                    <div className="flex flex-col gap-1.5 text-[10px] text-dark-500 font-bold tracking-wider pr-3 justify-between py-1 uppercase">
                        <span>ორშ</span>
                        <span>ოთხ</span>
                        <span>პარ</span>
                        <span>კვი</span>
                    </div>

                    {/* Heatmap Grid */}
                    {weeks.map((week, wIdx) => (
                        <div key={wIdx} className="flex flex-col gap-1.5">
                            {week.map((day, dIdx) => (
                                <div
                                    key={dIdx}
                                    title={`${formatDate(day.date)}: ${day.count} ამოხსნა`}
                                    className={`w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-sm sm:rounded-[3px] transition-all cursor-pointer ${getIntensityClass(day.count)}`}
                                />
                            ))}
                        </div>
                    ))}
                </div>
            </div>

            {/* Legend */}
            <div className="mt-5 flex items-center gap-3 text-[10px] text-dark-400 font-bold uppercase tracking-wider justify-end">
                <span>ნაკლები</span>
                <div className="flex gap-1.5 opacity-80">
                    <div className="w-3.5 h-3.5 rounded-[3px] bg-dark-800/50"></div>
                    <div className="w-3.5 h-3.5 rounded-[3px] bg-primary-500/30"></div>
                    <div className="w-3.5 h-3.5 rounded-[3px] bg-primary-500/60"></div>
                    <div className="w-3.5 h-3.5 rounded-[3px] bg-primary-500"></div>
                    <div className="w-3.5 h-3.5 rounded-[3px] bg-primary-400"></div>
                </div>
                <span>მეტი</span>
            </div>
        </div>
    );
}
