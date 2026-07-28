import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { formatNumber, formatFullPrice } from '@/utils/format';

interface Event {
    id: number; name: string; date: string; location: string; attendees: number; status: 'upcoming' | 'ongoing' | 'ended';
}
const mockEvents: Event[] = [
    { id: 1, name: 'Khai trương khu Ẩm thực mới', date: '2024-08-15', location: 'Tầng 2', attendees: 500, status: 'upcoming' },
    { id: 2, name: 'Lễ hội mua sắm mùa hè', date: '2024-07-20', location: 'Toàn bộ trung tâm', attendees: 5000, status: 'ongoing' },
    { id: 3, name: 'Workshop làm bánh', date: '2024-07-10', location: 'Tầng 1 - Khu triển lãm', attendees: 120, status: 'ended' },
    { id: 4, name: 'Giải chạy từ thiện', date: '2024-09-01', location: 'Công viên cạnh trung tâm', attendees: 2000, status: 'upcoming' },
];

export default function EventsPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const filtered = mockEvents.filter(e => e.name.toLowerCase().includes(searchQuery.toLowerCase()));

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div><h1 className="text-2xl font-bold text-gray-900">🎪 Sự kiện</h1><p className="text-sm text-gray-500 mt-1">Quản lý sự kiện, chương trình</p></div>
                <button onClick={() => toast.success('Tạo sự kiện mới')} className="btn-primary">+ Tạo sự kiện</button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="stat-card"><p className="text-sm text-gray-500">Tổng sự kiện</p><p className="text-2xl font-bold">{mockEvents.length}</p></div>
                <div className="stat-card stat-card-green"><p className="text-sm text-gray-500">Sắp diễn ra</p><p className="text-2xl font-bold text-green-600">{mockEvents.filter(e => e.status === 'upcoming').length}</p></div>
                <div className="stat-card stat-card-blue"><p className="text-sm text-gray-500">Đang diễn ra</p><p className="text-2xl font-bold text-blue-600">{mockEvents.filter(e => e.status === 'ongoing').length}</p></div>
                <div className="stat-card stat-card-purple"><p className="text-sm text-gray-500">Tổng người tham dự</p><p className="text-2xl font-bold text-purple-600">{formatNumber(mockEvents.reduce((s, e) => s + e.attendees, 0))}</p></div>
            </div>
            <div className="card"><div className="card-body">
                <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Tìm kiếm sự kiện..." className="input-field" />
            </div></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {filtered.map(e => (
                    <div key={e.id} className="card p-5">
                        <div className="flex items-start justify-between mb-3">
                            <div><h3 className="font-semibold text-gray-900">{e.name}</h3><p className="text-sm text-gray-500">{e.date} • {e.location}</p></div>
                            <span className={`badge ${e.status === 'upcoming' ? 'badge-info' : e.status === 'ongoing' ? 'badge-success' : 'badge-neutral'}`}>
                                {e.status === 'upcoming' ? 'Sắp tới' : e.status === 'ongoing' ? 'Đang diễn ra' : 'Đã kết thúc'}
                            </span>
                        </div>
                        <p className="text-sm text-gray-600">👥 {formatNumber(e.attendees)} người tham dự</p>
                        <div className="flex gap-2 mt-4">
                            <button onClick={() => toast.success('Xem chi tiết')} className="flex-1 btn-outline btn-sm">Chi tiết</button>
                            <button onClick={() => toast.success('QR Check-in')} className="flex-1 btn-ghost btn-sm">📱 Check-in</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}