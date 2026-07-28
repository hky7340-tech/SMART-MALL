import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { formatNumber } from '@/utils/format';

const mockCustomers = [
    { id: 1, name: 'Nguyễn Văn A', email: 'nguyenvana@email.com', phone: '0912345678', totalOrders: 45, totalSpent: 12500000, lastOrder: '2024-07-27', segment: 'vip', joinDate: '2024-01-15', points: 12500 },
    { id: 2, name: 'Trần Thị B', email: 'tranthib@email.com', phone: '0923456789', totalOrders: 12, totalSpent: 3200000, lastOrder: '2024-07-25', segment: 'regular', joinDate: '2024-03-20', points: 3200 },
    { id: 3, name: 'Đặng Thị F', email: 'dangthif@email.com', phone: '0967890123', totalOrders: 28, totalSpent: 8900000, lastOrder: '2024-07-26', segment: 'vip', joinDate: '2024-01-20', points: 8900 },
    { id: 4, name: 'Bùi Văn G', email: 'buivang@email.com', phone: '0978901234', totalOrders: 1, totalSpent: 150000, lastOrder: '2024-06-10', segment: 'new', joinDate: '2024-06-10', points: 150 },
    { id: 5, name: 'Ngô Văn I', email: 'ngovani@email.com', phone: '0990123456', totalOrders: 67, totalSpent: 25000000, lastOrder: '2024-07-27', segment: 'vip', joinDate: '2023-11-01', points: 25000 },
];
const segmentLabels: Record<string, string> = { vip: 'VIP', regular: 'Thường', new: 'Mới' };
const segmentColors: Record<string, string> = { vip: 'badge-warning', regular: 'badge-info', new: 'badge-success' };

export default function CustomersPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div><h1 className="text-2xl font-bold">🤝 CRM - Khách hàng</h1><p className="text-sm text-gray-500 mt-1">Quản lý quan hệ khách hàng</p></div>
                <button onClick={() => toast.success('Tính năng đang phát triển')} className="btn-primary">+ Thêm khách hàng</button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="stat-card"><p className="text-sm text-gray-500">Tổng KH</p><p className="text-2xl font-bold">{mockCustomers.length}</p></div>
                <div className="stat-card"><p className="text-sm text-gray-500">VIP</p><p className="text-2xl font-bold text-yellow-600">{mockCustomers.filter(c => c.segment === 'vip').length}</p></div>
                <div className="stat-card"><p className="text-sm text-gray-500">Tổng chi tiêu</p><p className="text-2xl font-bold">{(mockCustomers.reduce((s, c) => s + c.totalSpent, 0) / 1000000).toFixed(0)}tr</p></div>
                <div className="stat-card"><p className="text-sm text-gray-500">Điểm TB</p><p className="text-2xl font-bold">{formatNumber(Math.round(mockCustomers.reduce((s, c) => s + c.points, 0) / mockCustomers.length))}</p></div>
            </div>
            <div className="card overflow-hidden">
                <div className="table-container">
                    <table>
                        <thead><tr><th>Khách hàng</th><th>Phân khúc</th><th className="text-right">Đơn hàng</th><th className="text-right">Đã chi</th><th className="text-right">Điểm</th><th>Đơn gần nhất</th><th className="text-center">Thao tác</th></tr></thead>
                        <tbody>{mockCustomers.map(c => (<tr key={c.id}>
                            <td><div className="flex items-center gap-3"><div className="w-9 h-9 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">{c.name.charAt(0)}</div><div><p className="text-sm font-medium">{c.name}</p><p className="text-xs text-gray-500">{c.email}</p></div></div></td>
                            <td><span className={`badge ${segmentColors[c.segment]}`}>{segmentLabels[c.segment]}</span></td>
                            <td className="text-right font-medium">{c.totalOrders}</td>
                            <td className="text-right font-semibold">{formatNumber(c.totalSpent)}₫</td>
                            <td className="text-right font-medium">{formatNumber(c.points)}</td>
                            <td className="text-sm text-gray-500">{c.lastOrder}</td>
                            <td className="text-center"><button onClick={() => toast.success('Xem chi tiết')} className="btn-ghost btn-xs">👁️</button></td>
                        </tr>))}</tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}