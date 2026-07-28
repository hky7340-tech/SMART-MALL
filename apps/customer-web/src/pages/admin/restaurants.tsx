import React, { useState } from 'react';
import toast from 'react-hot-toast';

const restaurants = [
    { id: 1, name: 'Hải Sản Biển Đông', cuisine: 'Hải sản', floor: 4, tables: 20, bookings: 45, rating: 4.6, status: 'open' },
    { id: 2, name: 'Trà Sữa Đài Loan', cuisine: 'Đồ uống', floor: 2, tables: 15, bookings: 78, rating: 4.3, status: 'open' },
    { id: 3, name: 'Tiệm Bánh Sweet Home', cuisine: 'Bánh ngọt', floor: 1, tables: 10, bookings: 32, rating: 4.5, status: 'open' },
    { id: 4, name: 'Lẩu Nướng BBQ', cuisine: 'Lẩu nướng', floor: 4, tables: 25, bookings: 56, rating: 4.4, status: 'closed' },
];

export default function RestaurantsPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const filtered = restaurants.filter(r => r.name.toLowerCase().includes(searchQuery.toLowerCase()));

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div><h1 className="text-2xl font-bold text-gray-900">🍽️ Nhà hàng</h1><p className="text-sm text-gray-500 mt-1">Quản lý nhà hàng, menu, đặt bàn</p></div>
                <button onClick={() => toast.success('Thêm nhà hàng')} className="btn-primary">+ Thêm nhà hàng</button>
            </div>
            <div className="card"><div className="card-body">
                <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Tìm kiếm nhà hàng..." className="input-field" />
            </div></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {filtered.map(r => (
                    <div key={r.id} className="card p-5">
                        <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-2xl">🍽️</div>
                                <div><h3 className="font-semibold text-gray-900">{r.name}</h3><p className="text-xs text-gray-500">{r.cuisine} • Tầng {r.floor}</p></div>
                            </div>
                            <span className={`badge ${r.status === 'open' ? 'badge-success' : 'badge-danger'}`}>{r.status === 'open' ? 'Mở cửa' : 'Đóng'}</span>
                        </div>
                        <div className="grid grid-cols-3 gap-3 text-center text-sm">
                            <div><p className="text-gray-500">Bàn</p><p className="font-semibold">{r.tables}</p></div>
                            <div><p className="text-gray-500">Đặt bàn</p><p className="font-semibold text-blue-600">{r.bookings}</p></div>
                            <div><p className="text-gray-500">Đánh giá</p><p className="font-semibold text-yellow-500">⭐ {r.rating}</p></div>
                        </div>
                        <div className="flex gap-2 mt-4">
                            <button onClick={() => toast.success('Quản lý menu')} className="flex-1 btn-outline btn-sm">📋 Menu</button>
                            <button onClick={() => toast.success('Xem đặt bàn')} className="flex-1 btn-ghost btn-sm">📅 Đặt bàn</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}