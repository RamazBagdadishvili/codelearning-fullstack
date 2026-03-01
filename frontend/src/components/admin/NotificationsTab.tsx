import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import api from '../../api/axios';
import { User } from '../../types';

interface NotificationsTabProps {
    users: User[];
}

export const NotificationsTab: React.FC<NotificationsTabProps> = ({ users }) => {
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');
    const [targetUserId, setTargetUserId] = useState('all');

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (targetUserId === 'all') {
                const res = await api.post('/admin/notifications/broadcast', { title, message, type: 'announcement' });
                toast.success(res.data.message);
            } else {
                await api.post('/admin/notifications/send', { userId: targetUserId, title, message, type: 'admin_message' });
                toast.success('შეტყობინება გაიგზავნა!');
            }
            setTitle('');
            setMessage('');
        } catch (err: any) {
            toast.error(err.response?.data?.error || 'შეცდომა გაგზავნისას');
        }
    };

    return (
        <div className="card p-6 border border-dark-700">
            <h2 className="text-xl font-bold text-white mb-6">🔔 შეტყობინების გაგზავნა</h2>
            <form onSubmit={handleSend} className="space-y-4 max-w-2xl">
                <div>
                    <label className="block text-dark-300 text-sm mb-1">ადრესატი</label>
                    <select value={targetUserId} onChange={(e) => setTargetUserId(e.target.value)} className="input-field">
                        <option value="all">📢 ყველას (Broadcast)</option>
                        {users.map(u => (
                            <option key={u.id} value={u.id}>{u.username} ({u.email})</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-dark-300 text-sm mb-1">სათაური</label>
                    <input required value={title} onChange={(e) => setTitle(e.target.value)} className="input-field" placeholder="მაგ: ახალი კურსი დაემატა!" />
                </div>
                <div>
                    <label className="block text-dark-300 text-sm mb-1">ტექსტი</label>
                    <textarea required value={message} onChange={(e) => setMessage(e.target.value)} className="input-field min-h-[100px]" placeholder="შეტყობინების შინაარსი..." />
                </div>
                <button type="submit" className="btn-primary w-full py-3 font-bold">გაგზავნა</button>
            </form>
        </div>
    );
};
