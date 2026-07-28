import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { formatNumber, formatFullPrice } from '@/utils/format';

interface InventoryItem {
    id: number;
    product: string;
    sku: string;
    store: string;
    category: string;
    inStock: number;
    reserved: number;
    available: number;
    minStock: number;
    maxStock: number;
    lastRestocked: string;
    status: 'in_stock' | 'low_stock' | 'out_of_stock' | 'overstock';
}

const mockInventory: InventoryItem[] = [
    { id: 1, product: 'Áo thun nam cao cấp', sku: 'ATN-001', store: 'Fashion Hub', category: 'Thời trang', inStock: 300, reserved: 55, available: 245, minStock: 50, maxStock: 500, lastRestocked: '2 ngày trước', status: 'in_stock' },
    { id: 2, product: 'Điện thoại XYZ Pro', sku: 'DT-002', store: 'TechZone', category: 'Điện tử', inStock: 80, reserved: 24, available: 56, minStock: 20, maxStock: 200, lastRestocked: '5 ngày trước', status: 'in_stock' },
    { id: 3, product: 'Kem dưỡng da mặt', sku: 'KDD-003', store: 'Fashion Hub', category: 'Mỹ phẩm', inStock: 0, reserved: 0, available: 0, minStock: 30, maxStock: 200, lastRestocked: '10 ngày trước', status: 'out_of_stock' },
    { id: 4, product: 'Tai nghe Bluetooth', sku: 'TN-004', store: 'TechZone', category: 'Điện tử', inStock: 150, reserved: 30, available: 120, minStock: 20, maxStock: 300, lastRestocked: '3 ngày trước', status: 'in_stock' },
    { id: 5, product: 'Áo khoác jean', sku: 'AK-005', store: 'Fashion Hub', category: 'Thời trang', inStock: 35, reserved: 7, available: 28, minStock: 20, maxStock: 100, lastRestocked: '7 ngày trước', status: 'low_stock' },
    { id: 6, product: 'Bánh mì que', sku: 'BM-006', store: 'Tiệm Bánh Sweet Home', category: 'Ẩm thực', inStock: 600, reserved: 100, available: 500, minStock: 100, maxStock: 300, lastRestocked: '1 ngày trước', status: 'overstock' },
];

const statusLabels: Record<string, string> = { in_stock: 'Còn hàng', low_stock: 'Sắp hết', out_of_stock: 'Hết hàng', overstock: 'Tồn nhiều' };
const statusColors: Record<string, string> = { in_stock: 'badge-success', low_stock: 'badge-warning', out_of_stock: 'badge-danger', overstock: 'badge-info' };

export default function InventoryPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    const filtered = mockInventory.filter(item => {
        return (item.product.toLowerCase().includes(searchQuery.toLowerCase()) || item.sku.toLowerCase().includes(searchQuery.toLowerCase()))
            && (statusFilter === 'all' || item.status === statusFilter);
    });

    const totalValue = mockInventory.reduce((s, i) => s + (i.inStock * 100000), 0);

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">📦 Kho hàng</h1>
                    <p className="text-sm text-gray-500 mt-1">Quản lý tồn kho, xuất nhập, kiểm kê</p>
                </div>
                <div className="flex gap-2">
                    <button onClick={() => toast.success('Tính năng nhập kho')} className="btn-primary">📥 Nhập kho</button>
                    <button onClick={() => toast.success('Tính năng xuất kho')} className="btn-secondary">📤 Xuất kho</button>
                </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="stat-card"><p className="text-sm text-gray-500">Tổng SP</p><p className="text-2xl font-bold">{mockInventory.length}</p></div>
                <div className="stat-card stat-card-green"><p className="text-sm text-gray-500">Còn hàng</p><p className="text-2xl font-bold text-green-600">{mockInventory.filter(i => i.status === 'in_stock').length}</p></div>
                <div className="stat-card stat-card-red"><p className="text-sm text-gray-500">Hết hàng</p><p className="text-2xl font-bold text-red-600">{mockInventory.filter(i => i.status === 'out_of_stock').length}</p></div>
                <div className="stat-card stat-card-blue"><p className="text-sm text-gray-500">Tổng giá trị</p><p className="text-2xl font-bold text-blue-600">{formatFullPrice(totalValue)}</p></div>
            </div>

            <div className="card"><div className="card-body">
                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="flex-1 relative">
                        <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Tìm kiếm SP, mã SKU..." className="input-field pl-10" />
                        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                    </div>
                    <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="select-field w-auto">
                        <option value="all">Tất cả</option>
                        <option value="in_stock">Còn hàng</option>
                        <option value="low_stock">Sắp hết</option>
                        <option value="out_of_stock">Hết hàng</option>
                        <option value="overstock">Tồn nhiều</option>
                    </select>
                    <button onClick={() => toast.success('Đang kiểm kê...')} className="btn-secondary">📋 Kiểm kê</button>
                </div>
            </div></div>

            <div className="card overflow-hidden">
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Sản phẩm</th>
                                <th>SKU</th>
                                <th>Cửa hàng</th>
                                <th className="text-right">Tồn</th>
                                <th className="text-right">Đã giữ</th>
                                <th className="text-right">Khả dụng</th>
                                <th className="text-right">Tồn tối thiểu</th>
                                <th>Trạng thái</th>
                                <th>Nhập gần</th>
                                <th className="text-center">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map(item => (
                                <tr key={item.id}>
                                    <td className="text-sm font-medium">{item.product}</td>
                                    <td><span className="font-mono text-xs bg-gray-100 px-1.5 py-0.5 rounded">{item.sku}</span></td>
                                    <td className="text-sm">{item.store}</td>
                                    <td className="text-right font-medium">{formatNumber(item.inStock)}</td>
                                    <td className="text-right text-gray-500">{formatNumber(item.reserved)}</td>
                                    <td className="text-right font-semibold">{formatNumber(item.available)}</td>
                                    <td className="text-right">{formatNumber(item.minStock)}</td>
                                    <td><span className={`badge ${statusColors[item.status]}`}>{statusLabels[item.status]}</span></td>
                                    <td className="text-xs text-gray-500">{item.lastRestocked}</td>
                                    <td className="text-center">
                                        <div className="flex justify-center gap-1">
                                            <button onClick={() => toast.success('Điều chỉnh tồn kho')} className="btn-ghost btn-xs">✏️</button>
                                            <button onClick={() => toast.success('Lịch sử nhập/xuất')} className="btn-ghost btn-xs">📋</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}