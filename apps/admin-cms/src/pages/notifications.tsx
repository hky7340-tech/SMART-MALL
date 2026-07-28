import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { formatNumber } from '@/utils/format';

const mockNotifications = [
    { id: 1, title: 'Giảm giá mùa hè', type: 'promo', audience: 'Tất cả', status: 'sent', sent: '2024-07-27', views: 4520, clicks: 890 },
    { id: 2, title: 'Sự kiện khai trương', type: 'event', audience: 'Khách hàng VIP', status: 'scheduled', sent: '2024-08-01', views: 0, clicks: 0 },
    { id: 3, title: 'Cập nhật ứng dụng', type: 'system', audience: 'Tất cả', status: 'sent', sent: '2024-07-25', views: 12500, clicks: 2300 },
];

export default function NotificationsPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div><h1 className="text-2xl font-bold">🔔 Thông báo</h1><p className="text-sm text-gray-500 mt-1">Quản lý thông báo push, email, SMS</p></div>
                <button onClick={() => toast.success('Tạo thông báo mới')} className="btn-primary">+ Tạo thông báo</button>
            </div>
            <div className="grid grid-cols-3 gap-4">
                <div className="stat-card"><p className="text-sm text-gray-500">Đã gửi</p><p className="text-2xl font-bold text-green-600">{mockNotifications.filter(n => n.status === 'sent').length}</p></div>
                <div className="stat-card"><p className="text-sm text-gray-500">Đã lên lịch</p><p className="text-2xl font-bold text-blue-600">{mockNotifications.filter(n => n.status === 'scheduled').length}</p></div>
                <div className="stat-card"><p className="text-sm text-gray-500">Tổng lượt xem</p><p className="text-2xl font-bold">{formatNumber(mockNotifications.reduce((s, n) => s + n.views, 0))}</p></div>
            </div>
            <div className="card overflow-hidden">
                <div className="table-container">
                    <table>
                        <thead><tr><th>Tiêu đề</th><th>Loại</th><th>Đối tượng</th><th>Trạng thái</th><th>Ngày gửi</th><th className="text-right">Lượt xem</th><th className="text-right">Click</th><th className="text-center">Thao tác</th></tr></thead>
                        <tbody>{mockNotifications.map(n => (<tr key={n.id}>
                            <td className="font-medium">{n.title}</td>
                            <td><span className={`badge ${n.type === 'promo' ? 'badge-warning' : n.type === 'event' ? 'badge-info' : 'badge-neutral'}`}>{n.type === 'promo' ? 'Khuyến mãi' : n.type === 'event' ? 'Sự kiện' : 'Hệ thống'}</span></td>
                            <td className="text-sm">{n.audience}</td>
                            <td><span className={`badge ${n.status === 'sent' ? 'badge-success' : 'badge-info'}`}>{n.status === 'sent' ? 'Đã gửi' : 'Đã lên lịch'}</span></td>
                            <td className="text-sm">{n.sent}</td>
                            <td className="text-right font-medium">{formatNumber(n.views)}</td>
                            <td className="text-right font-medium">{formatNumber(n.clicks)}</td>
                            <td className="text-center"><button onClick={() => toast.success('Xem chi tiết')} className="btn-ghost btn-xs">👁️</button></td>
                        </tr>))}</tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}