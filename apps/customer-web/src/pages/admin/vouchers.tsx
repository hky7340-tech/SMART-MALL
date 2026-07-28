import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { formatNumber, formatFullPrice } from '@/utils/format';

interface Voucher {
    id: number;
    code: string;
    name: string;
    type: 'percent' | 'fixed' | 'free_ship';
    value: number;
    minOrder: number;
    maxDiscount: number;
    usageLimit: number;
    used: number;
    startDate: string;
    endDate: string;
    status: 'active' | 'expired' | 'disabled';
    store?: string;
}

const mockVouchers: Voucher[] = [
    { id: 1, code: 'WELCOME10', name: 'Giảm 10% đơn đầu', type: 'percent', value: 10, minOrder: 100000, maxDiscount: 50000, usageLimit: 10000, used: 2345, startDate: '2024-01-01', endDate: '2024-12-31', status: 'active' },
    { id: 2, code: 'FREESHIP', name: 'Miễn phí vận chuyển', type: 'free_ship', value: 0, minOrder: 200000, maxDiscount: 30000, usageLimit: 5000, used: 1820, startDate: '2024-02-01', endDate: '2024-08-31', status: 'active' },
    { id: 3, code: 'SALE50K', name: 'Giảm 50K', type: 'fixed', value: 50000, minOrder: 500000, maxDiscount: 50000, usageLimit: 2000, used: 456, startDate: '2024-03-01', endDate: '2024-09-30', status: 'active' },
    { id: 4, code: 'VIP2024', name: 'VIP Giảm 20%', type: 'percent', value: 20, minOrder: 1000000, maxDiscount: 200000, usageLimit: 500, used: 89, startDate: '2024-01-01', endDate: '2024-06-30', status: 'expired' },
    { id: 5, code: 'SUMMER', name: 'Mùa hè giảm 15%', type: 'percent', value: 15, minOrder: 300000, maxDiscount: 100000, usageLimit: 3000, used: 2100, startDate: '2024-06-01', endDate: '2024-08-31', status: 'active' },
    { id: 6, code: 'NEWUSER', name: 'Tặng 20K cho người mới', type: 'fixed', value: 20000, minOrder: 0, maxDiscount: 20000, usageLimit: 10000, used: 5678, startDate: '2024-01-01', endDate: '2024-12-31', status: 'active' },
];

const typeLabels: Record<string, string> = { percent: '% Giảm giá', fixed: 'Giảm tiền mặt', free_ship: 'Miễn phí ship' };
const typeColors: Record<string, string> = { percent: 'badge-info', fixed: 'badge-success', free_ship: 'badge-purple' };

export default function VouchersPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    const filtered = mockVouchers.filter(v => {
        return (v.code.toLowerCase().includes(searchQuery.toLowerCase()) || v.name.toLowerCase().includes(searchQuery.toLowerCase()))
            && (statusFilter === 'all' || v.status === statusFilter);
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">🎫 Voucher</h1>
                    <p className="text-sm text-gray-500 mt-1">Quản lý mã giảm giá, khuyến mãi</p>
                </div>
                <div className="flex gap-2">
                    <button onClick={() => toast.success('Tính năng tạo voucher mới')} className="btn-primary">+ Tạo voucher</button>
                </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="stat-card stat-card-purple"><p className="text-sm text-gray-500">Tổng voucher</p><p className="text-2xl font-bold">{mockVouchers.length}</p></div>
                <div className="stat-card stat-card-green"><p className="text-sm text-gray-500">Đang hoạt động</p><p className="text-2xl font-bold text-green-600">{mockVouchers.filter(v => v.status === 'active').length}</p></div>
                <div className="stat-card stat-card-red"><p className="text-sm text-gray-500">Đã hết hạn</p><p className="text-2xl font-bold text-red-600">{mockVouchers.filter(v => v.status === 'expired').length}</p></div>
                <div className="stat-card stat-card-blue"><p className="text-sm text-gray-500">Đã sử dụng</p><p className="text-2xl font-bold text-blue-600">{formatNumber(mockVouchers.reduce((s, v) => s + v.used, 0))}</p></div>
            </div>

            <div className="card"><div className="card-body">
                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="flex-1 relative">
                        <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Tìm kiếm mã, tên voucher..." className="input-field pl-10" />
                        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                    </div>
                    <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="select-field w-auto">
                        <option value="all">Tất cả trạng thái</option>
                        <option value="active">Đang hoạt động</option>
                        <option value="expired">Đã hết hạn</option>
                        <option value="disabled">Đã tắt</option>
                    </select>
                    <button onClick={() => toast.success('Đang xuất Excel...')} className="btn-secondary">📥 Xuất Excel</button>
                </div>
            </div></div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filtered.map(v => (
                    <div key={v.id} className={`card p-5 ${v.status === 'expired' ? 'opacity-60' : ''}`}>
                        <div className="flex items-start justify-between mb-3">
                            <div>
                                <h3 className="font-semibold text-gray-900">{v.name}</h3>
                                <p className="text-lg font-bold text-primary-600 mt-1">
                                    {v.type === 'percent' ? `-${v.value}%` : v.type === 'free_ship' ? '🚚 Miễn ship' : `-${formatFullPrice(v.value)}`}
                                </p>
                            </div>
                            <span className={`badge ${v.status === 'active' ? 'badge-success' : v.status === 'expired' ? 'badge-danger' : 'badge-neutral'}`}>
                                {v.status === 'active' ? 'Đang chạy' : v.status === 'expired' ? 'Hết hạn' : 'Đã tắt'}
                            </span>
                        </div>
                        <div className="text-xs text-gray-500 space-y-1 mb-3">
                            <p><span className="font-mono bg-gray-100 px-1.5 py-0.5 rounded">{v.code}</span></p>
                            <p>Đơn tối thiểu: {formatFullPrice(v.minOrder)}</p>
                            <p>Giảm tối đa: {formatFullPrice(v.maxDiscount)}</p>
                            <p>Đã dùng: {formatNumber(v.used)}/{formatNumber(v.usageLimit)}</p>
                            <p>{v.startDate} → {v.endDate}</p>
                        </div>
                        <div className="progress-bar h-1.5">
                            <div className="progress-bar-fill bg-primary-500" style={{ width: `${(v.used / v.usageLimit) * 100}%` }} />
                        </div>
                        <div className="flex gap-2 mt-3">
                            <button onClick={() => toast.success('Chỉnh sửa voucher')} className="flex-1 btn-outline btn-sm">Sửa</button>
                            <button onClick={() => toast.success(v.status === 'active' ? 'Đã tắt voucher' : 'Đã bật voucher')} className="flex-1 btn-ghost btn-sm">
                                {v.status === 'active' ? '🔴 Tắt' : '🟢 Bật'}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}