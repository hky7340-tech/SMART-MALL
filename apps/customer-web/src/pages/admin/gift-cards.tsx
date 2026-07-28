import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { formatNumber, formatFullPrice } from '@/utils/format';

interface GiftCard {
    id: number;
    code: string;
    owner: string;
    balance: number;
    initialBalance: number;
    expiryDate: string;
    status: 'active' | 'expired' | 'used' | 'frozen';
    lastUsed?: string;
}

const mockCards: GiftCard[] = [
    { id: 1, code: 'GC-2024-001', owner: 'Nguyễn Văn A', balance: 500000, initialBalance: 1000000, expiryDate: '2024-12-31', status: 'active', lastUsed: '2 ngày trước' },
    { id: 2, code: 'GC-2024-002', owner: 'Trần Thị B', balance: 0, initialBalance: 500000, expiryDate: '2024-06-30', status: 'used', lastUsed: '1 tháng trước' },
    { id: 3, code: 'GC-2024-003', owner: 'Lê Văn C', balance: 2000000, initialBalance: 2000000, expiryDate: '2025-12-31', status: 'active', lastUsed: 'Chưa dùng' },
    { id: 4, code: 'GC-2024-004', owner: 'Hoàng Văn E', balance: 150000, initialBalance: 300000, expiryDate: '2024-08-15', status: 'active', lastUsed: '1 tuần trước' },
];

export default function GiftCardsPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const filtered = mockCards.filter(c => c.code.toLowerCase().includes(searchQuery.toLowerCase()) || c.owner.toLowerCase().includes(searchQuery.toLowerCase()));

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div><h1 className="text-2xl font-bold text-gray-900">🎁 Gift Card</h1><p className="text-sm text-gray-500 mt-1">Quản lý thẻ quà tặng</p></div>
                <button onClick={() => toast.success('Phát hành gift card mới')} className="btn-primary">+ Phát hành</button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="stat-card"><p className="text-sm text-gray-500">Tổng thẻ</p><p className="text-2xl font-bold">{mockCards.length}</p></div>
                <div className="stat-card stat-card-green"><p className="text-sm text-gray-500">Đang hoạt động</p><p className="text-2xl font-bold text-green-600">{mockCards.filter(c => c.status === 'active').length}</p></div>
                <div className="stat-card stat-card-blue"><p className="text-sm text-gray-500">Tổng số dư</p><p className="text-2xl font-bold text-blue-600">{formatFullPrice(mockCards.reduce((s, c) => s + c.balance, 0))}</p></div>
                <div className="stat-card stat-card-orange"><p className="text-sm text-gray-500">Đã sử dụng</p><p className="text-2xl font-bold text-orange-600">{mockCards.filter(c => c.status === 'used').length}</p></div>
            </div>
            <div className="card"><div className="card-body">
                <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Tìm kiếm mã, chủ sở hữu..." className="input-field" />
            </div></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {filtered.map(card => (
                    <div key={card.id} className="card p-5 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
                        <div className="flex items-start justify-between mb-3">
                            <div><h3 className="font-semibold text-gray-900">{card.code}</h3><p className="text-sm text-gray-500">{card.owner}</p></div>
                            <span className={`badge ${card.status === 'active' ? 'badge-success' : card.status === 'used' ? 'badge-neutral' : card.status === 'expired' ? 'badge-danger' : 'badge-info'}`}>{card.status}</span>
                        </div>
                        <div className="text-center py-3">
                            <p className="text-xs text-gray-500">Số dư</p>
                            <p className="text-3xl font-bold text-primary-600">{formatFullPrice(card.balance)}</p>
                            <p className="text-xs text-gray-400">/ {formatFullPrice(card.initialBalance)}</p>
                        </div>
                        <div className="progress-bar h-2"><div className="progress-bar-fill bg-primary-500" style={{ width: `${(card.balance / card.initialBalance) * 100}%` }} /></div>
                        <p className="text-xs text-gray-400 mt-2">Hết hạn: {card.expiryDate} • {card.lastUsed}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}