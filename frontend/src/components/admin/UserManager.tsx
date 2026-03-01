import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { HiCog, HiPencil } from 'react-icons/hi';
import api from '../../api/axios';
import { User, Course } from '../../types';
import { useConfirm } from '../../hooks/useConfirm';
import { ManageCoursesModal } from './ManageCoursesModal';

interface UserManagerProps {
    users: User[];
    allCourses: Course[];
    currentUserId: string | null;
    onRefresh: () => void;
}

export const UserManager: React.FC<UserManagerProps> = ({ users, allCourses, currentUserId, onRefresh }) => {
    const [search, setSearch] = useState('');
    const [roleFilter, setRoleFilter] = useState<string>('all');
    const [editingXp, setEditingXp] = useState<string | null>(null);
    const [xpValue, setXpValue] = useState<number>(0);
    const [confirmAction, setConfirmAction] = useState<{ type: string; user: User } | null>(null);
    const [managingUser, setManagingUser] = useState<User | null>(null);
    const [deleteConfirmName, setDeleteConfirmName] = useState('');
    const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
    const [isBulkLoading, setIsBulkLoading] = useState(false);
    const { confirm } = useConfirm();

    const filteredUsers = (users || []).filter(u => {
        const matchRole = roleFilter === 'all' || u.role === roleFilter;
        const matchSearch = !search || u.username?.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase());
        return matchRole && matchSearch;
    });

    const handleRoleChange = async (userId: string, newRole: string) => {
        try {
            const { data } = await api.put(`/admin/users/${userId}/role`, { role: newRole });
            toast.success(data.message);
            onRefresh();
        } catch (err: any) {
            toast.error(err.response?.data?.error || 'როლის შეცვლა ვერ მოხერხდა.');
        }
    };

    const handleToggleActive = async (userId: string) => {
        try {
            const { data } = await api.put(`/admin/users/${userId}/toggle-active`);
            toast.success(data.message);
            onRefresh();
        } catch (err: any) {
            toast.error(err.response?.data?.error || 'სტატუსის შეცვლა ვერ მოხერხდა.');
        }
        setConfirmAction(null);
    };

    const handleDeleteUser = async (userId: string) => {
        try {
            const { data } = await api.delete(`/admin/users/${userId}`);
            toast.success(data.message);
            onRefresh();
        } catch (err: any) {
            toast.error(err.response?.data?.error || 'წაშლა ვერ მოხერხდა.');
        }
        setConfirmAction(null);
        setDeleteConfirmName('');
    };

    const handleLevelChange = async (userId: string, newLevelValue: number) => {
        const newLevel = Math.max(1, Math.min(200, newLevelValue));
        try {
            const { data } = await api.put(`/admin/users/${userId}/level`, { level: newLevel });
            toast.success(data.message);
            onRefresh();
        } catch (err: any) {
            toast.error(err.response?.data?.error || 'Level-ის შეცვლა ვერ მოხერხდა.');
        }
    };

    const handleXpSave = async (userId: string) => {
        try {
            const { data } = await api.put(`/admin/users/${userId}/xp`, { xp: xpValue });
            toast.success(data.message);
            setEditingXp(null);
            onRefresh();
        } catch (err: any) {
            toast.error(err.response?.data?.error || 'XP-ის შეცვლა ვერ მოხერხდა.');
        }
    };

    const handleBulkAction = async (action: string, value?: string) => {
        if (selectedUserIds.length === 0) return;
        if (action === 'delete' && !(await confirm(`ნამდვილად გსურთ ${selectedUserIds.length} მომხმარებლის სამუდამოდ წაშლა?`))) return;

        setIsBulkLoading(true);
        try {
            const { data } = await api.post('/admin/users/bulk', { userIds: selectedUserIds, action, value });
            toast.success(data.message);
            setSelectedUserIds([]);
            onRefresh();
        } catch (err: any) {
            toast.error(err.response?.data?.error || 'მოქმედება ვერ შესრულდა.');
        } finally {
            setIsBulkLoading(false);
        }
    };

    const toggleSelectUser = (userId: string) => {
        setSelectedUserIds(prev =>
            prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
        );
    };

    const toggleSelectAll = () => {
        if (selectedUserIds.length === filteredUsers.length) {
            setSelectedUserIds([]);
        } else {
            setSelectedUserIds(filteredUsers.map(u => u.id));
        }
    };

    const ROLE_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
        admin: { label: '👑 ადმინი', color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/30' },
        instructor: { label: '🎓 ინსტრუქტორი', color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/30' },
        student: { label: '📚 სტუდენტი', color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/30' },
    };

    return (
        <div className="space-y-4">
            {/* ფილტრაცია და ძებნა */}
            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center bg-dark-800 p-4 rounded-xl border border-dark-700">
                <div className="relative flex-1 w-full">
                    <input
                        type="text" value={search} onChange={e => setSearch(e.target.value)}
                        placeholder="🔍 მოძებნე სახელით ან ელ-ფოსტით..."
                        className="input-field w-full pl-4 pr-10 bg-dark-900 border-dark-600"
                    />
                    {search && (
                        <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-400 hover:text-white">✕</button>
                    )}
                </div>
                <div className="flex space-x-1 bg-dark-900 rounded-lg p-1 border border-dark-700">
                    {[
                        { key: 'all', label: 'ყველა', count: users.length },
                        { key: 'student', label: '📚', count: users.filter(u => u.role === 'student').length },
                        { key: 'admin', label: '👑', count: users.filter(u => u.role === 'admin').length },
                        { key: 'instructor', label: '🎓', count: users.filter(u => u.role === 'instructor').length },
                    ].map(f => (
                        <button key={f.key} onClick={() => setRoleFilter(f.key)}
                            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${roleFilter === f.key ? 'bg-primary-600 text-white' : 'text-dark-400 hover:text-white hover:bg-dark-700'}`}>
                            {f.label} <span className="text-xs opacity-70">({f.count})</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Bulk Actions Bar */}
            {selectedUserIds.length > 0 && (
                <div className="flex items-center justify-between bg-primary-600/10 border border-primary-500/30 p-3 rounded-xl animate-fade-in shadow-lg">
                    <div className="flex items-center space-x-4">
                        <span className="text-primary-400 font-bold text-sm">✓ მონიშნულია {selectedUserIds.length}</span>
                        <div className="h-4 w-px bg-dark-600" />
                        <div className="flex items-center gap-2">
                            <button onClick={() => handleBulkAction('toggle-active')} disabled={isBulkLoading}
                                className="px-3 py-1.5 bg-dark-800 hover:bg-dark-700 text-white text-xs rounded-lg transition-colors border border-dark-600">
                                სტატუსის შეცვლა
                            </button>
                            <div className="relative group">
                                <button className="px-3 py-1.5 bg-dark-800 hover:bg-dark-700 text-white text-xs rounded-lg transition-colors border border-dark-600">
                                    როლის შეცვლა ▼
                                </button>
                                <div className="absolute top-full left-0 mt-2 w-40 bg-dark-800 border border-dark-700 rounded-xl shadow-2xl opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all z-20 overflow-hidden">
                                    <button onClick={() => handleBulkAction('role', 'student')} className="w-full text-left px-4 py-2 text-xs hover:bg-dark-700 text-dark-300 hover:text-white">📚 სტუდენტი</button>
                                    <button onClick={() => handleBulkAction('role', 'instructor')} className="w-full text-left px-4 py-2 text-xs hover:bg-dark-700 text-dark-300 hover:text-white">🎓 ინსტრუქტორი</button>
                                    <button onClick={() => handleBulkAction('role', 'admin')} className="w-full text-left px-4 py-2 text-xs hover:bg-dark-700 text-dark-300 hover:text-white">👑 ადმინი</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <button onClick={() => handleBulkAction('delete')} disabled={isBulkLoading}
                        className="px-3 py-1.5 bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white text-xs rounded-lg transition-colors border border-red-500/30 font-bold">
                        🗑️ მონიშნულების წაშლა
                    </button>
                </div>
            )}

            {/* მომხმარებლების ცხრილი */}
            <div className="card overflow-hidden border border-dark-700">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-dark-700 bg-dark-800/50">
                                <th className="p-4 text-left w-10">
                                    <input type="checkbox"
                                        checked={selectedUserIds.length > 0 && selectedUserIds.length === filteredUsers.length}
                                        onChange={toggleSelectAll}
                                        className="w-4 h-4 rounded border-dark-600 bg-dark-900 text-primary-600 focus:ring-primary-500" />
                                </th>
                                <th className="text-left p-4 text-dark-400 text-xs font-semibold uppercase tracking-wider">მომხმარებელი</th>
                                <th className="text-left p-4 text-dark-400 text-xs font-semibold uppercase tracking-wider hidden md:table-cell">ელ-ფოსტა</th>
                                <th className="text-center p-4 text-dark-400 text-xs font-semibold uppercase tracking-wider">როლი</th>
                                <th className="text-center p-4 text-dark-400 text-xs font-semibold uppercase tracking-wider">Level</th>
                                <th className="text-center p-4 text-dark-400 text-xs font-semibold uppercase tracking-wider">XP</th>
                                <th className="text-center p-4 text-dark-400 text-xs font-semibold uppercase tracking-wider">სტატუსი</th>
                                <th className="text-center p-4 text-dark-400 text-xs font-semibold uppercase tracking-wider">მოქმედებები</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.map(u => {
                                const rc = ROLE_CONFIG[u.role] || ROLE_CONFIG.student;
                                return (
                                    <tr key={u.id} className={`group border-b border-dark-800/50 hover:bg-dark-800/30 transition-colors ${u.role === 'admin' ? 'bg-amber-500/5' : ''} ${!u.is_active ? 'opacity-50' : ''} ${selectedUserIds.includes(u.id) ? 'bg-primary-600/5' : ''}`}>
                                        <td className="p-4">
                                            <input type="checkbox"
                                                checked={selectedUserIds.includes(u.id)}
                                                onChange={() => toggleSelectUser(u.id)}
                                                className="w-4 h-4 rounded border-dark-600 bg-dark-900 text-primary-600 focus:ring-primary-500" />
                                        </td>
                                        <td className="p-4 hidden sm:table-cell">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-dark-700 to-dark-800 flex items-center justify-center text-white font-bold border border-dark-600 shadow-inner">
                                                    {u.username?.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <div className="text-white font-medium flex items-center gap-2">
                                                        {u.full_name || u.username}
                                                        {u.role === 'admin' && <HiCog className="text-amber-500 w-3 h-3" />}
                                                    </div>
                                                    <div className="text-dark-500 text-xs">{u.created_at ? new Date(u.created_at).toLocaleDateString('ka-GE') : 'N/A'}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4 text-dark-400 text-sm hidden sm:table-cell">{u.email}</td>

                                        <td className="p-4 sm:hidden" colSpan={7}>
                                            <div className="flex flex-col space-y-3 p-3 bg-dark-800 rounded-lg border border-dark-700">
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-8 h-8 rounded-full bg-dark-700 flex items-center justify-center text-white font-bold text-xs">{u.username?.charAt(0).toUpperCase()}</div>
                                                    <div className="min-w-0 flex-1">
                                                        <div className="text-white text-sm font-bold truncate">{u.full_name || u.username}</div>
                                                        <div className="text-dark-500 text-[10px] truncate">{u.email}</div>
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-2 gap-2 mt-2">
                                                    <div className="space-y-1">
                                                        <label className="text-dark-500 text-[9px] uppercase font-bold">Role</label>
                                                        <select value={u.role} onChange={e => handleRoleChange(u.id, e.target.value)}
                                                            className={`text-[10px] w-full px-2 py-1 rounded border cursor-pointer bg-transparent font-medium transition-colors ${rc.bg} ${rc.color}`}>
                                                            <option value="student" className="bg-dark-900 text-white">სტუდენტი</option>
                                                            <option value="instructor" className="bg-dark-900 text-white">ინსტრუქტორი</option>
                                                            <option value="admin" className="bg-dark-900 text-white">ადმინი</option>
                                                        </select>
                                                    </div>
                                                    <div className="space-y-1">
                                                        <label className="text-dark-500 text-[9px] uppercase font-bold text-center block">Level</label>
                                                        <div className="flex justify-center">
                                                            <input type="number" min="1" max="200" defaultValue={u.level}
                                                                onBlur={(e) => { const val = parseInt(e.target.value); if (val && val !== u.level) handleLevelChange(u.id, val); }}
                                                                onKeyDown={(e) => {
                                                                    if (e.key === 'Enter') {
                                                                        const val = parseInt((e.target as HTMLInputElement).value);
                                                                        if (val && val !== u.level) handleLevelChange(u.id, val);
                                                                        (e.target as HTMLInputElement).blur();
                                                                    }
                                                                }}
                                                                className="w-full text-center text-xs py-1 rounded bg-dark-900 border border-dark-700 text-primary-400 font-bold" />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-2 gap-2 mt-2">
                                                    <div className="space-y-1">
                                                        <label className="text-dark-500 text-[9px] uppercase font-bold">XP</label>
                                                        {editingXp === u.id ? (
                                                            <div className="flex items-center space-x-1">
                                                                <input type="number" value={xpValue} onChange={e => setXpValue(parseInt(e.target.value) || 0)}
                                                                    className="w-full text-center text-xs py-1 rounded bg-dark-900 border border-primary-500/50 text-white" autoFocus />
                                                                <button onClick={() => handleXpSave(u.id)} className="text-green-400 hover:text-green-300 text-xs font-bold">✓</button>
                                                                <button onClick={() => setEditingXp(null)} className="text-dark-400 hover:text-white text-xs">✕</button>
                                                            </div>
                                                        ) : (
                                                            <div className="flex items-center justify-center space-x-1">
                                                                <span className="text-amber-400 font-bold text-xs">⚡ {u.xp_points || 0}</span>
                                                                <button onClick={() => { setEditingXp(u.id); setXpValue(u.xp_points || 0); }}
                                                                    className="p-1 rounded-lg bg-dark-800 text-dark-400 hover:text-primary-400 hover:bg-dark-700 transition-all">
                                                                    <HiPencil className="w-3 h-3" />
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="space-y-1">
                                                        <label className="text-dark-500 text-[9px] uppercase font-bold text-center block">Status</label>
                                                        <div className="flex justify-center">
                                                            <span className={`inline-flex items-center text-[10px] px-2 py-0.5 rounded-full font-medium ${u.is_active ? 'bg-green-500/10 text-green-400 border border-green-500/30' : 'bg-red-500/10 text-red-400 border border-red-500/30'}`}>
                                                                <span className={`w-1 h-1 rounded-full mr-1 ${u.is_active ? 'bg-green-400' : 'bg-red-400'}`} />
                                                                {u.is_active ? 'აქტიური' : 'დაბლოკილი'}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex justify-center space-x-1 mt-3">
                                                    <button onClick={() => setManagingUser(u)}
                                                        className="px-2 py-1 rounded-lg text-xs font-medium bg-dark-700 hover:bg-primary-500/20 text-primary-400 hover:text-primary-300 transition-colors"
                                                        title="კურსების მართვა">
                                                        📚
                                                    </button>
                                                    <button onClick={() => setConfirmAction({ type: 'toggle', user: u })}
                                                        className={`px-2 py-1 rounded-lg text-xs font-medium transition-colors ${u.is_active ? 'bg-dark-700 hover:bg-orange-500/20 text-orange-400 hover:text-orange-300' : 'bg-dark-700 hover:bg-green-500/20 text-green-400 hover:text-green-300'}`}
                                                        title={u.is_active ? 'დაბლოკვა' : 'განბლოკვა'}>
                                                        {u.is_active ? '🔓' : '🔒'}
                                                    </button>
                                                    <button onClick={() => setConfirmAction({ type: 'delete', user: u })}
                                                        className="px-2 py-1 rounded-lg text-xs font-medium bg-dark-700 hover:bg-red-500/20 text-red-500 hover:text-red-400 transition-colors"
                                                        title="წაშლა">
                                                        🗑️
                                                    </button>
                                                </div>
                                            </div>
                                        </td>

                                        <td className="p-4 text-center hidden sm:table-cell">
                                            <select value={u.role} onChange={e => handleRoleChange(u.id, e.target.value)}
                                                className={`text-xs px-2 py-1.5 rounded-lg border cursor-pointer bg-transparent font-medium transition-colors ${rc.bg} ${rc.color}`}>
                                                <option value="student" className="bg-dark-900 text-white">📚 სტუდენტი</option>
                                                <option value="instructor" className="bg-dark-900 text-white">🎓 ინსტრუქტორი</option>
                                                <option value="admin" className="bg-dark-900 text-white">👑 ადმინი</option>
                                            </select>
                                        </td>
                                        <td className="p-4 text-center hidden sm:table-cell">
                                            <div className="flex items-center justify-center">
                                                <input
                                                    type="number"
                                                    min="1"
                                                    max="200"
                                                    defaultValue={u.level}
                                                    onBlur={(e) => {
                                                        const val = parseInt(e.target.value);
                                                        if (val && val !== u.level) handleLevelChange(u.id, val);
                                                    }}
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter') {
                                                            const val = parseInt((e.target as HTMLInputElement).value);
                                                            if (val && val !== u.level) handleLevelChange(u.id, val);
                                                            (e.target as HTMLInputElement).blur();
                                                        }
                                                    }}
                                                    className="w-14 text-center text-sm py-1 rounded bg-dark-900 border border-dark-700 text-primary-400 font-bold focus:border-primary-500 focus:outline-none transition-colors"
                                                />
                                            </div>
                                        </td>
                                        <td className="p-4 text-center hidden sm:table-cell">
                                            {editingXp === u.id ? (
                                                <div className="flex items-center justify-center space-x-1">
                                                    <input type="number" value={xpValue} onChange={e => setXpValue(parseInt(e.target.value) || 0)}
                                                        className="w-20 text-center text-sm py-1 rounded bg-dark-900 border border-primary-500/50 text-white" autoFocus />
                                                    <button onClick={() => handleXpSave(u.id)} className="text-green-400 hover:text-green-300 text-sm font-bold">✓</button>
                                                    <button onClick={() => setEditingXp(null)} className="text-dark-400 hover:text-white text-sm">✕</button>
                                                </div>
                                            ) : (
                                                <div className="flex items-center justify-center space-x-2">
                                                    <span className="text-amber-400 font-bold text-sm">⚡ {u.xp_points || 0}</span>
                                                    <button onClick={() => { setEditingXp(u.id); setXpValue(u.xp_points || 0); }}
                                                        className="p-1.5 rounded-lg bg-dark-800 text-dark-400 hover:text-primary-400 hover:bg-dark-700 transition-all opacity-0 group-hover:opacity-100">
                                                        <HiPencil className="w-3.5 h-3.5" />
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                        <td className="p-4 text-center hidden sm:table-cell">
                                            <span className={`inline-flex items-center text-xs px-2.5 py-1 rounded-full font-medium ${u.is_active ? 'bg-green-500/10 text-green-400 border border-green-500/30' : 'bg-red-500/10 text-red-400 border border-red-500/30'}`}>
                                                <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${u.is_active ? 'bg-green-400' : 'bg-red-400'}`} />
                                                {u.is_active ? 'აქტიური' : 'დაბლოკილი'}
                                            </span>
                                        </td>
                                        <td className="p-4 text-center">
                                            <div className="flex items-center justify-center space-x-1">
                                                <button onClick={() => setManagingUser(u)}
                                                    className="px-2.5 py-1.5 rounded-lg text-xs font-medium bg-dark-700 hover:bg-primary-500/20 text-primary-400 hover:text-primary-300 transition-colors"
                                                    title="კურსების მართვა">
                                                    📚
                                                </button>
                                                <button onClick={() => setConfirmAction({ type: 'toggle', user: u })}
                                                    className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${u.is_active ? 'bg-dark-700 hover:bg-orange-500/20 text-orange-400 hover:text-orange-300' : 'bg-dark-700 hover:bg-green-500/20 text-green-400 hover:text-green-300'}`}
                                                    title={u.is_active ? 'დაბლოკვა' : 'განბლოკვა'}>
                                                    {u.is_active ? '🔓' : '🔒'}
                                                </button>
                                                <button onClick={() => setConfirmAction({ type: 'delete', user: u })}
                                                    className="px-2.5 py-1.5 rounded-lg text-xs font-medium bg-dark-700 hover:bg-red-500/20 text-red-500 hover:text-red-400 transition-colors"
                                                    title="წაშლა">
                                                    🗑️
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                    {filteredUsers.length === 0 && (
                        <div className="text-center py-12 text-dark-400">მომხმარებლები არ მოიძებნა.</div>
                    )}
                </div>
                <div className="bg-dark-800/50 px-4 py-3 border-t border-dark-700 text-xs text-dark-400">
                    სულ: <span className="text-white font-medium">{filteredUsers.length}</span> მომხმარებელი {roleFilter !== 'all' ? `(ფილტრი: ${roleFilter})` : ''}
                </div>
            </div>

            {/* Confirmation Modal */}
            {confirmAction && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
                    <div className="bg-dark-800 rounded-2xl p-6 max-w-md w-full mx-4 border border-dark-600 shadow-2xl">
                        <h3 className="text-lg font-bold text-white mb-3">
                            {confirmAction.type === 'delete' ? '⚠️ მომხმარებლის სრულად წაშლა' : confirmAction.user.is_active ? '🔒 დაბლოკვა' : '🔓 განბლოკვა'}
                        </h3>
                        <div className="text-dark-300 mb-6">
                            {confirmAction.type === 'delete' ? (
                                <div className="space-y-4">
                                    <p className="text-red-400 font-medium">ყურადღება: ეს ქმედება შეუქცევადია. წაიშლება მომხმარებლის ყველა მონაცემი, პროგრესი და სუბმიშენი.</p>
                                    <p>დასადასტურებლად ჩაწერეთ მომხმარებლის სახელი: <strong className="text-white select-all">{confirmAction.user.username}</strong></p>
                                    <input
                                        type="text"
                                        value={deleteConfirmName}
                                        onChange={(e) => setDeleteConfirmName(e.target.value)}
                                        className="input-field w-full mt-2 bg-dark-900 border-dark-600"
                                        placeholder="მომხმარებლის სახელი..."
                                    />
                                </div>
                            ) : confirmAction.user.is_active ? (
                                `ნამდვილად გსურთ "${confirmAction.user.username}"-ის დაბლოკვა? იგი ვეღარ შევა სისტემაში დროებით.`
                            ) : (
                                `გსურთ "${confirmAction.user.username}"-ის განბლოკვა შავ-სიიდან?`
                            )}
                        </div>
                        <div className="flex space-x-3">
                            <button onClick={() => {
                                if (confirmAction.type === 'delete') handleDeleteUser(confirmAction.user.id);
                                else handleToggleActive(confirmAction.user.id);
                            }}
                                disabled={confirmAction.type === 'delete' && deleteConfirmName !== confirmAction.user.username}
                                className={`flex-1 py-2.5 rounded-xl font-bold text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${confirmAction.type === 'delete' || (confirmAction.type === 'toggle' && confirmAction.user.is_active) ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-green-600 hover:bg-green-700 text-white'}`}>
                                {confirmAction.type === 'delete' ? 'სამუდამოდ წაშლა' : confirmAction.user.is_active ? 'დაბლოკვა' : 'განბლოკვა'}
                            </button>
                            <button onClick={() => { setConfirmAction(null); setDeleteConfirmName(''); }}
                                className="flex-1 py-2.5 rounded-xl font-bold text-sm bg-dark-700 hover:bg-dark-600 text-dark-300 hover:text-white transition-colors">
                                გაუქმება
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {managingUser && (
                <ManageCoursesModal
                    user={managingUser}
                    allCourses={allCourses}
                    onClose={() => setManagingUser(null)}
                />
            )}
        </div>
    );
};
