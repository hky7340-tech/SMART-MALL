import React, { useState } from 'react';
import toast from 'react-hot-toast';
import Modal, { FormField } from './_components/Modal';
import { formatPrice, formatNumber } from '@/utils/format';

interface Store {
    id: number; name: string; owner: string; floor: number; unit: string;
    category: string; status: 'active' | 'closed' | 'maintenance';
    revenue: number; orders: number; rating: number; contractEnd: string;
    phone?: string; email?: string;
}

const initStores: Store[] = [
    { id: 1, name: 'Fashion Hub', owner: 'Nguyễn Văn A', floor: 1, unit: 'L1-01', category: 'Thời trang', status: 'active', revenue: 3800000000, orders: 12500, rating: 4.5, contractEnd: '2025-12-31', phone: '0911111111', email: 'fashionhub@email.com' },
    { id: 2, name: 'TechZone', owner: 'Lê Văn C', floor: 3, unit: 'L3-10', category: 'Điện tử', status: 'active', revenue: 5200000000, orders: 8900, rating: 4.7, contractEnd: '2026-06-30', phone: '0922222222', email: 'techzone@email.com' },
    { id: 3, name: 'Trà Sữa Đài Loan', owner: 'Trần Thị B', floor: 2, unit: 'L2-05', category: 'Ẩm thực', status: 'active', revenue: 980000000, orders: 25000, rating: 4.3, contractEnd: '2025-09-30', phone: '0933333333', email: 'tradtl@email.com' },
    { id: 4, name: 'Hải Sản Biển Đông', owner: 'Phạm Văn D', floor: 4, unit: 'L4-02', category: 'Nhà hàng', status: 'active', revenue: 2100000000, orders: 5600, rating: 4.6, contractEnd: '2026-03-31' },
    { id: 5, name: 'Galaxy Cinema', owner: 'Hoàng Văn E', floor: 5, unit: 'L5-01', category: 'Giải trí', status: 'active', revenue: 750000000, orders: 18000, rating: 4.4, contractEnd: '2027-12-31' },
    { id: 6, name: 'Nhà Sách Minh Khai', owner: 'Vũ Thị H', floor: 2, unit: 'L2-08', category: 'Sách', status: 'active', revenue: 450000000, orders: 7800, rating: 4.8, contractEnd: '2025-06-30' },
    { id: 7, name: 'Game Center', owner: 'Đặng Văn F', floor: 5, unit: 'L5-10', category: 'Giải trí', status: 'closed', revenue: 320000000, orders: 4500, rating: 4.1, contractEnd: '2024-12-31' },
    { id: 8, name: 'Tiệm Bánh Sweet Home', owner: 'Ngô Thị G', floor: 1, unit: 'L1-15', category: 'Ẩm thực', status: 'active', revenue: 280000000, orders: 9200, rating: 4.5, contractEnd: '2025-03-31' },
    { id: 9, name: 'Spa & Beauty', owner: 'Lý Thị M', floor: 4, unit: 'L4-08', category: 'Dịch vụ', status: 'maintenance', revenue: 180000000, orders: 3200, rating: 4.2, contractEnd: '2025-08-31' },
    { id: 10, name: 'Thế Giới Đồ Chơi', owner: 'Trịnh Văn N', floor: 2, unit: 'L2-12', category: 'Đồ chơi', status: 'active', revenue: 520000000, orders: 11000, rating: 4.6, contractEnd: '2026-01-31' },
];

export default function StoresPage() {
    const [stores, setStores] = useState<Store[]>(initStores);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [showModal, setShowModal] = useState(false);
    const [editingStore, setEditingStore] = useState<Store | null>(null);
    const [viewingStore, setViewingStore] = useState<Store | null>(null);

    const [formData, setFormData] = useState({ name: '', owner: '', floor: 1, unit: '', category: 'Thời trang', status: 'active' as Store['status'], phone: '', email: '', contractEnd: '' });

    const categories = ['Thời trang', 'Điện tử', 'Ẩm thực', 'Nhà hàng', 'Giải trí', 'Sách', 'Dịch vụ', 'Đồ chơi'];

    const filteredStores = stores.filter(s => {
        const q = searchQuery.toLowerCase();
        return (s.name.toLowerCase().includes(q) || s.owner.toLowerCase().includes(q)) &&
            (statusFilter === 'all' || s.status === statusFilter);
    });

    const totalRevenue = stores.reduce((s, st) => s + st.revenue, 0);
    const avgRating = (stores.reduce((s, st) => s + st.rating, 0) / stores.length).toFixed(1);

    const openAdd = () => {
        setEditingStore(null);
        setFormData({ name: '', owner: '', floor: 1, unit: '', category: 'Thời trang', status: 'active', phone: '', email: '', contractEnd: '' });
        setShowModal(true);
    };

    const openEdit = (store: Store) => {
        setEditingStore(store);
        setFormData({ name: store.name, owner: store.owner, floor: store.floor, unit: store.unit, category: store.category, status: store.status, phone: store.phone || '', email: store.email || '', contractEnd: store.contractEnd });
        setShowModal(true);
    };

    const handleSave = () => {
        if (!formData.name || !formData.owner) { toast.error('Tên cửa hàng và chủ shop là bắt buộc'); return; }
        if (editingStore) {
            setStores(prev => prev.map(s => s.id === editingStore.id ? { ...s, ...formData } : s));
            toast.success('Đã cập nhật cửa hàng!');
        } else {
            const newStore: Store = { id: Math.max(...stores.map(s => s.id)) + 1, ...formData, revenue: 0, orders: 0, rating: 0 };
            setStores(prev => [...prev, newStore]);
            toast.success('Đã thêm cửa hàng mới!');
        }
        setShowModal(false);
    };

    const handleDelete = (id: number) => {
        if (confirm('Bạn có chắc muốn xóa cửa hàng này?')) {
            setStores(prev => prev.filter(s => s.id !== id));
            toast.success('Đã xóa cửa hàng!');
        }
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">🏪 Cửa hàng</h1>
                    <p className="text-sm text-gray-500 mt-1">Quản lý cửa hàng, tầng, hợp đồng thuê</p>
                </div>
                <button onClick={openAdd} className="btn-primary">+ Thêm cửa hàng</button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                <div className="stat-card"><p className="text-sm text-gray-500">Tổng</p><p className="text-2xl font-bold">{stores.length}</p></div>
                <div className="stat-card"><p className="text-sm text-gray-500">Hoạt động</p><p className="text-2xl font-bold text-green-600">{stores.filter(s => s.status === 'active').length}</p></div>
                <div className="stat-card"><p className="text-sm text-gray-500">Bảo trì</p><p className="text-2xl font-bold text-yellow-600">{stores.filter(s => s.status === 'maintenance').length}</p></div>
                <div className="stat-card"><p className="text-sm text-gray-500">Đã đóng</p><p className="text-2xl font-bold text-red-600">{stores.filter(s => s.status === 'closed').length}</p></div>
                <div className="stat-card"><p className="text-sm text-gray-500">Doanh thu</p><p className="text-2xl font-bold">{formatPrice(totalRevenue)}</p></div>
                <div className="stat-card"><p className="text-sm text-gray-500">Đánh giá TB</p><p className="text-2xl font-bold text-yellow-500">⭐ {avgRating}</p></div>
            </div>

            {/* Filters */}
            <div className="card">
                <div className="card-body">
                    <div className="flex flex-col sm:flex-row gap-3">
                        <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Tìm kiếm..." className="input-field flex-1" />
                        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="select-field w-auto">
                            <option value="all">Tất cả</option>
                            <option value="active">Hoạt động</option>
                            <option value="maintenance">Bảo trì</option>
                            <option value="closed">Đã đóng</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="card overflow-hidden">
                <div className="table-container">
                    <table>
                        <thead><tr><th>Tên</th><th>Chủ shop</th><th>Vị trí</th><th>Danh mục</th><th>Trạng thái</th><th className="text-right">Doanh thu</th><th className="text-center">Thao tác</th></tr></thead>
                        <tbody>
                            {filteredStores.map(store => (
                                <tr key={store.id}>
                                    <td><p className="font-medium">{store.name}</p><p className="text-xs text-gray-500">HĐ: {store.contractEnd}</p></td>
                                    <td>{store.owner}</td>
                                    <td><span className="inline-flex items-center gap-1 bg-gray-100 px-2 py-0.5 rounded text-xs">🏢 Tầng {store.floor} - {store.unit}</span></td>
                                    <td>{store.category}</td>
                                    <td><span className={`badge ${store.status === 'active' ? 'badge-success' : store.status === 'maintenance' ? 'badge-warning' : 'badge-danger'}`}>{store.status === 'active' ? 'Hoạt động' : store.status === 'maintenance' ? 'Bảo trì' : 'Đã đóng'}</span></td>
                                    <td className="text-right font-semibold">{formatPrice(store.revenue)}</td>
                                    <td className="text-center"><div className="flex items-center justify-center gap-1">
                                        <button onClick={() => setViewingStore(store)} className="btn-ghost btn-xs">👁️</button>
                                        <button onClick={() => openEdit(store)} className="btn-ghost btn-xs">✏️</button>
                                        <button onClick={() => handleDelete(store.id)} className="btn-ghost btn-xs">🗑️</button>
                                    </div></td>
                                </tr>
                            ))}
                            {filteredStores.length === 0 && <tr><td colSpan={7}><div className="empty-state py-8"><p>Không tìm thấy</p></div></td></tr>}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add/Edit Modal */}
            <Modal open={showModal} onClose={() => setShowModal(false)} title={editingStore ? 'Sửa cửa hàng' : 'Thêm cửa hàng'}>
                <FormField label="Tên cửa hàng"><input value={formData.name} onChange={e => setFormData(p => ({ ...p, name: e.target.value }))} className="input-field" placeholder="Nhập tên cửa hàng" /></FormField>
                <FormField label="Chủ shop"><input value={formData.owner} onChange={e => setFormData(p => ({ ...p, owner: e.target.value }))} className="input-field" placeholder="Tên chủ shop" /></FormField>
                <div className="grid grid-cols-2 gap-4">
                    <FormField label="Tầng"><input type="number" value={formData.floor} onChange={e => setFormData(p => ({ ...p, floor: Number(e.target.value) }))} className="input-field" /></FormField>
                    <FormField label="Mã gian hàng"><input value={formData.unit} onChange={e => setFormData(p => ({ ...p, unit: e.target.value }))} className="input-field" placeholder="VD: L1-01" /></FormField>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <FormField label="Danh mục"><select value={formData.category} onChange={e => setFormData(p => ({ ...p, category: e.target.value }))} className="select-field">{categories.map(c => <option key={c} value={c}>{c}</option>)}</select></FormField>
                    <FormField label="Trạng thái"><select value={formData.status} onChange={e => setFormData(p => ({ ...p, status: e.target.value as Store['status'] }))} className="select-field">
                        <option value="active">Hoạt động</option><option value="maintenance">Bảo trì</option><option value="closed">Đã đóng</option>
                    </select></FormField>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <FormField label="SĐT"><input value={formData.phone} onChange={e => setFormData(p => ({ ...p, phone: e.target.value }))} className="input-field" /></FormField>
                    <FormField label="Email"><input value={formData.email} onChange={e => setFormData(p => ({ ...p, email: e.target.value }))} className="input-field" /></FormField>
                </div>
                <FormField label="Ngày hết hạn hợp đồng"><input type="date" value={formData.contractEnd} onChange={e => setFormData(p => ({ ...p, contractEnd: e.target.value }))} className="input-field" /></FormField>
                <div className="flex justify-end gap-3 mt-6">
                    <button onClick={() => setShowModal(false)} className="btn-secondary">Hủy</button>
                    <button onClick={handleSave} className="btn-primary">{editingStore ? 'Cập nhật' : 'Thêm mới'}</button>
                </div>
            </Modal>

            {/* View Modal */}
            <Modal open={!!viewingStore} onClose={() => setViewingStore(null)} title="Chi tiết cửa hàng" size="sm">
                {viewingStore && (
                    <div className="space-y-3">
                        <div className="flex items-center gap-3 pb-3 border-b"><div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-xl text-white">🏪</div><div><h3 className="font-semibold text-lg">{viewingStore.name}</h3><p className="text-sm text-gray-500">{viewingStore.owner}</p></div></div>
                        <div className="grid grid-cols-2 gap-3 text-sm">{[
                            ['📍 Vị trí', `Tầng ${viewingStore.floor} - ${viewingStore.unit}`],
                            ['📂 Danh mục', viewingStore.category],
                            ['📞 SĐT', viewingStore.phone || '---'],
                            ['✉️ Email', viewingStore.email || '---'],
                            ['💰 Doanh thu', formatPrice(viewingStore.revenue)],
                            ['📦 Đơn hàng', formatNumber(viewingStore.orders)],
                            ['⭐ Đánh giá', `${viewingStore.rating}`],
                            ['📄 Hợp đồng đến', viewingStore.contractEnd],
                        ].map(([label, value]) => (
                            <div key={label as string} className="flex justify-between"><span className="text-gray-500">{label}</span><span className="font-medium">{value}</span></div>
                        ))}</div>
                        <div className="pt-3 border-t"><span className={`badge ${viewingStore.status === 'active' ? 'badge-success' : viewingStore.status === 'maintenance' ? 'badge-warning' : 'badge-danger'}`}>{viewingStore.status === 'active' ? '🟢 Đang hoạt động' : viewingStore.status === 'maintenance' ? '🟡 Bảo trì' : '🔴 Đã đóng'}</span></div>
                    </div>
                )}
            </Modal>
        </div>
    );
}