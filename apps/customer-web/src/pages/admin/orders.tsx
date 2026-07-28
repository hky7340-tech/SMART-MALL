import React, { useState } from 'react';
import toast from 'react-hot-toast';
import Modal from './_components/Modal';

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
    address?: string;
    phone?: string;
    products?: { name: string; qty: number; price: number }[];
}

const mockOrders: Order[] = [
    { id: 'DH001', customer: 'Nguyễn Văn A', store: 'Fashion Hub', total: 299000, items: 3, status: 'completed', payment: 'banking', time: '5 phút trước', date: '2024-07-27', address: '123 Nguyễn Huệ, Q1, TP.HCM', phone: '0912345678', products: [{ name: 'Áo thun nam', qty: 2, price: 299000 }, { name: 'Quần jean', qty: 1, price: 499000 }] },
    { id: 'DH002', customer: 'Trần Thị B', store: 'TechZone', total: 15999000, items: 1, status: 'processing', payment: 'card', time: '12 phút trước', date: '2024-07-27', address: '456 Lê Lợi, Q3, TP.HCM', phone: '0923456789', products: [{ name: 'Điện thoại XYZ Pro', qty: 1, price: 15999000 }] },
    { id: 'DH003', customer: 'Lê Văn C', store: 'Trà Sữa Đài Loan', total: 49000, items: 2, status: 'pending', payment: 'cod', time: '20 phút trước', date: '2024-07-27', address: '789 Cách Mạng Tháng 8, Q10, TP.HCM', phone: '0934567890', products: [{ name: 'Trà sữa trân châu', qty: 2, price: 49000 }] },
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
    const [orders, setOrders] = useState(mockOrders);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [showDetail, setShowDetail] = useState(false);
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [newStatus, setNewStatus] = useState<string>('');

    const filtered = orders.filter(o => {
        const matchSearch = o.customer.toLowerCase().includes(searchQuery.toLowerCase()) || o.id.toLowerCase().includes(searchQuery.toLowerCase());
        const matchStatus = statusFilter === 'all' || o.status === statusFilter;
        return matchSearch && matchStatus;
    });

    const totalRevenue = orders.reduce((s, o) => s + o.total, 0);

    const handleViewDetail = (order: Order) => {
        setSelectedOrder(order);
        setShowDetail(true);
    };

    const handleUpdateStatus = (order: Order) => {
        setSelectedOrder(order);
        setNewStatus(order.status);
        setShowStatusModal(true);
    };

    const confirmStatusUpdate = () => {
        if (selectedOrder && newStatus !== selectedOrder.status) {
            setOrders(prev => prev.map(o => o.id === selectedOrder.id ? { ...o, status: newStatus as Order['status'] } : o));
            toast.success(`Đã cập nhật trạng thái đơn ${selectedOrder.id} thành ${statusLabels[newStatus]}`);
        }
        setShowStatusModal(false);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">📋 Đơn hàng</h1>
                    <p className="text-sm text-gray-500 mt-1">Quản lý đơn hàng trong hệ thống</p>
                </div>
                <button onClick={() => toast.success('Đang xuất báo cáo...')} className="btn-secondary">📥 Xuất báo cáo</button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="stat-card"><p className="text-sm text-gray-500">Tổng đơn</p><p className="text-2xl font-bold">{orders.length}</p></div>
                <div className="stat-card"><p className="text-sm text-gray-500">Đang xử lý</p><p className="text-2xl font-bold text-blue-600">{orders.filter(o => o.status === 'processing' || o.status === 'shipping').length}</p></div>
                <div className="stat-card"><p className="text-sm text-gray-500">Hoàn thành</p><p className="text-2xl font-bold text-green-600">{orders.filter(o => o.status === 'completed').length}</p></div>
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
                                            <button onClick={() => handleViewDetail(order)} className="btn-ghost btn-xs">👁️</button>
                                            <button onClick={() => handleUpdateStatus(order)} className="btn-ghost btn-xs">✏️</button>
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

            {/* Detail Modal */}
            <Modal open={showDetail} onClose={() => setShowDetail(false)} title={`Chi tiết đơn hàng #${selectedOrder?.id}`} size="lg">
                {selectedOrder && (
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-gray-50 p-3 rounded-lg"><p className="text-xs text-gray-500">Khách hàng</p><p className="font-medium">{selectedOrder.customer}</p></div>
                            <div className="bg-gray-50 p-3 rounded-lg"><p className="text-xs text-gray-500">Cửa hàng</p><p className="font-medium">{selectedOrder.store}</p></div>
                            <div className="bg-gray-50 p-3 rounded-lg"><p className="text-xs text-gray-500">SĐT</p><p className="font-medium">{selectedOrder.phone || 'N/A'}</p></div>
                            <div className="bg-gray-50 p-3 rounded-lg"><p className="text-xs text-gray-500">Địa chỉ</p><p className="font-medium">{selectedOrder.address || 'N/A'}</p></div>
                            <div className="bg-gray-50 p-3 rounded-lg"><p className="text-xs text-gray-500">Thanh toán</p><p className="font-medium">{paymentLabels[selectedOrder.payment]}</p></div>
                            <div className="bg-gray-50 p-3 rounded-lg"><p className="text-xs text-gray-500">Trạng thái</p><span className={`badge ${statusColors[selectedOrder.status]}`}>{statusLabels[selectedOrder.status]}</span></div>
                        </div>
                        <div><p className="font-medium text-gray-900 mb-2">Sản phẩm</p><div className="space-y-2">{selectedOrder.products?.map((p, i) => (
                            <div key={i} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"><span>{p.name} x{p.qty}</span><span className="font-medium">{formatFullPrice(p.price)}</span></div>
                        )) || <p className="text-sm text-gray-500">Không có thông tin</p>}</div></div>
                        <div className="flex justify-end gap-2 pt-2 border-t"><span className="text-lg font-bold text-primary-600">Tổng: {formatFullPrice(selectedOrder.total)}</span></div>
                    </div>
                )}
            </Modal>

            {/* Status Update Modal */}
            <Modal open={showStatusModal} onClose={() => setShowStatusModal(false)} title={`Cập nhật trạng thái #${selectedOrder?.id}`} size="sm">
                <div className="space-y-4">
                    <p className="text-sm text-gray-600">Chọn trạng thái mới cho đơn hàng:</p>
                    <div className="space-y-2">
                        {Object.entries(statusLabels).map(([key, label]) => (
                            <label key={key} className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${newStatus === key ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:bg-gray-50'}`}>
                                <input type="radio" name="status" value={key} checked={newStatus === key} onChange={e => setNewStatus(e.target.value)} className="text-primary-600" />
                                <span className="text-sm font-medium">{label}</span>
                            </label>
                        ))}
                    </div>
                    <div className="flex justify-end gap-2 pt-2">
                        <button onClick={() => setShowStatusModal(false)} className="btn-secondary">Hủy</button>
                        <button onClick={confirmStatusUpdate} className="btn-primary">Xác nhận</button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}