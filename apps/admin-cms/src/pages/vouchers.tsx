import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { formatNumber } from '@/utils/format';

const mockVouchers = [
    { id: 1, code: 'SALE50', discount: '50%', maxDiscount: 100000, minOrder: 200000, used: 1234, limit: 5000, status: 'active', start: '2024-07-01', end: '2024-08-31' },
    { id: 2, code: 'GIAM100K', discount: '100,000₫', maxDiscount: 100000, minOrder: 500000, used: 567, limit: 2000, status: 'active', start: '2024-07-15', end: '2024-09-15' },
    { id: 3, code: 'WELCOME10', discount: '10%', maxDiscount: 50000, minOrder: 0, used: 3456, limit: 10000, status: 'active', start: '2024-01-01', end: '2024-12-31' },
    { id: 4, code: 'FREESHIP', discount: 'Miễn phí vận chuyển', maxDiscount: 30000, minOrder: 100000, used: 789, limit: 1000, status: 'expired', start: '2024-06-01', end: '2024-07-15' },
];

export default function VouchersPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div><h1 className="text-2xl font-bold">🎫 Voucher</h1><p className="text-sm text-gray-500 mt-1">Quản lý mã giảm giá, khuyến mãi</p></div>
                <button onClick={() => toast.success('Tạo voucher mới')} className="btn-primary">+ Tạo voucher</button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="stat-card"><p className="text-sm text-gray-500">Tổng voucher</p><p className="text-2xl font-bold">{mockVouchers.length}</p></div>
                <div className="stat-card"><p className="text-sm text-gray-500">Đang hoạt động</p><p className="text-2xl font-bold text-green-600">{mockVouchers.filter(v => v.status === 'active').length}</p></div>
                <div className="stat-card"><p className="text-sm text-gray-500">Đã sử dụng</p><p className="text-2xl font-bold">{formatNumber(mockVouchers.reduce((s, v) => s + v.used, 0))}</p></div>
                <div className="stat-card"><p className="text-sm text-gray-500">Tỷ lệ dùng</p><p className="text-2xl font-bold">{Math.round(mockVouchers.reduce((s, v) => s + v.used, 0) / mockVouchers.reduce((s, v) => s + v.limit, 0) * 100)}%</p></div>
            </div>
            <div className="card overflow-hidden">
                <div className="table-container">
                    <table>
                        <thead><tr><th>Mã</th><th>Giảm giá</th><th>Đơn tối thiểu</th><th className="text-right">Đã dùng</th><th className="text-right">Giới hạn</th><th>Hiệu lực</th><th>Trạng thái</th><th className="text-center">Thao tác</th></tr></thead>
                        <tbody>{mockVouchers.map(v => (<tr key={v.id}>
                            <td><span className="font-mono font-bold text-sm bg-gray-100 px-2 py-1 rounded">{v.code}</span></td>
                            <td className="font-semibold text-primary-600">{v.discount}</td>
                            <td className="text-sm">{formatNumber(v.minOrder)}₫</td>
                            <td className="text-right font-medium">{formatNumber(v.used)}</td>
                            <td className="text-right">{formatNumber(v.limit)}</td>
                            <td className="text-xs text-gray-500">{v.start} → {v.end}</td>
                            <td><span className={`badge ${v.status === 'active' ? 'badge-success' : 'badge-danger'}`}>{v.status === 'active' ? 'Hoạt động' : 'Hết hạn'}</span></td>
                            <td className="text-center"><button onClick={() => toast.success('Chỉnh sửa voucher')} className="btn-ghost btn-xs">✏️</button></td>
                        </tr>))}</tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}