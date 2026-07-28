import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { formatNumber, formatPrice, formatFullPrice } from '@/utils/format';

interface Product {
    id: number;
    name: string;
    category: string;
    store: string;
    price: number;
    originalPrice: number;
    stock: number;
    sold: number;
    status: 'active' | 'draft' | 'out_of_stock';
    image: string;
    created: string;
}

const mockProducts: Product[] = [
    { id: 1, name: 'Áo thun nam cao cấp', category: 'Thời trang', store: 'Fashion Hub', price: 299000, originalPrice: 499000, stock: 245, sold: 4200, status: 'active', image: '👕', created: '2024-01-15' },
    { id: 2, name: 'Điện thoại XYZ Pro', category: 'Điện tử', store: 'TechZone', price: 15999000, originalPrice: 19999000, stock: 56, sold: 200, status: 'active', image: '📱', created: '2024-02-01' },
    { id: 3, name: 'Combo trà sữa trân châu', category: 'Ẩm thực', store: 'Trà Sữa Đài Loan', price: 49000, originalPrice: 65000, stock: 999, sold: 5000, status: 'active', image: '🧋', created: '2024-03-10' },
    { id: 4, name: 'Tai nghe Bluetooth Pro', category: 'Điện tử', store: 'TechZone', price: 890000, originalPrice: 1290000, stock: 120, sold: 1000, status: 'active', image: '🎧', created: '2024-04-05' },
    { id: 5, name: 'Kem dưỡng da mặt', category: 'Thời trang', store: 'Fashion Hub', price: 599000, originalPrice: 799000, stock: 0, sold: 1000, status: 'out_of_stock', image: '🧴', created: '2024-02-20' },
    { id: 6, name: 'Bánh mì que', category: 'Ẩm thực', store: 'Tiệm Bánh Sweet Home', price: 15000, originalPrice: 20000, stock: 500, sold: 15000, status: 'active', image: '🥖', created: '2024-05-01' },
    { id: 7, name: 'Áo khoác jean', category: 'Thời trang', store: 'Fashion Hub', price: 899000, originalPrice: 1299000, stock: 78, sold: 890, status: 'active', image: '🧥', created: '2024-06-15' },
    { id: 8, name: 'Sách dạy nấu ăn', category: 'Sách', store: 'Nhà Sách Minh Khai', price: 120000, originalPrice: 150000, stock: 34, sold: 450, status: 'active', image: '📚', created: '2024-03-20' },
];

const statusLabels: Record<string, string> = { active: 'Đang bán', draft: 'Nháp', out_of_stock: 'Hết hàng' };
const statusColors: Record<string, string> = { active: 'badge-success', draft: 'badge-neutral', out_of_stock: 'badge-danger' };

export default function ProductsPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [categoryFilter, setCategoryFilter] = useState('all');

    const categories = Array.from(new Set(mockProducts.map(p => p.category)));
    const filtered = mockProducts.filter(p => {
        const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.store.toLowerCase().includes(searchQuery.toLowerCase());
        const matchStatus = statusFilter === 'all' || p.status === statusFilter;
        const matchCat = categoryFilter === 'all' || p.category === categoryFilter;
        return matchSearch && matchStatus && matchCat;
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">📦 Sản phẩm</h1>
                    <p className="text-sm text-gray-500 mt-1">Quản lý sản phẩm trong hệ thống</p>
                </div>
                <button onClick={() => toast.success('Tính năng thêm sản phẩm')} className="btn-primary">+ Thêm sản phẩm</button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="stat-card"><p className="text-sm text-gray-500">Tổng SP</p><p className="text-2xl font-bold">{mockProducts.length}</p></div>
                <div className="stat-card"><p className="text-sm text-gray-500">Đang bán</p><p className="text-2xl font-bold text-green-600">{mockProducts.filter(p => p.status === 'active').length}</p></div>
                <div className="stat-card"><p className="text-sm text-gray-500">Hết hàng</p><p className="text-2xl font-bold text-red-600">{mockProducts.filter(p => p.status === 'out_of_stock').length}</p></div>
                <div className="stat-card"><p className="text-sm text-gray-500">Tổng đã bán</p><p className="text-2xl font-bold text-blue-600">{formatNumber(mockProducts.reduce((s, p) => s + p.sold, 0))}</p></div>
            </div>

            <div className="card"><div className="card-body">
                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="flex-1 relative">
                        <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Tìm kiếm sản phẩm..." className="input-field pl-10" />
                        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                    </div>
                    <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="select-field w-auto">
                        <option value="all">Tất cả trạng thái</option>
                        <option value="active">Đang bán</option>
                        <option value="draft">Nháp</option>
                        <option value="out_of_stock">Hết hàng</option>
                    </select>
                    <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)} className="select-field w-auto">
                        <option value="all">Tất cả danh mục</option>
                        {categories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <button onClick={() => toast.success('Đang xuất Excel...')} className="btn-secondary">📥 Xuất Excel</button>
                </div>
            </div></div>

            <div className="card overflow-hidden">
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Sản phẩm</th>
                                <th>Danh mục</th>
                                <th>Cửa hàng</th>
                                <th className="text-right">Giá bán</th>
                                <th className="text-right">Giá gốc</th>
                                <th className="text-right">Kho</th>
                                <th className="text-right">Đã bán</th>
                                <th>Trạng thái</th>
                                <th className="text-center">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map(p => (
                                <tr key={p.id}>
                                    <td>
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-xl">{p.image}</div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">{p.name}</p>
                                                <p className="text-xs text-gray-500">ID: #{p.id.toString().padStart(4, '0')}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="text-sm">{p.category}</td>
                                    <td className="text-sm">{p.store}</td>
                                    <td className="text-right font-semibold text-primary-600">{formatFullPrice(p.price)}</td>
                                    <td className="text-right text-gray-400 line-through text-xs">{formatFullPrice(p.originalPrice)}</td>
                                    <td className="text-right">
                                        <span className={`font-medium ${p.stock === 0 ? 'text-red-600' : p.stock < 50 ? 'text-yellow-600' : 'text-gray-900'}`}>
                                            {p.stock}
                                        </span>
                                    </td>
                                    <td className="text-right font-medium">{formatNumber(p.sold)}</td>
                                    <td><span className={`badge ${statusColors[p.status]}`}>{statusLabels[p.status]}</span></td>
                                    <td className="text-center">
                                        <div className="flex items-center justify-center gap-1">
                                            <button onClick={() => toast.success('Xem chi tiết')} className="btn-ghost btn-xs">👁️</button>
                                            <button onClick={() => toast.success('Chỉnh sửa')} className="btn-ghost btn-xs">✏️</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {filtered.length === 0 && (
                    <div className="empty-state">
                        <div className="empty-state-icon">📦</div>
                        <h3 className="text-lg font-medium mb-1">Không tìm thấy sản phẩm</h3>
                        <p className="text-sm text-gray-500">Thử thay đổi bộ lọc</p>
                    </div>
                )}
            </div>
        </div>
    );
}