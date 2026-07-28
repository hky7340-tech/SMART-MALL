import React, { useState } from 'react';
import toast from 'react-hot-toast';

const formatFullPrice = (amount: number) => {
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + '₫';
};

interface Order {
    id: string;
    customer: string;
    store: string;
    total: number;
    items: number;
    status: 'completed' | 'processing' | 'pending' | 'cancelled' | 'shipping';
    payment: 'cod' | 'banking' | 'wallet' | 'card';
    time: string;
    date: string;
}

const mockOrders: Order[] = [
    { id: 'DH001', customer: 'Nguyễn Văn A', store: 'Fashion Hub', total: 299000, items: 3, status: 'completed', payment: 'banking', time: '5 phút trước', date: '2024-07-27' },
    { id: 'DH002', customer: 'Trần Thị B', store: 'TechZone', total: 15999000, items: 1, status: 'processing', payment: 'card', time: '12 phút trước', date: '2024-07-27' },
    { id: 'DH003', customer: 'Lê Văn C', store: 'Trà Sữa Đài Loan', total: 49000, items: 2, status: 'pending', payment: 'cod', time: '20 phút trước', date: '2024-07-27' },
    { id: 'DH004', customer: 'Phạm Thị D', store: 'Hải Sản Biển Đông', total: 890000, items: 5, status: 'completed', payment: 'wallet', time: '30 phút trước', date: '2024-07-27' },
    { id: 'DH005', customer: 'Hoàng Văn E', store: 'Galaxy Cinema', total: 250000, items: 2, status: 'cancelled', payment: 'banking', time: '1 giờ trước', date: '2024-07-27' },
    { id: 'DH006', customer: 'Đặng Thị F', store: 'Fashion Hub', total: 1250000, items: 4, status: 'shipping', payment: 'cod', time: '2 giờ trước', date: '2024-07-27' },
    { id: 'DH007', customer: 'Bùi Văn G', store: 'TechZone', total: 4500000, items: 2, status: 'processing', payment: 'card', time: '3 giờ trước', date: '2024-07-26' },
    { id: 'DH008', customer: 'Vũ Thị H', store: 'Nhà Sách Minh Khai', total: 320000, items: 5, status: 'completed', payment: 'wallet', time: '4 giờ trước', date: '2024-07-26' },
];

const statusLabels: Record<string, string> = { completed: 'Hoàn thành', processing: 'Đang xử lý', pending: 'Chờ duyệt', cancelled: 'Đã hủy', shipping: 'Đang giao' };
const statusColors: Record<string, string> = { completed: 'badge-success', processing: 'badge-info', pending: 'badge-warning', cancelled: 'badge-danger', shipping: 'badge-purple' };
const paymentLabels: Record<string, string> = { cod: 'COD', banking: 'Chuyển khoản', wallet: 'Ví điện tử', card: 'Thẻ' };

export default function OrdersPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [dateFilter, setDateFilter] = useState('all');

    const filtered = mockOrders.filter(o => {
        const matchSearch = o.customer.toLowerCase().includes(searchQuery.toLowerCase()) || o.id.toLowerCase().includes(searchQuery.toLowerCase());
        const matchStatus = statusFilter === 'all' || o.status === statusFilter;
        return matchSearch && matchStatus;
    });

    const totalRevenue = mockOrders.reduce((s, o) => s + o.total, 0);

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">📋 Đơn hàng</h1>
                    <p className="text-sm text-gray-500 mt-1">Quản lý đơn hàng trong hệ thống</p>
                </div>
                <button onClick={() => toast.success('Tính năng xuất báo cáo')} className="btn-secondary">📥 Xuất báo cáo</button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="stat-card"><p className="text-sm text-gray-500">Tổng đơn</p><p className="text-2xl font-bold">{mockOrders.length}</p></div>
                <div className="stat-card"><p className="text-sm text-gray-500">Đang xử lý</p><p className="text-2xl font-bold text-blue-600">{mockOrders.filter(o => o.status === 'processing' || o.status === 'shipping').length}</p></div>
                <div className="stat-card"><p className="text-sm text-gray-500">Hoàn thành</p><p className="text-2xl font-bold text-green-600">{mockOrders.filter(o => o.status === 'completed').length}</p></div>
                <div className="stat-card"><p className="text-sm text-gray-500">Doanh thu</p><p className="text-2xl font-bold">{formatFullPrice(totalRevenue)}</p></div>
            </div>

            <div className="card"><div className="card-body">
                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="flex-1 relative">
                        <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Tìm kiếm mã đơn, khách hàng..." className="input-field pl-10" />
                        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                    </div>
                    <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="select-field w-auto">
                        <option value="all">Tất cả trạng thái</option>
                        <option value="pending">Chờ duyệt</option>
                        <option value="processing">Đang xử lý</option>
                        <option value="shipping">Đang giao</option>
                        <option value="completed">Hoàn thành</option>
                        <option value="cancelled">Đã hủy</option>
                    </select>
                    <select value={dateFilter} onChange={e => setDateFilter(e.target.value)} className="select-field w-auto">
                        <option value="all">Tất cả thời gian</option>
                        <option value="today">Hôm nay</option>
                        <option value="week">Tuần này</option>
                        <option value="month">Tháng này</option>
                    </select>
                </div>
            </div></div>

            <div className="card overflow-hidden">
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Mã đơn</th>
                                <th>Khách hàng</th>
                                <th>Cửa hàng</th>
                                <th className="text-right">Số lượng</th>
                                <th className="text-right">Tổng tiền</th>
                                <th>Thanh toán</th>
                                <th>Trạng thái</th>
                                <th>Thời gian</th>
                                <th className="text-center">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map(order => (
                                <tr key={order.id}>
                                    <td><span className="font-mono font-medium text-sm">{order.id}</span></td>
                                    <td className="text-sm font-medium">{order.customer}</td>
                                    <td className="text-sm">{order.store}</td>
                                    <td className="text-right">{order.items}</td>
                                    <td className="text-right font-semibold">{formatFullPrice(order.total)}</td>
                                    <td><span className="badge badge-neutral">{paymentLabels[order.payment]}</span></td>
                                    <td><span className={`badge ${statusColors[order.status]}`}>{statusLabels[order.status]}</span></td>
                                    <td className="text-xs text-gray-500">{order.time}</td>
                                    <td className="text-center">
                                        <div className="flex items-center justify-center gap-1">
                                            <button onClick={() => toast.success('Xem chi tiết đơn hàng')} className="btn-ghost btn-xs">👁️</button>
                                            <button onClick={() => toast.success('Cập nhật trạng thái')} className="btn-ghost btn-xs">✏️</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {filtered.length === 0 && (
                    <div className="empty-state">
                        <div className="empty-state-icon">📋</div>
                        <h3 className="text-lg font-medium mb-1">Không tìm thấy đơn hàng</h3>
                        <p className="text-sm text-gray-500">Thử thay đổi bộ lọc</p>
                    </div>
                )}
            </div>
        </div>
    );
}