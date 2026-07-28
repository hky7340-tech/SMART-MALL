import React, { useState } from 'react';
import toast from 'react-hot-toast';

interface Notification { id: number; title: string; content: string; type: 'push' | 'email' | 'sms'; status: 'sent' | 'scheduled' | 'draft'; sentCount: number; scheduledDate?: string; createdAt: string; }
const mockNotifs: Notification[] = [
    { id: 1, title: 'Khuyến mãi cuối tuần', content: 'Giảm giá lên đến 50%...', type: 'push', status: 'sent', sentCount: 12500, createdAt: '2024-07-27' },
    { id: 2, title: 'Nhắc nhở thanh toán', content: 'Đơn hàng của bạn đang chờ...', type: 'email', status: 'scheduled', sentCount: 0, scheduledDate: '2024-07-28', createdAt: '2024-07-27' },
    { id: 3, title: 'Chào mừng thành viên mới', content: 'Chào mừng bạn đến với...', type: 'sms', status: 'draft', sentCount: 0, createdAt: '2024-07-26' },
    { id: 4, title: 'Sự kiện sắp diễn ra', content: 'Đừng bỏ lỡ sự kiện...', type: 'push', status: 'sent', sentCount: 8900, createdAt: '2024-07-25' },
];

export default function NotificationsPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const filtered = mockNotifs.filter(n => n.title.toLowerCase().includes(searchQuery.toLowerCase()));

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div><h1 className="text-2xl font-bold text-gray-900">🔔 Thông báo</h1><p className="text-sm text-gray-500 mt-1">Push notification, Email, SMS</p></div>
                <button onClick={() => toast.success('Tạo thông báo mới')} className="btn-primary">+ Tạo thông báo</button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="stat-card"><p className="text-sm text-gray-500">Tổng thông báo</p><p className="text-2xl font-bold">{mockNotifs.length}</p></div>
                <div className="stat-card stat-card-green"><p className="text-sm text-gray-500">Đã gửi</p><p className="text-2xl font-bold text-green-600">{mockNotifs.filter(n => n.status === 'sent').length}</p></div>
                <div className="stat-card stat-card-blue"><p className="text-sm text-gray-500">Đã lên lịch</p><p className="text-2xl font-bold text-blue-600">{mockNotifs.filter(n => n.status === 'scheduled').length}</p></div>
                <div className="stat-card stat-card-purple"><p className="text-sm text-gray-500">Tổng đã gửi</p><p className="text-2xl font-bold text-purple-600">{mockNotifs.reduce((s, n) => s + n.sentCount, 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}</p></div>
            </div>
            <div className="card"><div className="card-body">
                <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Tìm kiếm thông báo..." className="input-field" />
            </div></div>
            <div className="space-y-3">
                {filtered.map(n => (
                    <div key={n.id} className="card p-5">
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className={`badge ${n.type === 'push' ? 'badge-info' : n.type === 'email' ? 'badge-warning' : 'badge-purple'}`}>{n.type === 'push' ? 'Push' : n.type === 'email' ? 'Email' : 'SMS'}</span>
                                    <span className={`badge ${n.status === 'sent' ? 'badge-success' : n.status === 'scheduled' ? 'badge-info' : 'badge-neutral'}`}>{n.status === 'sent' ? 'Đã gửi' : n.status === 'scheduled' ? 'Đã lên lịch' : 'Nháp'}</span>
                                </div>
                                <h3 className="font-semibold text-gray-900">{n.title}</h3>
                                <p className="text-sm text-gray-500 mt-1">{n.content}</p>
                                <p className="text-xs text-gray-400 mt-2">{n.createdAt}{n.scheduledDate ? ` • Lịch: ${n.scheduledDate}` : ''}{n.sentCount > 0 ? ` • ${n.sentCount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')} đã nhận` : ''}</p>
                            </div>
                            <div className="flex gap-1 ml-4">
                                <button onClick={() => toast.success('Chỉnh sửa')} className="btn-ghost btn-xs">✏️</button>
                                <button onClick={() => toast.success('Gửi ngay')} className="btn-ghost btn-xs">📤</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}