import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import api from '../../api/axios';
import { useConfirm } from '../../hooks/useConfirm';

export const AchievementsTab: React.FC = () => {
    const [achievements, setAchievements] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const { confirm, ConfirmDialog } = useConfirm();

    const initForm = { title: '', description: '', badgeIcon: '🏆', badgeColor: '#FFD700', criteriaType: 'lessons_completed', criteriaValue: 5, xpReward: 50, category: 'general', sortOrder: 0, isSecret: false };
    const [form, setForm] = useState(initForm);

    const fetchAchievements = async () => {
        try {
            const res = await api.get('/admin/achievements');
            setAchievements(res.data.achievements);
        } catch (err) { toast.error('მიღწევების ჩატვირთვა ვერ მოხერხდა'); }
        finally { setIsLoading(false); }
    };

    useEffect(() => { fetchAchievements(); }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingId) {
                await api.put(`/admin/achievements/${editingId}`, form);
                toast.success('განახლდა!');
            } else {
                await api.post('/admin/achievements', form);
                toast.success('შეიქმნა!');
            }
            setForm(initForm);
            setIsCreating(false);
            setEditingId(null);
            fetchAchievements();
        } catch (err: any) { toast.error(err.response?.data?.error || 'შეცდომა'); }
    };

    const handleDelete = async (id: string, title: string) => {
        if (!(await confirm(`ნამდვილად გსურთ წაშალოთ? "${title}"?`))) return;
        try {
            await api.delete(`/admin/achievements/${id}`);
            toast.success('წაიშალა!');
            fetchAchievements();
        } catch (err) { toast.error('წაშლა ვერ მოხერხდა'); }
    };

    if (isLoading) return <div className="text-center py-10 text-dark-400">იტვირთება...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-dark-800 p-4 rounded-xl border border-dark-700">
                <h2 className="text-xl font-bold text-white">არსებული მიღწევები ({achievements.length})</h2>
                <button onClick={() => { setIsCreating(!isCreating); setEditingId(null); setForm(initForm); }} className="btn-primary py-2 px-4 text-sm">
                    {isCreating ? 'გაუქმება' : '+ ახალი მიღწევა'}
                </button>
            </div>

            {(isCreating || editingId) && (
                <div className={`card p-6 border ${editingId ? 'border-amber-500/30' : 'border-primary-500/30'}`}>
                    <h3 className="text-lg text-white font-bold mb-4">{editingId ? 'რედაქტირება' : 'შექმნა'}</h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div><label className="text-sm text-dark-300">სათაური</label><input required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="input-field" /></div>
                            <div><label className="text-sm text-dark-300">აიქონი</label><input required value={form.badgeIcon} onChange={e => setForm({ ...form, badgeIcon: e.target.value })} className="input-field" /></div>
                            <div><label className="text-sm text-dark-300">ტიპი</label>
                                <select value={form.criteriaType} onChange={e => setForm({ ...form, criteriaType: e.target.value })} className="input-field">
                                    <option value="lessons_completed">ლექციების დასრულება</option>
                                    <option value="courses_completed">კურსების დასრულება</option>
                                    <option value="xp_earned">XP დაგროვება</option>
                                    <option value="streak_days">Streak დღეები</option>
                                </select>
                            </div>
                            <div><label className="text-sm text-dark-300">მნიშვნელობა (მაგ: 5)</label><input required type="number" value={form.criteriaValue} onChange={e => setForm({ ...form, criteriaValue: +e.target.value })} className="input-field" /></div>
                            <div><label className="text-sm text-dark-300">XP ჯილდო</label><input required type="number" value={form.xpReward} onChange={e => setForm({ ...form, xpReward: +e.target.value })} className="input-field" /></div>
                            <div>
                                <label className="text-sm text-dark-300">ფერი</label>
                                <div className="flex space-x-2">
                                    <input type="color" value={form.badgeColor} onChange={e => setForm({ ...form, badgeColor: e.target.value })} className="h-10 cursor-pointer" />
                                    <input value={form.badgeColor} onChange={e => setForm({ ...form, badgeColor: e.target.value })} className="input-field flex-1" />
                                </div>
                            </div>
                            <div className="flex items-center space-x-2 bg-dark-900/50 p-3 rounded-xl border border-dark-700">
                                <input type="checkbox" id="isSecret" checked={form.isSecret} onChange={e => setForm({ ...form, isSecret: e.target.checked })} className="w-4 h-4 rounded border-dark-600 bg-dark-900 text-primary-600 focus:ring-primary-500" />
                                <label htmlFor="isSecret" className="text-sm text-white font-medium cursor-pointer">საიდუმლო მიღწევა (Secret)</label>
                            </div>
                            <div className="md:col-span-2"><label className="text-sm text-dark-300">აღწერა</label><textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="input-field" /></div>
                        </div>
                        <button type="submit" className={`w-full py-2.5 rounded-xl font-bold text-white ${editingId ? 'bg-amber-600' : 'btn-primary'}`}>{editingId ? 'განახლება' : 'შექმნა'}</button>
                    </form>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {achievements.map((ach) => (
                    <div key={ach.id} className="card p-5 border border-dark-700 flex flex-col pt-8 relative">
                        <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-14 h-14 rounded-full flex items-center justify-center text-3xl shadow-lg border-4 border-dark-900" style={{ backgroundColor: ach.badge_color }}>
                            {ach.badge_icon}
                        </div>
                        <h3 className="text-center text-white font-bold text-lg mt-2">{ach.title}</h3>
                        <p className="text-center text-dark-400 text-sm mb-4">{ach.description}</p>
                        <div className="bg-dark-900 rounded-lg p-3 text-xs text-dark-300 space-y-1 mb-4 flex-1">
                            <div className="flex justify-between"><span>ტიპი:</span> <span className="text-white">{ach.criteria_type} = {ach.criteria_value}</span></div>
                            <div className="flex justify-between"><span>ჯილდო:</span> <span className="text-amber-400">⚡ {ach.xp_reward} XP</span></div>
                            <div className="flex justify-between"><span>აქვთ:</span> <span className="text-primary-400">{ach.earned_count} მომხმარებელს</span></div>
                            {ach.is_secret && <div className="text-[10px] text-amber-500 font-bold uppercase tracking-wider mt-1 flex items-center gap-1">🤫 საიდუმლო</div>}
                        </div>
                        <div className="flex space-x-2 mt-auto">
                            <button onClick={() => { setEditingId(ach.id); setForm({ title: ach.title, description: ach.description, badgeIcon: ach.badge_icon, badgeColor: ach.badge_color, criteriaType: ach.criteria_type, criteriaValue: ach.criteria_value, xpReward: ach.xp_reward, category: ach.category, sortOrder: ach.sort_order, isSecret: ach.is_secret }); setIsCreating(false); }} className="flex-1 bg-dark-700 hover:bg-amber-500/20 text-amber-400 py-1.5 rounded-lg text-sm transition-colors">✏️ რედაქტირება</button>
                            <button onClick={() => handleDelete(ach.id, ach.title)} className="bg-dark-700 hover:bg-red-500/20 text-red-500 px-3 py-1.5 rounded-lg transition-colors">🗑️</button>
                        </div>
                    </div>
                ))}
            </div>
            {ConfirmDialog}
        </div>
    );
};
