import React, { useState } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { formatNumber, formatPrice, formatFullPrice } from '@/utils/format';

interface Store {
    id: number;
    name: string;
    owner: string;
    floor: number;
    unit: string;
    category: string;
    status: 'active' | 'closed' | 'maintenance';
    revenue: number;
    orders: number;
    rating: number;
    contractEnd: string;
    phone?: string;
    email?: string;
}

const mockStores: Store[] = [
    { id: 1, name: 'Fashion Hub', owner: 'Nguyễn Văn A', floor: 1, unit: 'L1-01', category: 'Thời trang', status: 'active', revenue: 3800000000, orders: 12500, rating: 4.5, contractEnd: '2025-12-31', phone: '0911111111', email: 'fashionhub@email.com' },
    { id: 2, name: 'TechZone', owner: 'Lê Văn C', floor: 3, unit: 'L3-10', category: 'Điện tử', status: 'active', revenue: 5200000000, orders: 8900, rating: 4.7, contractEnd: '2026-06-30', phone: '0922222222', email: 'techzone@email.com' },
    { id: 3, name: 'Trà Sữa Đài Loan', owner: 'Trần Thị B', floor: 2, unit: 'L2-05', category: 'Ẩm thực', status: 'active', revenue: 980000000, orders: 25000, rating: 4.3, contractEnd: '2025-09-30', phone: '0933333333', email: 'tradtl@email.com' },
    { id: 4, name: 'Hải Sản Biển Đông', owner: 'Phạm Văn D', floor: 4, unit: 'L4-02', category: 'Nhà hàng', status: 'active', revenue: 2100000000, orders: 5600, rating: 4.6, contractEnd: '2026-03-31', phone: '0944444444' },
    { id: 5, name: 'Galaxy Cinema', owner: 'Hoàng Văn E', floor: 5, unit: 'L5-01', category: 'Giải trí', status: 'active', revenue: 750000000, orders: 18000, rating: 4.4, contractEnd: '2027-12-31', phone: '0955555555' },
    { id: 6, name: 'Nhà Sách Minh Khai', owner: 'Vũ Thị H', floor: 2, unit: 'L2-08', category: 'Sách', status: 'active', revenue: 450000000, orders: 7800, rating: 4.8, contractEnd: '2025-06-30' },
    { id: 7, name: 'Game Center', owner: 'Đặng Văn F', floor: 5, unit: 'L5-10', category: 'Giải trí', status: 'closed', revenue: 320000000, orders: 4500, rating: 4.1, contractEnd: '2024-12-31' },
    { id: 8, name: 'Tiệm Bánh Sweet Home', owner: 'Ngô Thị G', floor: 1, unit: 'L1-15', category: 'Ẩm thực', status: 'active', revenue: 280000000, orders: 9200, rating: 4.5, contractEnd: '2025-03-31' },
    { id: 9, name: 'Spa & Beauty', owner: 'Lý Thị M', floor: 4, unit: 'L4-08', category: 'Dịch vụ', status: 'maintenance', revenue: 180000000, orders: 3200, rating: 4.2, contractEnd: '2025-08-31' },
    { id: 10, name: 'Thế Giới Đồ Chơi', owner: 'Trịnh Văn N', floor: 2, unit: 'L2-12', category: 'Đồ chơi', status: 'active', revenue: 520000000, orders: 11000, rating: 4.6, contractEnd: '2026-01-31' },
];

const categories = Array.from(new Set(mockStores.map(s => s.category)));

export default function StoresPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [floorFilter, setFloorFilter] = useState('all');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');

    const filteredStores = mockStores.filter(store => {
        const matchesSearch = store.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            store.owner.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'all' || store.status === statusFilter;
        const matchesFloor = floorFilter === 'all' || store.floor.toString() === floorFilter;
        const matchesCategory = categoryFilter === 'all' || store.category === categoryFilter;
        return matchesSearch && matchesStatus && matchesFloor && matchesCategory;
    });

    const totalRevenue = mockStores.reduce((s, st) => s + st.revenue, 0);
    const avgRating = (mockStores.reduce((s, st) => s + st.rating, 0) / mockStores.length).toFixed(1);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">🏪 Cửa hàng</h1>
                    <p className="text-sm text-gray-500 mt-1">Quản lý cửa hàng, tầng, hợp đồng thuê</p>
                </div>
                <div className="flex gap-2">
                    <div className="flex bg-gray-100 p-0.5 rounded-lg">
                        <button onClick={() => setViewMode('table')} className={`p-2 rounded-md transition-all ${viewMode === 'table' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'}`}>
                            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18M3 18h18M3 6h18" /></svg>
                        </button>
                        <button onClick={() => setViewMode('grid')} className={`p-2 rounded-md transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'}`}>
                            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
                        </button>
                    </div>
                    <button onClick={() => toast.success('Tính năng thêm cửa hàng')} className="btn-primary">+ Thêm cửa hàng</button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                <div className="stat-card"><p className="text-sm text-gray-500">Tổng cửa hàng</p><p className="text-2xl font-bold">{mockStores.length}</p></div>
                <div className="stat-card"><p className="text-sm text-gray-500">Đang hoạt động</p><p className="text-2xl font-bold text-green-600">{mockStores.filter(s => s.status === 'active').length}</p></div>
                <div className="stat-card"><p className="text-sm text-gray-500">Bảo trì</p><p className="text-2xl font-bold text-yellow-600">{mockStores.filter(s => s.status === 'maintenance').length}</p></div>
                <div className="stat-card"><p className="text-sm text-gray-500">Đã đóng</p><p className="text-2xl font-bold text-red-600">{mockStores.filter(s => s.status === 'closed').length}</p></div>
                <div className="stat-card"><p className="text-sm text-gray-500">Tổng doanh thu</p><p className="text-2xl font-bold">{formatPrice(totalRevenue)}</p></div>
                <div className="stat-card"><p className="text-sm text-gray-500">Đánh giá TB</p><p className="text-2xl font-bold text-yellow-500">⭐ {avgRating}</p></div>
            </div>

            {/* Filters */}
            <div className="card">
                <div className="card-body">
                    <div className="flex flex-col sm:flex-row gap-3">
                        <div className="flex-1 relative">
                            <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Tìm kiếm cửa hàng, chủ shop..." className="input-field pl-10" />
                            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                        </div>
                        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="select-field w-auto">
                            <option value="all">Tất cả trạng thái</option>
                            <option value="active">Đang hoạt động</option>
                            <option value="maintenance">Bảo trì</option>
                            <option value="closed">Đã đóng</option>
                        </select>
                        <select value={floorFilter} onChange={(e) => setFloorFilter(e.target.value)} className="select-field w-auto">
                            <option value="all">Tất cả tầng</option>
                            {[1, 2, 3, 4, 5].map(f => <option key={f} value={f}>Tầng {f}</option>)}
                        </select>
                        <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="select-field w-auto">
                            <option value="all">Tất cả danh mục</option>
                            {categories.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                        <button onClick={() => toast.success('Đang xuất Excel...')} className="btn-secondary">📥 Xuất Excel</button>
                    </div>
                </div>
            </div>

            {/* Content */}
            {viewMode === 'table' ? (
                <div className="card overflow-hidden">
                    <div className="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Cửa hàng</th>
                                    <th>Chủ shop</th>
                                    <th>Vị trí</th>
                                    <th>Danh mục</th>
                                    <th>Trạng thái</th>
                                    <th className="text-right">Doanh thu</th>
                                    <th className="text-right">Đơn hàng</th>
                                    <th className="text-center">Đánh giá</th>
                                    <th className="text-center">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredStores.map(store => (
                                    <tr key={store.id}>
                                        <td>
                                            <p className="text-sm font-medium text-gray-900">{store.name}</p>
                                            <p className="text-xs text-gray-500">HĐ đến: {store.contractEnd}</p>
                                        </td>
                                        <td className="text-sm">{store.owner}</td>
                                        <td className="text-sm">
                                            <span className="inline-flex items-center gap-1 bg-gray-100 px-2 py-0.5 rounded text-xs">
                                                🏢 Tầng {store.floor} - {store.unit}
                                            </span>
                                        </td>
                                        <td className="text-sm">{store.category}</td>
                                        <td>
                                            <span className={`badge ${store.status === 'active' ? 'badge-success' : store.status === 'maintenance' ? 'badge-warning' : 'badge-danger'}`}>
                                                <span className={`w-1.5 h-1.5 rounded-full ${store.status === 'active' ? 'bg-green-500' : store.status === 'maintenance' ? 'bg-yellow-500' : 'bg-red-500'}`} />
                                                {store.status === 'active' ? 'Hoạt động' : store.status === 'maintenance' ? 'Bảo trì' : 'Đã đóng'}
                                            </span>
                                        </td>
                                        <td className="text-right font-semibold">{formatPrice(store.revenue)}</td>
                                        <td className="text-right font-medium">{formatNumber(store.orders)}</td>
                                        <td className="text-center">
                                            <span className="text-yellow-500">★</span>
                                            <span className="text-sm font-medium ml-0.5">{store.rating}</span>
                                        </td>
                                        <td className="text-center">
                                            <div className="flex items-center justify-center gap-1">
                                                <button onClick={() => toast.success('Xem chi tiết cửa hàng')} className="btn-ghost btn-xs">👁️</button>
                                                <button onClick={() => toast.success('Chỉnh sửa cửa hàng')} className="btn-ghost btn-xs">✏️</button>
                                                <button onClick={() => toast.success('Xem hợp đồng')} className="btn-ghost btn-xs">📄</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {filteredStores.length === 0 && (
                        <div className="empty-state">
                            <div className="empty-state-icon">🏪</div>
                            <h3 className="text-lg font-medium text-gray-900 mb-1">Không tìm thấy cửa hàng</h3>
                            <p className="text-sm text-gray-500">Thử thay đổi bộ lọc hoặc tìm kiếm với từ khóa khác</p>
                        </div>
                    )}
                </div>
            ) : (
                /* Grid View */
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredStores.map(store => (
                        <div key={store.id} className="card hover:shadow-md transition-all duration-200">
                            <div className="p-5">
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-xl text-white">
                                            🏪
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900">{store.name}</h3>
                                            <p className="text-xs text-gray-500">{store.owner}</p>
                                        </div>
                                    </div>
                                    <span className={`badge ${store.status === 'active' ? 'badge-success' : store.status === 'maintenance' ? 'badge-warning' : 'badge-danger'}`}>
                                        {store.status === 'active' ? 'Hoạt động' : store.status === 'maintenance' ? 'Bảo trì' : 'Đã đóng'}
                                    </span>
                                </div>
                                <div className="space-y-2 text-sm">
                                    <div className="flex items-center justify-between text-gray-600">
                                        <span>📍 Vị trí</span>
                                        <span className="font-medium">Tầng {store.floor} - {store.unit}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-gray-600">
                                        <span>📂 Danh mục</span>
                                        <span className="font-medium">{store.category}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-gray-600">
                                        <span>💰 Doanh thu</span>
                                        <span className="font-semibold text-gray-900">{formatPrice(store.revenue)}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-gray-600">
                                        <span>📦 Đơn hàng</span>
                                        <span className="font-medium">{formatNumber(store.orders)}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-gray-600">
                                        <span>⭐ Đánh giá</span>
                                        <span className="font-medium text-yellow-500">{store.rating}</span>
                                    </div>
                                </div>
                                <div className="mt-4 pt-3 border-t border-gray-100 flex gap-2">
                                    <button onClick={() => toast.success('Xem chi tiết')} className="flex-1 btn-outline btn-sm">Xem chi tiết</button>
                                    <button onClick={() => toast.success('Chỉnh sửa')} className="flex-1 btn-primary btn-sm">Sửa</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}