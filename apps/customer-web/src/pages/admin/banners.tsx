import React from 'react';
import toast from 'react-hot-toast';

const banners = [
    { id: 1, title: 'Sale mùa hè 2024', position: 'Hero Banner', status: 'active', clicks: 12500, views: 150000, startDate: '2024-06-01', endDate: '2024-08-31' },
    { id: 2, title: 'Khai trương khu ẩm thực', position: 'Popup', status: 'active', clicks: 3200, views: 45000, startDate: '2024-07-15', endDate: '2024-08-15' },
    { id: 3, title: 'Tuyển dụng tháng 7', position: 'Sidebar', status: 'inactive', clicks: 450, views: 12000, startDate: '2024-07-01', endDate: '2024-07-31' },
    { id: 4, title: 'Giảm giá TechZone', position: 'Slider 2', status: 'active', clicks: 8900, views: 98000, startDate: '2024-07-01', endDate: '2024-07-31' },
];

export default function BannersPage() {
    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div><h1 className="text-2xl font-bold text-gray-900">🖼️ Banner/Slider</h1><p className="text-sm text-gray-500 mt-1">Quản lý banner, slider, popup</p></div>
                <button onClick={() => toast.success('Thêm banner mới')} className="btn-primary">+ Thêm banner</button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div className="stat-card"><p className="text-sm text-gray-500">Tổng banner</p><p className="text-2xl font-bold">{banners.length}</p></div>
                <div className="stat-card stat-card-green"><p className="text-sm text-gray-500">Đang hoạt động</p><p className="text-2xl font-bold text-green-600">{banners.filter(b => b.status === 'active').length}</p></div>
                <div className="stat-card stat-card-blue"><p className="text-sm text-gray-500">Tổng lượt xem</p><p className="text-2xl font-bold text-blue-600">{banners.reduce((s, b) => s + b.views, 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}</p></div>
            </div>
            <div className="space-y-3">
                {banners.map(b => (
                    <div key={b.id} className="card overflow-hidden">
                        <div className="flex items-center">
                            <div className="w-32 h-20 bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center text-2xl flex-shrink-0">🖼️</div>
                            <div className="flex-1 p-4">
                                <div className="flex items-center justify-between">
                                    <div><h3 className="font-medium text-gray-900">{b.title}</h3><p className="text-xs text-gray-500">{b.position} • {b.startDate} → {b.endDate}</p></div>
                                    <div className="flex items-center gap-4 text-xs text-gray-500">
                                        <span>👁️ {b.views.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}</span>
                                        <span>🖱️ {b.clicks.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}</span>
                                        <span className={`badge ${b.status === 'active' ? 'badge-success' : 'badge-neutral'}`}>{b.status === 'active' ? 'Hoạt động' : 'Tắt'}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="pr-4 flex gap-1">
                                <button onClick={() => toast.success('Chỉnh sửa banner')} className="btn-ghost btn-xs">✏️</button>
                                <button onClick={() => toast.success(b.status === 'active' ? 'Đã tắt banner' : 'Đã bật banner')} className="btn-ghost btn-xs">{b.status === 'active' ? '🔴' : '🟢'}</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}